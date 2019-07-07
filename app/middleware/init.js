
module.exports = (options,app) => {
    return async function init(ctx, next) {
        //获取顶部导航的数据
        var topNav=await ctx.service.cache.get('index_topNav');
        if(!topNav){
            topNav=await ctx.model.Nav.find({"position":1});
            await ctx.service.cache.set('index_topNav',topNav,60*60);
        }


        //商品分类
        var goodsCate=await ctx.service.cache.get('index_goodsCate');
        if(!goodsCate){
            goodsCate=await ctx.model.GoodsCate.aggregate([

                {
                    $lookup:{
                    from:'goods_cate',
                    localField:'_id',
                    foreignField:'pid',
                    as:'items'
                    }
                },
                {
                    $match:{
                    "pid":'0'
                    }
                }

            ])
            await ctx.service.cache.set('index_goodsCate',goodsCate,60*60);

        }


            //中间导航以及关联商品

        var middleNav=await ctx.service.cache.get('index_middleNav');
        if(!middleNav){
            middleNav=await ctx.model.Nav.find({"position":2});
            middleNav=JSON.parse(JSON.stringify(middleNav));  //1、不可扩展对象
            for(var i=0;i<middleNav.length;i++){
                if(middleNav[i].relation){
                    //数据库查找relation对应的商品
                    try{
                        var tempArr=middleNav[i].relation.replace(/，/g,',').split(',');
                        var tempRelationIds=[];
                        tempArr.forEach((value)=>{
                            tempRelationIds.push({
                            "_id":app.mongoose.Types.ObjectId(value)
                            })
                        })
                        var relationGoods=await ctx.model.Goods.find({
                            $or:tempRelationIds
                        },'title goods_img');

                        middleNav[i].subGoods=relationGoods;

                    }catch(err){   //2、如果用户输入了错误的ObjectID（商品id）

                        middleNav[i].subGoods=[];
                    }
                }else{

                    middleNav[i].subGoods=[];
                }
            }

            await ctx.service.cache.set('index_middleNav',middleNav,60*60);


         }

        //  console.log(middleNav);

        ctx.state.topNav=topNav;
        ctx.state.goodsCate=goodsCate;
        ctx.state.middleNav=middleNav;
        //注意
        await next();

    };
};
