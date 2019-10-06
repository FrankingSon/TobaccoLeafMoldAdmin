var mongoose = require('./db')
//users集合约束表结构
const UserSchema = mongoose.Schema({
  name: {type : String , required : true},
  password:{type : String , required : true},
  phone:{type : String , default : ''},
  //不要写Date.now()，否则代码会即可调用
  //Date.now 当 new Model的时候，如果没有传递reg_time,则mogoose会调用Date.now，将返回值作为默认值
  reg_time:{type : Date , default:Date.now},
  //权限
  //0-可以查看、编辑  1-可以查看 2-不可以查看、编辑
  status:{type:Number,enum:[0,1,2],default:0}
});
//三个参数的含义，model名，schema名，操作的数据集合
const User= mongoose.model("User",UserSchema ,"users");
module.exports = User;