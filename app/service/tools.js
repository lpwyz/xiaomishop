'use strict';
//引入node.js  生成svg图形验证码模块
const svgCaptcha = require('svg-captcha');
const Service = require('egg').Service;
const md5 = require('md5');
const path=require('path');
const sd = require('silly-datetime');
const mkdirp = require('mz-modules/mkdirp');
const Jimp = require("jimp");  //生成缩略图的模块
class ToolsService extends Service {
  async verify() {  /* 生成验证码 */
    const captcha = svgCaptcha.create(
      {
        size:4,     //验证码图片里面的一些信息
        fontSize: 50,
        width: 100,
        height:40,
        background: "#cc9966"
      });
    this.ctx.session.code=captcha.text;  /* 验证码上面的信息,文字内容存放到session里面 */
    return  captcha;
  }
  async md5(string){   /* 封装一个md5加密*/
        return  md5(string);
  }
  async getFocusAddPath(filename){
      /*
          1: 获取传递过来的图片的名字， 获取当前日期 silly-datetime模块
          2: 根据当前的日期,设置对应的文件夹，如果存在就不设置，不存在就设置 mz-modules模块
      */
     const day=sd.format(new Date(), 'YYYYMMDD');
     let dir=path.join(this.config.uploadDir,day);
     await mkdirp(dir);
     const date=new Date();
     let d=await date.getTime();   /*毫秒数*/
     /*图片保存的路径*/
     let uploadDir=path.join(dir,d+path.extname(filename));
     /*app\public\admin\upload\20190614\1560520826971.png */
    return {
      uploadDir:uploadDir,
      /* 保存到数据库的地址 */
      saveDir:uploadDir.slice(3).replace(/\\/g,'/')
    }
  }
  //生成缩略图的公共方法
  async jimpImg(target){
    //上传图片成功以后生成缩略图
    Jimp.read(target, (err, lenna) => {
      if (err) throw err;
      lenna.resize(200, 200) // resize
        .quality(90) // set JPEG quality
        .write(target+'_200x200'+path.extname(target)); // save


      lenna.resize(400, 400) // resize
        .quality(90) // set JPEG quality
        .write(target+'_400x400'+path.extname(target)); // save
    });
  }
}
module.exports = ToolsService;

