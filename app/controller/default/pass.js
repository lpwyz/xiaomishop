'use strict';
const Controller = require('egg').Controller;
class PassController extends Controller {
 //登录
  async login() {
    await this.ctx.render('pass/login.html');
  }
  async getCode(){
    const { ctx,service } = this;
    const captcha=await service.tools.verify(); /* 获取服务里面返回的生成的验证码信息 */
    this.ctx.session.identify_code=captcha.text;  /* 验证码上面的信息,文字内容存放到session里面 */
    ctx.response.type = 'image/svg+xml';  /* 返回的生成的验证码的格式 */
    ctx.body=captcha.data;  /* 给页面返回一张图片 */
  }
   //注册第一步 输入手机号
  async registerStep1() {
    await this.ctx.render('pass/register_step1.html');
  }
  //注册第二步  验证码验证码是否正确
  async registerStep2() {
    var sign=this.ctx.request.query.sign;
    var identify_code=this.ctx.request.query.identify_code;
    var add_day=await this.service.tools.getDay();         //年月日
    var userTempResult=await this.ctx.model.User.UserTemp.find({"sign":sign,add_day:add_day});
    if(userTempResult.length==0){
      this.ctx.redirect('/register/registerStep1');
    }else{
      await this.ctx.render('pass/register_step2.html',{
        sign:sign,
        phone:userTempResult[0].phone,
        identify_code:identify_code
      });
    }
  }
  //注册第三步  输入密码
  async registerStep3() {
    var sign = this.ctx.request.query.sign;
    var phone_code = this.ctx.request.query.phone_code;
    var msg = this.ctx.request.query.msg || '';
    var add_day = await this.service.tools.getDay();         //年月日
    var userTempResult = await this.ctx.model.User.UserTemp.find({ "sign": sign, add_day: add_day });
    if (userTempResult.length == 0) {
      this.ctx.redirect('/register/registerStep1');
    } else {
      await this.ctx.render('pass/register_step3.html', {
        sign: sign,
        phone_code: phone_code,
        msg: msg
      });
    }
  }

    //完成注册  post
  async doRegister() {
    this.ctx.body='完成注册';
  }

  //发送短信验证码
  async sendCode(){
    var phone=this.ctx.request.query.phone;
    var identify_code=this.ctx.request.query.identify_code;  //用户输入的验证码
    if(identify_code.toLowerCase()!=this.ctx.session.identify_code.toLowerCase()){
        this.ctx.body={
          success:false,
          msg:'输入的图形验证码不正确'
        }
    }else{
        //判断手机格式是否合法
        var reg =/^[\d]{11}$/;
        if(!reg.test(phone)){
          this.ctx.body={
            success:false,
            msg:'手机号不合法'
          }
        }else{
          var add_day=await this.service.tools.getDay();         //年月日
          var add_time=await this.service.tools.getTime();
          var sign=await this.service.tools.md5(phone+add_day);  //签名
          var ip=this.ctx.request.ip.replace(/::ffff:/, '');     //获取客户端ip
          var phone_code=await this.service.tools.getRandomNum();  //发送短信的随机码
          var userTempResult=await this.ctx.model.User.UserTemp.find({"sign":sign,add_day:add_day});
          //1个ip 一天只能发10个手机号
          var ipCount=await this.ctx.model.User.UserTemp.find({"ip":ip,add_day:add_day}).count();
          if(userTempResult.length>0){
              if(userTempResult[0].send_count<6 && ipCount<10){                     //执行发送
                    var send_count=userTempResult[0].send_count+1;
                    await this.ctx.model.User.UserTemp.updateOne({"_id":userTempResult[0]._id},{"send_count":send_count,'add_time':add_time});
                    this.ctx.session.phone_code=phone_code;
                    //发送短信
                    this.service.sendmsg.send(phone,phone_code);
                    console.log('---------------------------------');
                    console.log(phone_code,ipCount);
                    this.ctx.body={
                      success:true,
                      msg:'短信发送成功',
                      sign:sign,
                    }
              }else{
                    this.ctx.body={"success":false,msg:'当前手机号码发送次数达到上限，明天重试'};
              }
          }else{
              var userTmep=new this.ctx.model.User.UserTemp({
                  phone,
                  add_day,
                  sign,
                  ip,
                  send_count:1
              });
              userTmep.save();
              this.ctx.session.phone_code=phone_code;
              //发送短信
              this.service.sendmsg.send(phone,phone_code);
              this.ctx.body={
                success:true,
                msg:'短信发送成功',
                sign:sign,
              }
          }
        }
    }
  }


  //验证验证码
  async validatePhoneCode(){
    var sign=this.ctx.request.query.sign;
    var phone_code=this.ctx.request.query.phone_code;
    var add_day=await this.service.tools.getDay();         //年月日
    if(this.ctx.session.phone_code!=phone_code){
      this.ctx.body={
        success:false,
        msg:'您输入的手机验证码错误'
      }
    }else{
      var userTempResult=await this.ctx.model.User.UserTemp.find({"sign":sign,add_day:add_day});
      if(userTempResult.length<=0){
        this.ctx.body={
          success:false,
          msg:'参数错误'
        }
      }else{
        //判断验证码是否超时
        var nowTime=await this.service.tools.getTime();
        if((userTempResult[0].add_time-nowTime)/1000/60>30){
          this.ctx.body={
            success:false,
            msg:'验证码已经过期'
          }
        }else{
          //用户表有没有当前这个手机号        手机号有没有注册
          var userResult=await this.ctx.model.User.User.find({"phone":userTempResult[0].phone});
          if(userResult.length>0){
            this.ctx.body={
              success:false,
              msg:'此用户已经存在'
            }
          }else{
            this.ctx.body={
              success:true,
              msg:'验证码输入正确',
              sign:sign
            }
          }
        }
      }
    }
  }


  //完成注册  post
  async doRegister() {
    var sign=this.ctx.request.body.sign;
    var phone_code=this.ctx.request.body.phone_code;
    var add_day=await this.service.tools.getDay();         //年月日
    var password=this.ctx.request.body.password;
    var rpassword=this.ctx.request.body.rpassword;
    var ip=this.ctx.request.ip.replace(/::ffff:/, '') ;
    if(this.ctx.session.phone_code!=phone_code){
      //非法操作
      this.ctx.redirect('/pass/registerStep1');
    }
    var userTempResult=await this.ctx.model.User.UserTemp.find({"sign":sign,add_day:add_day});
    if(userTempResult.length==0){
      //非法操作
      this.ctx.redirect('/pass/registerStep1');
    }else{
      //传入参数正确 执行增加操作
      if(password.length<6 || password!=rpassword){
        var msg='密码不能小于6位并且密码和确认密码必须一致';
        this.ctx.redirect('/register/registerStep3?sign='+sign+'&phone_code='+phone_code+'&msg='+msg);
      }else{
          var userModel=new this.ctx.model.User.User({
          phone:userTempResult[0].phone,
          password:await this.service.tools.md5(password),
          last_ip:ip
        });
        //保存用户
        var userReuslt=await userModel.save();
        if(userReuslt){
          //跳转到登入页面
          this.ctx.redirect('/login');
        }
        // if(userReuslt){
        //   //获取用户信息
        //   var userinfo=await this.ctx.model.User.User.find({"phone":userTempResult[0].phone},'_id phone last_ip add_time email status');
        //   //用户注册成功以后默认登录
        //   //cookies 安全      加密
        //   this.service.cookies.set('userinfo',userinfo[0]);
        //   this.ctx.redirect('/');
        // }
      }
    }
  }
}
module.exports = PassController;
