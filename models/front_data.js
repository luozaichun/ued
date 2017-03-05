//Model就是调用mongoose这个模块的时候，对传入的schemas模式进行编译，生成构造函数。
// 由Schema发布生成的模型，具有抽象行为和数据库操作。
var mongoose = require('mongoose');
var MiguanSchema=require('../schemas/front');
var Miguan_data=mongoose.model('miguan_data',MiguanSchema);

module.exports = Miguan_data;

