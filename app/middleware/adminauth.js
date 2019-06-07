const url=require('url');
module.exports = options => {
  return async function adminauth(ctx, next) {
    //创建全局变量  csrf  模板页面就可以调用
    ctx.state.csrf=ctx.csrf;
    //创建全局变量  referer  记录上一页的地址
    ctx.state.prePage=ctx.request.headers['referer'];
    //除了 登入url，提交数据url，获取验证码url,其他的都需要查看用户是否登入过
    const  path=url.parse(ctx.request.url).pathname;
        if (path=='/admin/doLogin'||path=='/admin/login'||path=='/admin/verify') {
                     await  next();
        }else {
             if (ctx.session.userinfo==null) {
                await  ctx.redirect('/admin/login');
             }else {
                await  next();
             }
    }
  };
};
