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
  async auth(){
       const  { ctx } =this;
       const _id=ctx.query._id;
       /* 查询所有的权限，显示到授权页面*/
       const list=await ctx.model.Admin.Access.aggregate([
         {
           $match:{
             "module_id":'0'
           }
         },
         {
           $lookup:{
             from:'access',
             localField:'_id',
             foreignField:'module_id',
             as:'items'
           }
         }
       ]);
       /*  获取角色对应的权限 */
       const result=await ctx.model.Admin.RoleAccess.find({"role_id":_id});
       const access_ids=[];
       result.forEach((vaule)=>{
             access_ids.push(vaule.access_id.toString())
       });
       /* 循环遍历所有的权限数据  判断当前权限是否在角色权限的数组中*/
       for (var i=0;i<list.length;i++){
           if (access_ids.indexOf(list[i]._id.toString())!=-1){
                list[i].checked=true
           }
           for (var j=0;j<list[i].items.length;j++){
                if (access_ids.indexOf(list[i].items[j]._id.toString())!=-1){
                  list[i].items[j].checked=true
                }
           }
       }
       await ctx.render('role/auth',{list,_id});
  }
  async doAuth() {   /*
                         给角色赋予权限
                         1: 删除之前的对应的角色的权限
                         2: 给对应的角色添加对应的权限
                         */
    const { ctx } = this;
    const _id = ctx.request.body.role_id;
    const access_nodes = ctx.request.body.access_node; /* 要设置的权限id*/
    await ctx.model.Admin.RoleAccess.deleteMany({ "role_id": _id });
    /* 获取的权限，添加到对应的角色----权限表 */
    if (Array.isArray(access_nodes)) {
      for (var i = 0; i < access_nodes.length; i++) {
        const a = new ctx.model.Admin.RoleAccess({
          "role_id": _id, "access_id": access_nodes[i]
        });
        a.save();
      }
    }else {
      const a = new ctx.model.Admin.RoleAccess({
        "role_id": _id, "access_id": access_nodes
      });
      a.save();
    }
      await this.success('/admin/role/auth?_id=' + _id, "角色授权成功")
  }
}
module.exports =RoleController;
