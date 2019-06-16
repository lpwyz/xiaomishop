# xiaomishop

基于node的阿里开发的强化版koa框架的egg框架， 数据库采用的是mongodb使用的数据库库是mongoose，前端采用的是简单易上手的ejs模板引擎，
感兴趣的朋友可以把ejs，改成当下流行的vue,react或者angular哦。



## QuickStart


1：下载源码到idea工具比如Webstorm

2: 安装package.json对应的依赖模块

3: npm run dev 运行项目  注意： 在项目的config文件夹下面的 
   config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/xiaomishop',
      options: {}
    },
   };
   需要改成自己的数据库。否则想运行项目需要注释此部分，当然这样就用不了数据库了。建议，下载作者Benjamin项目配套的数据库，这样所有的代码无需改变，直接运行看看是否成功，等到运行成功，有需求可以在改。
   
4：项目在持续的更新中，等全部更新完成，会附上项目的数据库链接，

