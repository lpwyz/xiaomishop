const url=require('url');
module.exports = options => {
  return async function adminauth(ctx, next) {
    //创建全局变量  csrf  模板页面就可以调用
    ctx.state.csrf=ctx.csrf;
    //创建全局变量  referer  记录上一页的地址
    ctx.state.prePage=ctx.request.headers['referer'];
    //除了 登入url，提交数据url，获取验证码url,其他的都需要查看用户是否登入过
    const  path=url.parse(ctx.request.url).pathname;
    if (ctx.session.userinfo){
      ctx.state.userinfo=ctx.session.userinfo;  //全局变量
      const auth=await ctx.service.admin.checkauth();
      if (auth){
        await  next();
      }else {
        ctx.body='<h1 style="color: red;font-weight: bold;font-size: 35px;text-align: center">您没有权限访问当前地址</h1>';
    }
    } else {
      /*排除不需要做权限判断的地址*/
      if (path=='/admin/doLogin'||path=='/admin/login'||path=='/admin/verify') {
        await  next();
      }else {
          await  ctx.redirect('/admin/login');
      }
    }
  };
};
