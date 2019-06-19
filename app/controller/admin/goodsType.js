'use strict';
var Controller =require('./base.js');
class GoodsTypeController extends Controller {
    async index() {
        //查询商品类型表
        var result=await this.ctx.model.Admin.GoodsType.find({});
        await this.ctx.render('goodsType/index',{
            list:result
        });
    }
    async add() {
        await this.ctx.render('goodsType/add');
    }
    async doAdd() {
    var res=new this.ctx.model.Admin.GoodsType(this.ctx.request.body);
    await res.save();
    await this.success('/admin/goodsType','增加类型成功');
    }
    async edit() {
        var id=this.ctx.query.id;
        var result=await this.ctx.model.Admin.GoodsType.find({"_id":id});
        await this.ctx.render('goodsType/edit',{
            list:result[0]
        });
    }
    async doEdit() {
        var _id=this.ctx.request.body._id;
        var title=this.ctx.request.body.title;
        var description= this.ctx.request.body.description;
        await this.ctx.model.Admin.GoodsType.updateOne({"_id":_id},{
            title,description
        });
        await this.success('/admin/goodsType','编辑类型成功');
    }
}
module.exports = GoodsTypeController;
