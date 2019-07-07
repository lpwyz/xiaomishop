//父类，基类
'use strict';
const Controller = require('egg').Controller;
const fs=require('fs');
const path=require('path');
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
    /* 判断如果是删除的轮播图，在删除数据库的同时，还应该删除对应保存在服务器里面的文件*/
    if (data=='Focus'){
      /* 修改了图片需要把原来的图片删除*/
      const res=await ctx.model.Admin[data].find({_id});
      const oldpath=res[0].focus_img;
      const oldpathinapp=path.join('app'+oldpath);
      fs.unlink(oldpathinapp,(err,data)=>{
        if(err){
          console.log('删除失败');
        }else {
          console.log('删除成功');
        }
      });
    }
    await ctx.model.Admin[data].deleteOne({_id});
    /*  返回上一个页面 */
    await ctx.redirect(ctx.state.prePage);
  }
  //公共的前台登入验证码
  async verify() {
    const { ctx,service } = this;
    const captcha=await service.tools.verify(); /* 获取服务里面返回的生成的验证码信息 */
    this.ctx.session.code=captcha.text;  /* 验证码上面的信息,文字内容存放到session里面 */
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
  async editNum() {
    const { ctx } = this;
    /* 1:要修改的数据库表model
       2:更新的属性
       3:要修改的id
       4:要修改的数量或者顺序
    * */
    const model = ctx.request.query.model;
    const attr = ctx.request.query.attr;
    const id = ctx.request.query.id;
    const num = ctx.request.query.num;
    const result = await ctx.model.Admin[model].find({ "_id": id });
    if (result.length > 0) {
      var json = {/*es6 属性名表达式*/
        [attr]: num
      };
      //执行更新操作
      var updateResult = await this.ctx.model.Admin[model].updateOne({ "_id": id }, json);
      if (updateResult) {
        ctx.body = { "message": '更新成功', "success": true };
      } else {
        ctx.body = { "message": '更新失败', "success": false };
      }
    } else {
      ctx.body = { "message": '更新失败,参数错误', "success": false };
    }
  }
  /* ajax请求 判断 用户输入的原始密码是多少*/
  async checkPwd(){
    const {ctx}=this;
    const model = ctx.request.query.model;
    const attr = ctx.request.query.attr;
    const id = ctx.request.query.id;
    const num = ctx.request.query.num;
    /*输入的密码md5加密*/
    const pwd=await ctx.service.tools.md5(num);
    console.log(pwd);
    const result = await ctx.model.Admin[model].find({ "_id": id });
      if (result.length>0){
        console.log(result);
        if (pwd==result[0].password){
        ctx.body = { "message": '密码正确', "success": true };
      }
      else {
        ctx.body = { "message": '密码输入错误', "success": false };
      }
    } else {
      ctx.body = { "message": '参数错误', "success": false };
    }
  }
}
module.exports = BaseController;
