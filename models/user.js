var mongoose = require('mongoose');
var UserSchema=require('../schemas/user');
var User=mongoose.model('miguan_user',UserSchema);



module.exports = User;