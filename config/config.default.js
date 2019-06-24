/* eslint valid-jsdoc: "off" */
'use strict';
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1559482685588_4422';
  // add your middleware config here
  config.middleware = ['adminauth'];
  config.adminauth={
     match: '/admin',   /* 指定路由的中间件 */
  };
  config.uploadDir='app/public/admin/upload/';
  config.session={
    key: 'EGG_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,  //只能nodejs调用
    encrypt: true,  //session加密
    renew: true,  //刷新用户的延长期
  };
  config.view={
    mapping: {
      '.html': 'ejs',
    },
  };
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/xiaomishop',
      options: {}
    },
  };
  //配置表单数量
  config.multipart = {
    fields: '50'
  };
  config.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      ignore: ctx => {
        if(ctx.request.url=='/admin/goods/goodsUploadImage'||ctx.request.url=='/admin/goods/goodsUploadPhoto'){
          return true;
        }
        return false;
      }
    }
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  return {
    ...config,
    ...userConfig,
  };
};
