const xss = require("xss");
const _ = require('lodash');

const alipaySystemRule = (ctx) => {
    return {
        
        type: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("类型")])
        },

      
        gmtCreate: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("创建时间")])
        },

      
        gmtPayment: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("付款时间")])
        },

      
        gmtRefund: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("退款时间")])
        },

      
        gmtClose: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("结束时间")])
        },

      
        user: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("关联用户")])
        },

      
        totalAmount: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("转账钱数")])
        },

      
        tradeNo: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("支付宝交易号")])
        },

      
        outTradeNo: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("订单号")])
        },

      
        tradeStatus: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("支付状态")])
        },

      
        productCode: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("产品编号")])
        },

      
        subject: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("商品标题")])
        },

      
        body: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("交易详情")])
        },

      
        state: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("交易状态")])
        },

      
    }
}



let AlipaySystemController = {

    async list(ctx) {

        try {

            let payload = ctx.query;
            let queryObj = {};

            let alipaySystemList = await ctx.service.alipaySystem.find(payload, {
                query: queryObj,
            });

            ctx.helper.renderSuccess(ctx, {
                data: alipaySystemList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async create(ctx) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {
                
     
        type:fields.type, 

  
      
     
        gmtCreate:fields.gmtCreate, 

  
      
     
        gmtPayment:fields.gmtPayment, 

  
      
     
        gmtRefund:fields.gmtRefund, 

  
      
     
        gmtClose:fields.gmtClose, 

  
      
     
        user:fields.user, 

  
      
     
        totalAmount:fields.totalAmount, 

  
      
     
        tradeNo:fields.tradeNo, 

  
      
     
        outTradeNo:fields.outTradeNo, 

  
      
     
        tradeStatus:fields.tradeStatus, 

  
      
     
        productCode:fields.productCode, 

  
      
     
        subject:fields.subject, 

  
      
     
        body:fields.body, 

  
      
     
        state:fields.state, 

  
      
                createTime: new Date()
            }


            ctx.validate(alipaySystemRule(ctx), formObj);



            await ctx.service.alipaySystem.create(formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    async getOne(ctx) {

        try {
            let _id = ctx.query.id;

            let targetItem = await ctx.service.alipaySystem.item(ctx, {
                query: {
                    _id: _id
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


    async update(ctx) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {
                
     
        type:fields.type, 

  
      
     
        gmtCreate:fields.gmtCreate, 

  
      
     
        gmtPayment:fields.gmtPayment, 

  
      
     
        gmtRefund:fields.gmtRefund, 

  
      
     
        gmtClose:fields.gmtClose, 

  
      
     
        user:fields.user, 

  
      
     
        totalAmount:fields.totalAmount, 

  
      
     
        tradeNo:fields.tradeNo, 

  
      
     
        outTradeNo:fields.outTradeNo, 

  
      
     
        tradeStatus:fields.tradeStatus, 

  
      
     
        productCode:fields.productCode, 

  
      
     
        subject:fields.subject, 

  
      
     
        body:fields.body, 

  
      
     
        state:fields.state, 

  
      
                updateTime: new Date()
            }


            ctx.validate(alipaySystemRule(ctx), formObj);



            await ctx.service.alipaySystem.update(ctx, fields._id, formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    async removes(ctx) {

        try {
            let targetIds = ctx.query.ids;
            await ctx.service.alipaySystem.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

}

module.exports = AlipaySystemController;