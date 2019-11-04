const _ = require('lodash');
const alipaySystemAdminController = require('../controller/manage/alipaySystem')
const alipaySystemApiController = require('../controller/api/alipaySystem')

module.exports = (options, app) => {

    return async function alipaySystemRouter(ctx, next) {

        let pluginConfig = app.config.doraAlipaySystem;
        await app.initPluginRouter(ctx, pluginConfig, alipaySystemAdminController, alipaySystemApiController);
        await next();

    }

}