var mongoose = require('./db')

//equipments集合约束表结构
const EquipmentSchema = mongoose.Schema({
  equipment_id: {type : String , required : true},
  equipment_mac: {type : String , required : true},
  equipment_name: {type : String , required : true},
  region_equipment_id: {type : String , required : true},
  flag: {type : Number , default : 0} //0-未绑定 1-绑定
});
//三个参数的含义，model名，schema名，操作的数据集合
const Equipment= mongoose.model("Equipment",EquipmentSchema ,"equipments");
module.exports = Equipment;