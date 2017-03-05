//模式对数据字段进行定义，书写模式的方法，一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
var mongoose = require('mongoose');
var counterSchema=new mongoose.Schema({
    _id:String,
    seq: Number
});
var MiguanSchema=new mongoose.Schema({
    title:String,
    type:Number,/*1.首页头图，2.视觉设计，3.前端技术，4.团队活动，5.用户研究，6.交互设计，7.闲话杂谈，8.全部*/
    type_name:String,
    img: String,
    video: String,
    file:String,
    thumb:String,
    content:String,
    author:String,
    index:{
        type: Number,
        default: 0
    },
    favor:{
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    },
    createAt:{
        type:String,
        default:new Date().toLocaleString().replace(/(\d{4}).(\d{1,2}).(\d{1,2})/mg, "$1-$2-$3").substr(0, 10)
    },
    updateAt:{
        type:String,
        default:new Date().toLocaleString().replace(/(\d{4}).(\d{1,2}).(\d{1,2})/mg, "$1-$2-$3").substr(0, 10)
    }
    
});

var counter=mongoose.model('counter',counterSchema);


MiguanSchema.pre("save",function (next) {//每次存数据之前都会调用该方法
    var _this=this;
    counter.findOneAndUpdate({_id: "default"}, {$inc: { seq: 1 }}, function(err, _seq) {
        if (err) {
            console.log(err);
        }
        else {
            _this.index=_seq.seq;
            next();

        }

    });
    //调用next，将存储流程走下去，直到你运行下一次next()，内部处于暂停状态，但不影响外部运行。
});

MiguanSchema.statics={
    fetch:function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);//由于MovieSchema已经定义了meta.updateAt,exec(cb)执行完后回调函数。
        //exec(cb)意思是，执行查询并将查询结果传入回调函数cb。cb是回调函数，exec是发出调用回调函数的命令。
    }
};


module.exports=MiguanSchema;//原型定义方法