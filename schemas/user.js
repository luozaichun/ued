
var mongoose = require('mongoose');
var bcrypt=require('bcryptjs');//专门为密码存储定义的算法，可以先生成一个随机的盐，将密码和盐混合进行加密
var SALT_WORK_FACTOR=10;//计算强度，强度越大，计算密码需要的事件，越大建立彩虹表越大，破解越困难
var UserSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    password:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }

});

UserSchema.pre("save",function (next) {//每次存数据之前都会调用该方法
    var user=this;
    if(this.isNew){//数据是否新加
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt=Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt) {
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password,salt,function (err,hash) {//三个参数，用户的明文密码，生成的盐，回调方法:拿到加后的hash值
            if(err){
                return next(err)
            }
            user.password=hash;
            next();//调用next，将存储流程走下去，直到你运行下一次next()，内部处于暂停状态，但不影响外部运行。
        });
    });
});

UserSchema.methods={
    comparePassword:function (password, cb) {
              bcrypt.compare(password,this.password,function (err, isMatch) {
                  if(err) return cb(err);
                  cb(null,isMatch);
              })
    }
};

UserSchema.statics={//静态方法模型就可以来调用
    fetch:function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);//由于MovieSchema已经定义了meta.updateAt,exec(cb)执行完后回调函数。
        //exec(cb)意思是，执行查询并将查询结果传入回调函数cb。cb是回调函数，exec是发出调用回调函数的命令。
    },
    findById:function (id,cb) {
        return this.findOne({_id:id}).exec(cb);
    }
};


module.exports = UserSchema;//原型定义方法
