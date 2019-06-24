module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const GoodsColorSchema = new Schema({
      color_name: { type: String  },
      color_value: { type: String  },
      status: { type: Number,default:1  }
    });
    return mongoose.model('GoodsColor', GoodsColorSchema,'goods_color');
};
