var mongoose = require('mongoose')
let DB_NAME = "admin"
let DB_URL = "localhost:27017"
// useNewUrlParser设个属性会在url里识别用户所需要的db，升级之后必须指定
mongoose.connect(`mongodb://${DB_URL}/${DB_NAME}`,{useNewUrlParser:true},(err)=>{
    if(err){
        console.log(err+"数据库连接失败");
    }
    console.log("数据库连接成功");
});

module.exports=mongoose