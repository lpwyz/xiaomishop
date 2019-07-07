module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    var d=new Date();
    const UserTemp = new Schema({
      phone: {type:Number },
      send_count: {type:Number },
      sign:{type:String },
      add_day:{
        type:Number
      },
      ip:{type:String },
      add_time: {
        type:Number,
        default: d.getTime()
      }
    });
    return mongoose.model('UserTemp', UserTemp,'user_temp');
};
