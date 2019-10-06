var mongoose = require('./db')

//region集合约束表结构
const RegionSchema = mongoose.Schema({
  region_id: {type : String , required : true},
  region_name: {type : String , required : true},
  region_regtime: {type : Date , default:new Date()},
  equipment_region_id: {type : String},
  warehouse_region_id: {type : String , required : true},
  flag: {type : Number , default : 0} //0-未绑定 1-绑定
});
//三个参数的含义，model名，schema名，操作的数据集合
const Region= mongoose.model("Region",RegionSchema ,"regions");
module.exports = Region;