module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    var d=new Date();
    const GoodsTypeAttributeSchema = new Schema({
      cate_id:{ type:Schema.Types.ObjectId },
      title: { type: String  },
      attr_type: { type: String  },      //类型  1 input    2  textarea    3、select
      attr_value:{ type: String  },      //默认值： input  textarea默认值是空     select框有默认值  多个默认值以回车隔开
      status: { type: Number,default:1  },
      add_time: {
        type:Number,
        default: d.getTime()
      },
      sort:{
        type:Number,
        default:100
      }
    });
    return mongoose.model('GoodsTypeAttribute', GoodsTypeAttributeSchema,'goods_type_attribute');
  };
