'use strict';
const  BaseController=require('../admin/base');
class LoginController extends BaseController {
  async index() {
    const { ctx } = this;
    await ctx.render('login');
  }
  async doLogin() {
    const { ctx } = this;
    /*获取Post表单传递过来的数值*/
    const username=ctx.request.body.username;
    const password=await ctx.service.tools.md5(ctx.request.body.password); /* 用户输入的密码md5加密*/
    const verify=ctx.request.body.verify;
    /*
        1: 判断验证码是否输入正确 忽略大小写
        2: 创建mongoose  连接mongodb数据库
        3: 利用数据库模型操作数据库  判断 用户输入的账号,加密的密码和数据库是否一致
     */
    if (ctx.session.code.toLowerCase()==verify.toLowerCase()){
            const res=await ctx.model.Admin.Admin.find({username,password});
            if (res.length>0){
                /*    1:创建用户session 2: 跳转到用户页面
                */
                ctx.session.userinfo=res[0];
                await ctx.redirect('/admin/manager');
            }else {
                await this.error('/admin/login','账号密码输入错误!!!')
            }
    }else {
      //跳转到错误页面   控制器基类实现
     await this.error('/admin/login','验证码输入错误!!!')
    }
  }
  async logOut(){
    const { ctx } = this;
    ctx.session.userinfo=null;
    ctx.redirect('/admin/login')
  }
}
module.exports = LoginController;
