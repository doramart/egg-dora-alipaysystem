'use strict'

/**
 * egg-dora-alipaysystem default config
 * @member Config#eggDoraAlipaySystem
 * @property {String} SOME_KEY - some description
 */

const pkgInfo = require('../package.json');
exports.doraAlipaySystem = {
    alias: 'alipaySystem', // 插件目录，必须为英文
    pkgName: 'egg-dora-alipaysystem', // 插件包名
    enName: 'doraAlipaySystem', // 插件名
    name: '交易记录', // 插件名称
    description: '交易记录', // 插件描述
    isadm: 1, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/devteam/admin/index'
    isindex: 0, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/devteam/index/index'
    version: pkgInfo.version, // 版本号
    iconName: 'icon_service', // 主菜单图标名称
    adminUrl: 'https://cdn.html-js.cn/cms/plugins/static/admin/alipaySystem/js/app.js',
    adminApi: [{
        url: 'alipaySystem/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取交易记录列表',
    }, {
        url: 'alipaySystem/getOne',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单条交易记录信息',
    }, {
        url: 'alipaySystem/addOne',
        method: 'post',
        controllerName: 'create',
        details: '添加单个交易记录',
    }, {
        url: 'alipaySystem/updateOne',
        method: 'post',
        controllerName: 'update',
        details: '更新交易记录信息',
    }, {
        url: 'alipaySystem/delete',
        method: 'get',
        controllerName: 'removes',
        details: '删除交易记录',
    }],
    fontApi: [{
        url: 'alipaySystem/getPayedOne',
        method: 'post',
        controllerName: 'getPayedOne',
        details: '获取已支付订单详情',
    }, {
        url: 'alipaySystem/createInvoice',
        method: 'post',
        controllerName: 'createInvoice',
        details: '创建支付订单',
    }, {
        url: 'alipaySystem/createQRCode',
        method: 'get',
        controllerName: 'createQRCode',
        details: '创建支付二维码',
    }, {
        url: 'alipaySystem/payCallback',
        method: 'post',
        controllerName: 'payCallback',
        details: '支付完成回调',
    }, {
        url: 'alipaySystem/checkInvoice',
        method: 'post',
        controllerName: 'checkInvoice',
        details: '校验交易状态',
    }],

    initData: '', // 初始化数据脚本
    pluginsConfig: ` 
    exports.doraAlipaySystem = {\n
        enable: true,\n
         \n
    };\n
    `, // 插入到 plugins.js 中的配置
    defaultConfig: `
    alipaySystemRouter:{\n
        match: [ctx => ctx.path.startsWith('/manage/alipaySystem'), ctx => ctx.path.startsWith('/api/alipaySystem')],\n
    },\n
    `, // 插入到 config.default.js 中的配置
}