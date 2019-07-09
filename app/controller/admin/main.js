var BaseController =require('./base.js');
class MainController extends BaseController {
    async index() {
        const { ctx } = this;
        await ctx.render('admin/main/index');
    }
    async welcome(){
        await this.ctx.render('admin/main/welcome');
    }
}
module.exports = MainController;
