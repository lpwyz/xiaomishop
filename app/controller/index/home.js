'use strict';
const  BaseController=require('../admin/base');
class HomeController extends BaseController {
  async index() {
    const { ctx } = this;
    ctx.body='hi,xiaomishop';
  }
}
module.exports = HomeController;
