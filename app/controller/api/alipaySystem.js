const _ = require('lodash');
const alipayf2f = require("../../utils/alipay_f2f.js");
const qr = require('qr-image')
const uuidv1 = require('uuid/v1');
const {
    authToken
} = require('../../utils');
let AlipaySystemController = {

    async _checkUserToken(ctx, app, userToken) {
        if (!userToken) {
            return '';
        } else {
            let checkToken = await authToken.checkToken(userToken, app.config.encrypt_key);
            if (checkToken && typeof checkToken == 'object') {
                targetUser = await ctx.service.singleUser.item(ctx, {
                    query: {
                        _id: checkToken.userId
                    },
                    files: '_id'
                })
                if (!_.isEmpty(targetUser)) {
                    return targetUser;
                } else {
                    return '';
                }
            } else {
                return '';
            }
        }
    },

    // 获取已支付个人的订单信息
    async getPayedOne(ctx) {

        try {

            let userToken = ctx.query.singleUserToken;
            let type = ctx.query.type;
            let itemId = ctx.query.itemId;

            if (!itemId) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let userInfo = await this._checkUserToken(ctx, app, userToken);
            if (!userInfo) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let targetItem = await ctx.service.alipaySystem.item(ctx, {
                query: {
                    user: userInfo._id,
                    type,
                    templateModel: itemId,
                    state: true
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetItem
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },


    // 创建支付订单
    async createInvoice(ctx, app) {

        try {
            var amount = ctx.request.body.amount || "0.01";
            var paymentBody = ctx.request.body.body;
            var subject = ctx.request.body.subject;
            let userToken = ctx.request.body.singleUserToken;
            let itemId = ctx.request.body.itemId;
            let type = ctx.request.body.type;
            let userInfo = await this._checkUserToken(ctx, app, userToken);
            // console.log('--userInfo--', userInfo);
            if (!userInfo) {
                throw new Error(ctx.__('validate_error_params'));
            }

            if (!itemId) {
                throw new Error(ctx.__('validate_error_params'));
            }

            // 校验是否重复购买
            let checkOldParams = {
                user: userInfo._id,
                type,
                state: true
            }
            if (type == '1') {
                checkOldParams.templateModel = itemId;
            }
            let targetItem = await ctx.service.alipaySystem.item(ctx, {
                query: checkOldParams
            });
            if (!_.isEmpty(targetItem)) {
                throw new Error('请勿重复购买');
            }

            if (amount == "") {
                throw new Error("请填写金额");
            }
            amount = parseFloat(amount);
            if (isNaN(amount) || amount <= 0) {
                throw new Error("金额输入错误.");
            }
            /* 支付宝支持2位小数的金额 */
            amount = amount.toFixed(2);

            if (!subject || !paymentBody) {
                throw new Error(ctx.__('validate_error_params'));
            }

            /* 生成订单唯一编号 */
            var noInvoice = uuidv1().split('-').join('');

            /* 参数详细请翻源码 */
            const alipayTool = new alipayf2f(app.config.alipayOptions);

            let createQrResult = await alipayTool.createQRPay({
                tradeNo: noInvoice,
                subject: subject,
                totalAmount: amount,
                body: paymentBody
            });

            if (createQrResult.code != 10000) {
                console.error(createQrResult);
                throw new Error("支付宝网关返回错误, 请联系管理员.");
            }

            let payInfoParams = {
                user: userInfo._id,
                outTradeNo: noInvoice,
                state: false,
                type,
            }

            if (type == '1') {
                payInfoParams.templateModel = itemId;
            }

            await ctx.service.alipaySystem.create(payInfoParams);

            ctx.helper.renderSuccess(ctx, {
                data: {
                    qrCode: createQrResult["qrCode"],
                    noInvoice: noInvoice
                }
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }


    },

    // 创建支付二维码
    async createQRCode(ctx, app) {
        var text = ctx.request.query.text || "";
        if (text) {
            let img = qr.image(text, {
                size: 10
            });
            ctx.set('Content-Type', 'image/png');
            ctx.status = 200;
            ctx.body = img;
        } else {
            throw new Error(ctx.__('validate_error_params'));
        }
    },


    // 支付完成回调
    async payCallback(ctx, app) {

        try {
            console.log('--收到回调了--');
            let fields = ctx.request.body;
            const alipayTool = new alipayf2f(app.config.alipayOptions);
            var signStatus = alipayTool.verifyCallback(fields);
            if (signStatus === false) {
                throw new Error('回调签名验证未通过');
            }

            let notifyParams = {};
            if (fields.trade_no) {
                notifyParams.tradeNo = fields.trade_no;
            }
            if (fields.out_trade_no) {
                notifyParams.outTradeNo = fields.out_trade_no;
            } else {
                throw new siteFunc.UserException('未返回订单号');
            }
            if (fields.subject) {
                notifyParams.subject = fields.subject;
            }
            if (fields.body) {
                notifyParams.subject = fields.body;
            }
            if (fields.buyer_pay_amount) {
                notifyParams.totalAmount = fields.buyer_pay_amount;
            }

            if (fields.gmt_create) {
                notifyParams.gmtCreate = fields.gmt_create;
            }
            if (fields.gmt_payment) {
                notifyParams.gmtPayment = fields.gmt_payment;
            }
            if (fields.gmt_refund) {
                notifyParams.gmtRefund = fields.gmt_refund;
            }
            if (fields.gmt_close) {
                notifyParams.gmtClose = fields.gmt_close;
            }

            if (fields.trade_status) {
                notifyParams.tradeStatus = fields.trade_status;
                if (fields.trade_status == 'TRADE_SUCCESS') {
                    notifyParams.state = true;
                }
            }

            await ctx.service.alipaySystem.update(ctx, '', notifyParams, {
                outTradeNo: notifyParams.outTradeNo
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


    // 校验交易状态
    async checkInvoice(ctx, app) {
        try {
            var noInvoice = ctx.request.body.noInvoice || "";
            let userToken = ctx.request.body.singleUserToken;
            let userInfo = await this._checkUserToken(ctx, app, userToken);

            if (!userInfo) {
                throw new Error(ctx.__('validate_error_params'));
            }

            if (noInvoice == "") {
                throw new Error("订单号不能为空");
            }
            let oldPaylog = await ctx.service.alipaySystem.item(ctx, {
                query: {
                    outTradeNo: noInvoice.noInvoice,
                    user: userInfo._id
                }
            })

            let checkState = false;
            if (!_.isEmpty(oldPaylog) && oldPaylog.state) {
                checkState = true;
            }

            ctx.helper.renderSuccess(ctx, {
                data: {
                    checkState
                }
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


}

module.exports = AlipaySystemController;