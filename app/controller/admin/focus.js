'use strict';
const Controller = require('./base.js');
const pump = require('mz-modules/pump');
const fs=require('fs');
const path=require('path');
class FocusController extends Controller {
  async index() {
    const { ctx } = this;
    const list=await ctx.model.Admin.Focus.find({});
    await ctx.render('focus/index',{list});
  }
  async add() {
    const { ctx } = this;
    await ctx.render('focus/add');
  }
  async doAdd(){
     const { ctx } = this;
     //{ autoFields: true }:可以将除了文件的其它字段提取到 parts 的 filed 中*/
     const parts = ctx.multipart({ autoFields: true });
     let files = {}; /* 存放到数组，到时候一次性上传多个图片，不方便获取其中的指定的文件保存位置，所以存放到对象*/
     let stream;
     while ((stream = await parts()) != null) {
      if (!stream.filename) {  /* 没有上传图片直接break*/
          break;
      }
       const filename = stream.filename.toLowerCase();
       const fieldname = stream.fieldname;
       const dir=await this.service.tools.getFocusAddPath(filename);
       const writeStream = fs.createWriteStream(dir.uploadDir);
       await pump(stream, writeStream); /* mz-modules/pump 读取文件输入文件  失败自动帮我们删除*/
       files=Object.assign(files,{[fieldname]:dir.saveDir});
       /* 把文件的位置存放到对应的轮播图数据库focus
           所有表单字段都能通过 `parts.fields` 获取到
       * */
       let f=new ctx.model.Admin.Focus(Object.assign(files,parts.field));
       f.save();
     }
     await this.success('/admin/focus','轮播图添加成功');
  }
  async edit(){
     const  {ctx}=this;
     const _id=ctx.query._id;
     const list=await ctx.model.Admin.Focus.find({_id});
     await ctx.render('focus/edit',{list:list[0]})
  }
  async doEdit(){
    const  {ctx}=this;
    //{ autoFields: true }:可以将除了文件的其它字段提取到 parts 的 filed 中*/
    const parts = ctx.multipart({ autoFields: true });
    let files = {}; /* 存放到数组，到时候一次性上传多个图片，不方便获取其中的指定的文件保存位置，所以存放到对象*/
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        //修改操作
        var ids=parts.field._id;
        var updateResult=parts.field;
        await ctx.model.Admin.Focus.updateOne({"_id":ids},updateResult);
        break;
      }
      let fieldname = stream.fieldname;  //file表单的名字
      //上传图片的目录
      let dir=await this.service.tools.getFocusAddPath(stream.filename);
      let target = dir.uploadDir;
      let writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files=Object.assign(files,{
        [fieldname]:dir.saveDir
      });
      //修改操作
      var id=parts.field._id;
      /* 修改了图片需要把原来的图片删除*/
      const res=await ctx.model.Admin.Focus.find({"_id":id});
      const oldpath=res[0].focus_img;
      const oldpathinapp=path.join('app'+oldpath);
      fs.unlink(oldpathinapp,(err,data)=>{
        if(err){
          console.log('删除失败');
        }else {
          console.log('删除成功');
        }
      });
      var updateResult=Object.assign(files,parts.field);
      await ctx.model.Admin.Focus.updateOne({"_id":id},updateResult);
    }
    await this.success('/admin/focus','修改轮播图成功');
  }
}
module.exports = FocusController;
