module.exports = app => {
  const mongoose = app.mongoose; /* 相当于nodejs里面的  引入了mongoose连接对象*/
  const Schema = mongoose.Schema;
  const d=new Date();
  /* 定义表结构的数据模型 */
  const RoleSchema = new Schema({
    title: { type: String  },
    description: { type: String  },
    status:{type:Number, default:1},
    add_time:{ type: Number,default: d.getTime()},
  });
  /* 暴露的是 数据模型   第一哥参数必须首字母大写，比如User,表示操作的是users表，第二个参数是我们定义的
  *  数据模型，第三个参数 可以写我们自定义操作的表，写的什么，就是操作什么表 ，比如user,就是代表操作user表
  * */
  return mongoose.model('Role',RoleSchema ,'role');
};
