'use strict';
const  BaseController=require('./base.js');
class AccessController extends BaseController {
  async index() {
    const { ctx } = this;
    ctx.body = '我是权限管理界面';
  }
  async add() {
    const { ctx } = this;
    ctx.body = '我是权限增加界面';
  }
  async delete() {
    const { ctx } = this;
    ctx.body = '我是权限删除界面';
  }
  async edit() {
    const { ctx } = this;
    ctx.body = '我是权限修改界面';
  }
}
module.exports =AccessController;
