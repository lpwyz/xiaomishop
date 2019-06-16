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
  async changeStatus(){
    const {ctx}=this;
    /* 1:要修改的数据库表model
       2:更新的属性
       3:要修改的id
    * */
    const model=ctx.request.query.model;
    const attr=ctx.request.query.attr;
    const id=ctx.request.query.id;
    const result=await ctx.model.Admin[model].find({"_id":id});
    if(result.length>0){
      if(result[0][attr]==1){
        var json={/*es6 属性名表达式*/
          [attr]:0
        }
      }else{
        var json={
          [attr]:1
        }
      }
      //执行更新操作
      var updateResult=await this.ctx.model.Admin[model].updateOne({"_id":id},json);
      if(updateResult){
        this.ctx.body={"message":'更新成功',"success":true};
      }else{
        this.ctx.body={"message":'更新失败',"success":false};
      }
    }else{
      //接口
      this.ctx.body={"message":'更新失败,参数错误',"success":false};
    }
  }
}
module.exports = BaseController;
