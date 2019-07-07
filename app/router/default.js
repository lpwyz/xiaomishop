module.exports = app => {
    const { router, controller } = app;

    //普通用户登入
    router.get('/user/verify', controller.admin.base.verify);
    //用户注册登录
    router.get('/login',controller.default.pass.login);
    router.get('/register/registerStep1', controller.default.pass.registerStep1);
    router.get('/register/registerStep2', controller.default.pass.registerStep2);
    router.get('/register/registerStep3', controller.default.pass.registerStep3);
    //用户点击注册
    router.get('/pass/sendCode', controller.default.pass.sendCode);
    //注册前台验证码
    router.get('/verify', controller.default.pass.getCode);
    //注册验证手机短信码
    router.get('/pass/validatePhoneCode', controller.default.pass.validatePhoneCode);
    //注册最后一步，输入账号和密码
    router.post('/pass/doRegister', controller.default.pass.doRegister);
};
