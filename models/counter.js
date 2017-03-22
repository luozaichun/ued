var mongoose = require('mongoose');
var counterSchema=require('../schemas/counter');
var counter=mongoose.model('counter',counterSchema);



module.exports = counter;