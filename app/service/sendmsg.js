'use strict';
const Service = require('egg').Service;
var https = require('https');
var qs = require('querystring');
class SendmsgService extends Service {
  async send(mobile,code) {
    //apikey自己到云片网上面去买。
    var apikey = '092******************eec';
    // 修改为您要发送的手机号码，多个号码用逗号隔开
    var mobile = mobile;
    // 修改为您要发送的短信内容
    var text = '【java学习网】您的验证码是'+code;
    // 智能匹配模板发送https地址
    var sms_host = 'sms.yunpian.com';
    var send_sms_uri = '/v2/sms/single_send.json';
    // 指定模板发送接口https地址
    send_sms(send_sms_uri,apikey,mobile,text);
    function send_sms(uri,apikey,mobile,text){
        var post_data = {
        'apikey': apikey,
        'mobile':mobile,
        'text':text,
        };//这是需要提交的数据
        var content = qs.stringify(post_data);
        post(uri,content,sms_host);
    }
    function post(uri,content,host){
        var options = {
            hostname: host,
            port: 443,
            path: uri,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
        var req = https.request(options, function (res) {
            // console.log('STATUS: ' + res.statusCode);
            // console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                 console.log('BODY: ' + chunk);     //如果错误  自己把它写入一个日志
            });
        });
        //console.log(content);
        req.write(content);
        req.end();
    }

  }
}
module.exports = SendmsgService;
