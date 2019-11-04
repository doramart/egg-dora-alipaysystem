module.exports = app => {
    const mongoose = app.mongoose
    var shortid = require('shortid');
    var path = require('path');
    var Schema = mongoose.Schema;
    var moment = require('moment')

    var AlipaySystemSchema = new Schema({
        _id: {
            type: String,
            'default': shortid.generate
        },
        createTime: {
            type: Date,
        },
        updateTime: {
            type: Date,
        },
        type: {
            type: String,
            default: '1'
        }, // 类型 1、模板 2、插件
        templateModel: {
            type: String,
            ref: 'CmsTemplate'
        },
        gmtCreate: String, // 创建时间 
        gmtPayment: String, // 付款时间 
        gmtRefund: String, // 退款时间 
        gmtClose: String, // 结束时间 
        user: {
            type: String,
            ref: 'SingleUser'
        }, // 关联用户 
        totalAmount: String, // 转账钱数 
        tradeNo: String, // 支付宝交易号 
        outTradeNo: String, // 订单号 
        tradeStatus: String, // 支付状态 
        productCode: String, // 产品编号 
        subject: String, // 商品标题 
        body: String, // 交易详情 
        state: { // 是否支付成功，交易状态
            type: Boolean,
            default: false
        }, // 是否支付成功

    });

    AlipaySystemSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
    AlipaySystemSchema.set('toObject', {
        getters: true,
        virtuals: true
    });

    AlipaySystemSchema.path('createTime').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });
    AlipaySystemSchema.path('updateTime').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });

    return mongoose.model("AlipaySystem", AlipaySystemSchema, 'alipaysystems');

}