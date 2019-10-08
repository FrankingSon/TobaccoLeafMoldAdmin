var mongoose = require('./db')

//sensors集合约束表结构
const SensorSchema = mongoose.Schema({
  sensor_id: {type : String , required : true},
  sensor_name: {type : String , required : true},
<<<<<<< HEAD
  sensor_value: {type : String , default: () => moment(new Date()).format('YYYY-MM-DD')},
=======
  sensor_value: {type : String , required : true},
>>>>>>> b8cade99b9d69f1520b13cf17eaf9e6904adb00d
  equipment_sensor_id: {type : String},
  flag: {type : Number , default : 0} //0-正常 1-过高 2-过低
});
//三个参数的含义，model名，schema名，操作的数据集合
const Sensor= mongoose.model("Sensor",SensorSchema ,"sensors");
module.exports = Sensor;