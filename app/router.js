'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.index.home.index);


  router.get('/admin/login', controller.admin.login.index);
  router.post('/admin/doLogin', controller.admin.login.doLogin);
  router.get('/admin/logOut', controller.admin.login.logOut);

  //验证码url
  router.get('/admin/verify', controller.admin.base.verify);

  //公共的删除信息
  router.get('/admin/delete', controller.admin.base.delete);


  router.get('/admin/manager', controller.admin.manager.index);
  router.get('/admin/manager/add', controller.admin.manager.add);
  router.post('/admin/manager/doAdd', controller.admin.manager.doAdd);
  router.get('/admin/manager/edit', controller.admin.manager.edit);
  router.post('/admin/manager/doEdit', controller.admin.manager.doEdit);


  router.get('/admin/role', controller.admin.role.index);
  router.get('/admin/role/add', controller.admin.role.add);
  router.post('/admin/role/doAdd', controller.admin.role.doAdd);
  router.get('/admin/role/edit', controller.admin.role.edit);
  router.post('/admin/role/doEdit', controller.admin.role.doEdit);



  router.get('/admin/access', controller.admin.access.index);
  router.get('/admin/access/add', controller.admin.access.add);
  router.get('/admin/access/edit', controller.admin.access.edit);









};
