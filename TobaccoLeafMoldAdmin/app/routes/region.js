var express = require('express')
var Region = require('../models/region')
var Equipment = require('../models/equipment')
var Sensor = require('../models/sensor')

var region = express.Router()

//===================================区域管理=======================================
//1.请求区域监控界面
region.get('/region', function (req, res) {
  //1.把仓库id存储到session中
  req.session.region_id = req.query.id
  console.log(req.query.id)
  //2.先进行区域所绑定的设备查询
  Region.find().where('region_id', req.query.id).exec(function (err, region) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    //得到该区域所绑定的设备编号
    console.log(region)
    var equipment_sensor_id = region.equipment_region_id
    console.log(region.equipment_region_id)
    //3.根据绑定的设备ID查询设备下的传感器 
    //4.每次查询获取最新的一条数据
    Sensor.find().where('equipment_sensor_id', equipment_sensor_id).limit(5).exec(function (err, sensors) {
      if (err) {
        return res.status(500).send('Server error.')
      }
      //8.渲染数据到页面
      res.render('region.html', {
        warehouse_id: req.session.warehouse_id,
        region_id: req.session.region_id,
        equipment_sensor_id:equipment_sensor_id,
        sensors:sensors
      })
    })
  })
})
//2.请求区域管理界面
region.get('/region/mange', function (req, res) {
  Region.find().where('warehouse_region_id', req.query.id).exec(function (err, regions) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    //readFile 的第二个参数是可选的，传入 utf8 就是告诉它把读取到的文件直接按照 utf8 编码转成我们能认识的字符

    res.render('region_mange.html', {
      warehouse_id: req.session.warehouse_id,
      regions: regions
    })
  })
})

//3.跳转添加区域界面
region.get('/region/new', function (req, res) {
  //查出所有设备编号，渲染到添加页面层
  Equipment.find().where('flag', 0).exec(function (err, equipments) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.render('region_new.html', {
      warehouse_id: req.query.id,
      equipments: equipments
    })
  })

})
//4.post区域表单请求,处理提交表单数据
region.post('/region/new', function (req, res) {
  flag = 0
  if (req.body.equipment_region_id.match('E')) {
    //设置区域已经绑定
    flag = 1
    //则根据设备编号，将其设备的flag也设置为1
    Equipment.findOneAndUpdate(req.body.equipment_region_id,
      { region_equipment_id: req.body.region_id, flag: 1 },
      function (err) {
        if (err) {
          return res.status(500).send('Server error.')
        }
      })
  }
  new Region({
    region_id: req.body.region_id,
    region_name: req.body.region_name,
    region_regtime: req.body.region_regtime,
    equipment_region_id: req.body.equipment_region_id,
    warehouse_region_id: req.body.warehouse_region_id,
    flag: flag
  }).save(function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/region/mange?id=' + req.body.warehouse_region_id)
  })
})
//5.编辑区域信息界面
region.get('/region/edit', function (req, res) {
  Region.findById(req.query.id.replace(/"/g, ''), function (err, region) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    Equipment.find().where('flag', 0).exec(function (err, equipments) {
      if (err) {
        return res.status(500).send('Server error.')
      }
      res.render('region_edit.html', {
        region: region,
        equipments: equipments
      })
    })
  })
})
//6.进行区域编辑POST请求的处理
region.post('/region/edit', (request, response) => {
  let first_id = request.body._id
  let after_id = first_id.replace(/\"/g, "")
  Region.updateOne({ _id: after_id }, {
    $set: {
      region_id: request.body.region_id,
      region_name: request.body.region_name,
      region_regtime: request.body.region_regtime,
      equipment_region_id: request.body.equipment_region_id
    }
  }, (result, data) => {
    //判断绑定的设备是否更换了，如果更换了，要查询数据库进行设备集合的数据修改
    if (request.body.old_equipment_id != request.body.equipment_region_id) {
      //首先将旧绑定的设备释放
      Equipment.updateOne({ equipment_id: request.body.old_equipment_id },
        { $set: { "flag": 0, "warehouse_region_id": "" } }, (err, data) => {
          //接着把新的设备绑定在区域上
          Equipment.updateOne({ equipment_id: request.body.region_equipment_id },
            { $set: { "flag": 1, "warehouse_region_id": request.body.warehouse_region_id } }, (err, data) => {
              console.log('设备更换成功')
            })
        })
    }
    response.redirect("/region/mange?id=" + request.body.warehouse_region_id)
  })
})

//7 根据区域在数据库中的_id进行删除,同时释放绑定的的设备
region.get('/region/delete', async (request, response) => {
  let region_id_del = request.query._id.replace(/\"/g, "") //处理掉数据库中_id中的引号
  //首先查询该区域绑定的设备
  let find_region = await Region.findOne({ _id: region_id_del }) //先拿到查询结果
  //根据设备号进行解绑，即修改设备中的flag字段
  Equipment.updateOne({ "equipment_id": find_region.equipment_region_id }, { $set: { "flag": 0, "region_equipment_id": "" } }, (err, data) => {
    //如果设备成功解绑了后，把该区域进行删除
    Region.deleteOne({ _id: region_id_del }, (err, data) => {
      console.log('成功删除' + find_region.region_name)
      let response_obj = { status: 'ok' }
      let response_json = JSON.stringify(response_obj)
      response.send(response_json)
    })
  })
})

module.exports = region
