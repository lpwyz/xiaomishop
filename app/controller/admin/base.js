//父类，基类
'use strict';
const Controller = require('egg').Controller;
class BaseController extends Controller {
  //公共的成功方法
  async success(redirectUrl,message) {
    const { ctx } = this;
    await  ctx.render('public/success',{redirectUrl,message})
  }
  //公共的失败方法
  async error(redirectUrl,message) {
    const { ctx } = this;
    await  ctx.render('public/error',{redirectUrl,message})
  }
  //公共的删除信息方法
  async delete() {
    const { ctx } = this;
    const  data=ctx.request.query.data;
    const  _id=ctx.request.query._id;
    /**
     *   注意   js里面获取对象    const obj={ name: zjt }
     *          1:   obj.name
     *          2:   obj[name]
     */
    await ctx.model.Admin[data].deleteOne({_id});
    /*  返回上一个页面 */
    await ctx.redirect(ctx.state.prePage);
  }
  //公共的前台登入验证码
  async verify() {
    const { ctx,service } = this;
    const captcha=await service.tools.verify(); /* 获取服务里面返回的生成的验证码信息 */
    ctx.response.type = 'image/svg+xml';  /* 返回的生成的验证码的格式 */
    ctx.body=captcha.data;  /* 给页面返回一张图片 */
  }
}
module.exports = BaseController;
