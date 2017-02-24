//模式对数据字段进行定义，书写模式的方法，一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
var mongoose = require('mongoose');
var MiguanSchema=new mongoose.Schema({
    title:String,
    type:Number,/*1.首页头图，2.视觉设计，3.前端技术，4.团队活动，5.用户研究，6.交互设计，7.闲话杂谈*/
    img: String,
    video: String,
    file:String,
    headimg:String,
    thumb:String,
    summary:String,
    content:String,
    author:String,
    like:{
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    },
    meta:{
        createAt:{
            type:Date,
            default:new Date().toLocaleString().replace(/(\d{4}).(\d{1,2}).(\d{1,2})/mg, "$1-$2-$3").substr(0, 10)
        },
        updateAt:{
            type:Date,
            default:new Date().toLocaleString().replace(/(\d{4}).(\d{1,2}).(\d{1,2})/mg, "$1-$2-$3").substr(0, 10)
        }
    }
});
MiguanSchema.statics={
    fetch:function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);//由于MovieSchema已经定义了meta.updateAt,exec(cb)执行完后回调函数。
        //exec(cb)意思是，执行查询并将查询结果传入回调函数cb。cb是回调函数，exec是发出调用回调函数的命令。
    }
};
module.exports = MiguanSchema;//原型定义方法
