'use strict';
var BaseController =require('./base.js');
const pump = require('mz-modules/pump');
const fs=require('fs');
const path=require('path');
class GoodsController extends BaseController {
      async index() {
          await this.ctx.render('goods/index');
      }
      async add() {
        const {ctx}=this;
        /* 查询商品颜色表的所有颜色*/
        const colors=await ctx.model.Admin.GoodsColor.find({});
        /* 查询所有的商品类型*/
        const goods_types=await ctx.model.Admin.GoodsType.find({});
        /* 查询所有商品的分类 以及他的子分类*/
        const list=await ctx.model.Admin.GoodsCate.aggregate([
          {
            $lookup:{
              from:'goods_cate',
              localField:'_id',
              foreignField:'pid',
              as:'items'
            }
          },
          {
            $match:{
              "pid":'0'
            }
          }
        ]);
        await ctx.render('goods/add',{colors,goods_types,goodsCate:list});
      }
      async goodsTypeAttribute(){
           const {ctx}=this;
           const cate_id=ctx.request.query.cate_id;
           /*根据商品类型id查询对应的所有商品类型属性*/
           const res=await ctx.model.Admin.GoodsTypeAttribute.find({cate_id});
           ctx.body={ result:res }
      }
      async goodsUploadImage(){
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
          files=Object.assign(files,{
            [fieldname]:dir.saveDir
          })
        }
        //图片的地址转化成 {link: 'path/to/image.jpg'}
        this.ctx.body={link: files.file};
      }
      async goodsUploadPhoto(){
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
          files=Object.assign(files,{
            [fieldname]:dir.saveDir
          })
        }
        //图片的地址转化成 {link: 'path/to/image.jpg'}
        this.ctx.body={link: files.file};
      }
      async doAdd() {
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
          const dir = await this.service.tools.getFocusAddPath(filename);
          const writeStream = fs.createWriteStream(dir.uploadDir);
          await pump(stream, writeStream); /* mz-modules/pump 读取文件输入文件  失败自动帮我们删除*/
          files = Object.assign(files, { [fieldname]: dir.saveDir });
          /* 把文件的位置存放到对应的轮播图数据库focus
              所有表单字段都能通过 `parts.fields` 获取到
          * */
        }
        console.log(Object.assign(files, parts.fields));
      }
}
module.exports = GoodsController;
