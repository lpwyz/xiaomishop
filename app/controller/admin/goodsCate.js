/*

id    name              pid
1      手机               0
2      电脑               0
3      服装               0
4      小米1              1
5      小米2              2
6      小米笔记本         2
7      小米T恤            3



模块jimp


官方文档：


	https://github.com/oliver-moran/jimp


	https://github.com/oliver-moran/jimp/tree/master/packages/jimp



用法：

	1、安装  cnpm install --save jimp


	2、引入：var Jimp = require("jimp");


    3、使用


    var Jimp = require('jimp');




	// open a file called "lenna.png"
	Jimp.read('lenna.png', (err, lenna) => {
 		 if (err) throw err;
    		 lenna.resize(256, 256) // resize
   			 .quality(60) // set JPEG quality
   			 .greyscale() // set greyscale
    			.write('lena-small-bw.jpg'); // save
	});
*/
const fs=require('fs');
const pump = require('mz-modules/pump');
var BaseController =require('./base.js');
class GoodsCateController extends BaseController {
    async index() {
        // var result=await this.ctx.model.GoodsCate.find({});
        // // console.log(result);
        var result=await this.ctx.model.Admin.GoodsCate.aggregate([
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
        console.log(JSON.stringify(result));
        await this.ctx.render('goodsCate/index',{
          list:result
        });
    }
    async add() {
        var result=await this.ctx.model.Admin.GoodsCate.find({"pid":'0'});
        await this.ctx.render('goodsCate/add',{
            cateList:result
        });
    }
    async doAdd() {
        let parts = this.ctx.multipart({ autoFields: true });
        let files = {};
        let stream;
        while ((stream = await parts()) != null) {
            if (!stream.filename) {
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
           //生成缩略图
           this.service.tools.jimpImg(target);
        }
        if(parts.field.pid!=0){
            parts.field.pid=this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId
        }
        let goodsCate =new this.ctx.model.Admin.GoodsCate(Object.assign(files,parts.field));
        await goodsCate.save();
        await this.success('/admin/goodsCate','增加分类成功');
    }
    async edit() {
        var id=this.ctx.request.query.id;
        var result=await this.ctx.model.Admin.GoodsCate.find({"_id":id});
        var cateList=await this.ctx.model.Admin.GoodsCate.find({"pid":'0'});
        await this.ctx.render('goodsCate/edit',{
            cateList:cateList,
            list:result[0]
        });
    }
    async doEdit() {
        let parts = this.ctx.multipart({ autoFields: true });
        let files = {};
        let stream;
        while ((stream = await parts()) != null) {
            if (!stream.filename) {
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
           //生成缩略图
           this.service.tools.jimpImg(target);
        }
        if(parts.field.pid!=0){
            parts.field.pid=this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId

        }
        var id=parts.field.id;
        var updateResult=Object.assign(files,parts.field);
        await this.ctx.model.Admin.GoodsCate.updateOne({"_id":id},updateResult);
        await this.success('/admin/goodsCate','修改分类成功');
    }
}
module.exports = GoodsCateController;
