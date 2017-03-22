var mongoose = require('mongoose');
var counterSchema=new mongoose.Schema({
    _id:String,
    seq: Number
});
/*counters.insert({
 _id: "default",
 seq: 0
 })*/
module.exports=counterSchema;//原型定义方法