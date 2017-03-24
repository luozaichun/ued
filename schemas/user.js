var mongoose = require('mongoose');
var UserSchema=new mongoose.Schema({
    username:{
        type:String,
        unique: true
    },
    password:String,
    isadmin: {
        type: Boolean,
        default: false
    },
    level:{
        type:Number,
        default: 1
    },
    avatar:String,
    mail:String,
    createAt:{
        type:String,
        default:new Date().toLocaleString().replace(/(\d{4}).(\d{1,2}).(\d{1,2})/mg, "$1-$2-$3").substr(0, 10)
    },
    updateAt:{
        type:String,
        default:new Date().toLocaleString().replace(/(\d{4}).(\d{1,2}).(\d{1,2})/mg, "$1-$2-$3").substr(0, 10)
    }

});


module.exports = UserSchema;//原型定义方法
