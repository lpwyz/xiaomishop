'use strict';
var Controller =require('./base.js');
class goodsTypeAttributeController extends Controller {
    async index() {
        const {ctx}=this;
        let  cate_id=this.app.mongoose.Types.ObjectId(ctx.request.query.cate_id); /* 商品分类的id*/
        const list=await ctx.model.Admin.GoodsTypeAttribute.find({"cate_id":cate_id});
        /* 商品分类表的_id 等于商品分类属性表的cate_id */
        const res=await ctx.model.Admin.GoodsTypeAttribute.aggregate([
            {
                $lookup:{
                    from:'goods_type',
                    localField:'cate_id',
                    foreignField:'_id',
                    as:'goodsType'
                }
            },
            {
                $match:{
                    "cate_id":this.app.mongoose.Types.ObjectId(ctx.request.query.cate_id)
                }
            }
        ]);
        await ctx.render('goodsTypeAttribute/index',{list:res,cate_id})
    }
    async add() {
        const {ctx}=this;
        const id=ctx.request.query.id; /* 商品分类的id*/
        const list=await ctx.model.Admin.GoodsType.find({});
        await ctx.render('goodsTypeAttribute/add',{list,id})
    }
    async doAdd() {
        const  {ctx}=this;
        const  content=ctx.request.body;
        console.log(content);
        const  g=new ctx.model.Admin.GoodsTypeAttribute(content);
        g.save();
        await this.success('/admin/goodsTypeAttribute?cate_id='+content.cate_id,'商品分类属性添加成功')
    }
    async edit() {
        const {ctx}=this;
        const _id=ctx.request.query._id;
        var result=await ctx.model.Admin.GoodsTypeAttribute.find({_id});
        var goodsTypes=await ctx.model.Admin.GoodsType.find({});
        await ctx.render('goodsTypeAttribute/edit',{
            list:result[0],
            goodsTypes:goodsTypes
        });
    }
    async doEdit() {
        const {ctx}=this;
        var _id=ctx.request.body._id;
        await ctx.model.Admin.GoodsTypeAttribute.updateOne({"_id":_id},ctx.request.body);
        await this.success('/admin/goodsTypeAttribute?cate_id='+ctx.request.body.cate_id,'修改商品类型属性成功');
    }
}
module.exports = goodsTypeAttributeController;
