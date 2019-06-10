'use strict';
const  BaseController=require('./base.js');
class ManagerController extends BaseController {
  async index() {
    const { ctx } = this;
    /*  用户 角色表  关联查询 */
    const list=await ctx.model.Admin.Admin.aggregate([
      {
        $lookup: {
            from: "role",
            localField: "role_id",
            foreignField: "_id",
            as: "role"
          }
      }
    ]);
    await ctx.render('admin/index',{list});
  }
  async add() {
    const { ctx } = this;
    const list=await ctx.model.Admin.Role.find({});
    await ctx.render('admin/add',{list});
  }
  async doAdd() {
    const { ctx } = this;
    const content=ctx.request.body;
    const username=ctx.request.body.username;
    const u=ctx.model.Admin.Admin.find({username});
    /*  判断用户名是否存在 */
    if (u.length>0){
      await this.error('/admin/manager/add',"添加失败，用户名已存在");
    }else {
      content.password=await ctx.service.tools.md5(ctx.request.body.password);
      const  a=  new  ctx.model.Admin.Admin(content);
      a.save();
      await this.success("/admin/manager","用户信息添加成功")
    }
  }
  async delete() {
    const { ctx } = this;
    await ctx.render('admin/index');
  }
  async edit() {
    const { ctx } = this;
    const _id=ctx.query._id;
    const manager=await ctx.model.Admin.Admin.find({_id});
    const list=await ctx.model.Admin.Role.find({});
    await ctx.render('admin/edit',{list,manager});
  }
  async doEdit() {
    const { ctx } = this;
    const manager=ctx.request.body;
    console.log(manager);
    await ctx.model.Admin.Admin.updateOne({_id:manager._id},manager);
    await this.success('/admin/manager','修改用户信息成功');
  }
}
module.exports = ManagerController;
