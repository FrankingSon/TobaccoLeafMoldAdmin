var mongoose = require('./db')

//warehouses集合约束表结构
const WarehouseSchema = mongoose.Schema({
  warehouse_id: {type : String , required : true},
  warehouse_name: {type : String , required : true},
  warehouse_admin: {type : String , required : true},
  warehouse_address: {type : String , required : true},
  warehouse_notes:{type : String}
});
//三个参数的含义，model名，schema名，操作的数据集合
const Warsehouse= mongoose.model("Warsehouse",WarehouseSchema ,"warehouses");
module.exports = Warsehouse;