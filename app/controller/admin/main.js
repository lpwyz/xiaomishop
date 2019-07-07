var BaseController =require('./base.js');
class MainController extends BaseController {
    async index() {
        const { ctx } = this;
        const code=await ctx.service.tools.randomCode();
        console.log(code);
        //await ctx.service.sendmsg.send(13767917005,code);
        //后台主his.ctx.re页面
        await ctx.render('admin/main/index');
    }
    async welcome(){
        await this.ctx.render('admin/main/welcome');
    }
}
module.exports = MainController;
