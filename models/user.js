var mongoose = require('mongoose');
var UserSchema=require('../schemas/user');
var User=mongoose.model('user',UserSchema);



module.exports = User;