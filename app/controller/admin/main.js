var BaseController =require('./base.js');
class MainController extends BaseController {
    async index() {
        //后台主his.ctx.re页面
        await this.ctx.render('admin/main/index');
    }
    async welcome(){
        await this.ctx.render('admin/main/welcome');
    }
}
module.exports = MainController;
