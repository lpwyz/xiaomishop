'use strict';
//引入node.js  生成svg图形验证码模块
const svgCaptcha = require('svg-captcha');
const Service = require('egg').Service;
var md5 = require('md5');
class ToolsService extends Service {
  async verify() {  /* 生成验证码 */
    const captcha = svgCaptcha.create(
      {
        size:6,     //验证码图片里面的一些信息
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
}
module.exports = ToolsService;

