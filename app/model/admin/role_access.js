module.exports = app => {
  const mongoose = app.mongoose;   /*引入建立连接的mongoose */
  const Schema = mongoose.Schema;
  var d=new Date();
  const RoleAccessSchema = new Schema({
    role_id: { type: String  },      //角色id
    access_id: { type: String  },      //权限id
  });
  return mongoose.model('RoleAccess', RoleAccessSchema,'role_access');
};
