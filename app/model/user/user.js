module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    var d=new Date();
    const User = new Schema({
      /*
        ip:ip,
              password:password,
              phone:phone,
              add_time:add_time,
              last_ip:last_ip,
              status:status
      */
      password:{type:String },
      phone: {type:Number },
      last_ip:{type:String },
      add_time: {
        type:Number,
        default: d.getTime()
      },
      email:{type:String },
      status: {
        type:Number,
        default: 1
      }
    });
    return mongoose.model('User', User,'user');
};
