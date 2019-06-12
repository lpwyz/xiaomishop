'use strict';
const Service = require('egg').Service;
const url=require('url');
class AdminService extends Service {
  async checkauth() {
    /*
      1、获取当前用户的角色        （忽略权限判断的地址    is_super）
      2、根据角色获取当前角色的权限列表
      3、获取当前访问的url 对应的权限id
      4、判断当前访问的url对应的权限id 是否在权限列表中的id中
  */
    /* 获取当前用户的信息*/
    var userinfo = this.ctx.session.userinfo;
    var role_id = userinfo.role_id;
    var pathname = url.parse(this.ctx.request.url).pathname;         //获取当前用户访问的地址
    console.log(pathname);
    /* 忽略权限判断的地址 is_super 超级管理员*/
    const ignoreUrl = ['/admin/doLogin', '/admin/login', '/admin/verify', 'admin/logOut'];
    if (ignoreUrl.indexOf(pathname) != -1 || userinfo.is_super == 1) {
      return true;   //允许访问
    }
    /*根据角色获取当前角色的权限列表*/
    var accessResult = await this.ctx.model.Admin.RoleAccess.find({ "role_id": role_id });
    var accessArray = [];   //当前角色可以访问的权限列表
    accessResult.forEach(function(value) {
      accessArray.push(value.access_id.toString());
    });
    /*获取当前访问的url 对应的权限id*/
    var accessUrlResult = await this.ctx.model.Admin.Access.find({ "url": pathname });
    console.log(accessResult);
    /*判断当前访问的url对应的权限id 是否在权限列表中的id中*/
    if (accessUrlResult.length > 0) {
      if (accessArray.indexOf(accessUrlResult[0]._id.toString()) != -1) {
        return true;
      }
      return false;
    }else {
      return false;
    }
  }
}
module.exports = AdminService;
