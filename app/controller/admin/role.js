'use strict';
const  BaseController=require('./base.js');
class RoleController extends BaseController {
  async index() {
    const { ctx } = this;
    const list=await ctx.model.Admin.Role.find({});
    await ctx.render('role/index',{list})
  }
  async add() {
    const { ctx } = this;
    await ctx.render('role/add')
  }
  async doAdd() {
    const { ctx } = this;
    const title=ctx.request.body.title;
    const description=ctx.request.body.description;
    //实例化数据模型
    const model=new ctx.model.Admin.Role({
      title,description
    });
    model.save();
    //添加成功
    await this.success('/admin/role',"角色添加完成")
  }
  async edit() {
    const { ctx } = this;
    const _id=ctx.query._id;
    const list=await ctx.model.Admin.Role.find({_id});
    await ctx.render('role/edit',{list:list[0]})
  }
  async doEdit() {
    const { ctx } = this;
    const title=ctx.request.body.title;
    const _id=ctx.request.body._id;
    const description=ctx.request.body.description;
    await ctx.model.Admin.Role.updateOne({_id},{title,description});
    //修改成功
    await this.success('/admin/role',"角色修改完成")
  }
}
module.exports =RoleController;
