'use strict';
const  BaseController=require('./base.js');
class AccessController extends BaseController {
  async index() {
    const { ctx } = this;
    /* 两个表自管理 每个模块查出自己下面的子菜单*/
    const list=await ctx.model.Admin.Access.aggregate([
      {
          $lookup:{
          from:'access',
          localField:'_id',
          foreignField:'module_id',
          as:'items'
        }
      },
      {
        $match:{
          "module_id":'0'
        }
      }
    ]);
    await ctx.render('access/index',{list})
  }
  async add() {
    const { ctx } = this;
    /* 查询一下access表，获取access表里面的顶级节点 */
    const list=await ctx.model.Admin.Access.find({module_id:'0'});
    await ctx.render('access/add',{list});
  }
  async doAdd() {
    const { ctx } = this;
    /* 如果不是模块 需要把菜单或者操作里面的module_id转换成object_id类型*/
    const addResult=ctx.request.body;
    const module_id=addResult.module_id;
    //菜单或者操作
    if(module_id!="0"){
      addResult.module_id=this.app.mongoose.Types.ObjectId(module_id);
    }
    const access=new ctx.model.Admin.Access(addResult);
    access.save();
    await this.success('/admin/access','增加成功')
  }
  async delete() {
    const { ctx } = this;
    ctx.body = '我是权限删除界面';
  }
  async edit() {
    const { ctx } = this;
    const _id=ctx.query._id;
    const list=await ctx.model.Admin.Access.find({_id});
    const allList=await ctx.model.Admin.Access.find({module_id:'0'});
    await ctx.render('access/edit',{list,allList});
  }
  async doEdit(){
    const { ctx } = this;
    const _id=ctx.request.body._id;
    const module_id=ctx.request.body.module_id;
    const list=ctx.request.body;
    /* 注意 这个获取的id 不是objectid */
    if(module_id!="0"){  /* 顶级模块 */
      list.module_id=this.app.mongoose.Types.ObjectId(module_id);
    }
    await ctx.model.Admin.Access.updateOne({_id},list);
    await this.success('/admin/access','修改权限成功');
  }
}
module.exports =AccessController;
