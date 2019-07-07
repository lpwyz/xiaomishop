# egg小米商城项目
web框架采用的是当前node社区流行的koa框架的加强版，阿里开发的egg框架， 数据库采用的是mongodb 使用的数据库库是mongoose，前端采用的是简单易上手的ejs模板引擎，
感兴趣的朋友可以把ejs，改成当下流行的vue,react或者angular哦。
项目的功能列表在项目的：
app/public/admin/egg_project
## 项目截图
项目目前截图：
     ![Image] (https://github.com/lpwyz/xiaomishop/raw/master/project_demo/login.png)
     ![Image] (https://github.com/lpwyz/xiaomishop/raw/master/project_demo/error_code.png)
     ![Image] (https://github.com/lpwyz/xiaomishop/raw/master/project_demo/error_code.png)
     ![Image] (https://github.com/lpwyz/xiaomishop/raw/master/project_demo/welcome.png)
## 启动项目
1：下载源码到idea工具，如Webstorm
2: 安装package.json对应的依赖模块
3: npm run dev 运行项目 
      注意： 在项目的config文件夹下面的 
    config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/xiaomishop',
      options: {}
    },
   };
   需要改成自己的数据库。
4：项目在持续的更新中，等全部更新完成，会附上项目的数据库链接，
   
