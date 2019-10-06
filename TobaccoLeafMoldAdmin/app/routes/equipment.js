var express = require('express')
var Equipment = require('../models/equipment')
var Region = require('../models/region')

var equipment = express.Router()

//===================================设备管理=======================================
//1.请求设备管理界面
equipment.get('/equipment/mange', function (req, res) {
  //根据区域编号显示该区域下的设备
  Equipment.find().where('region_equipment_id', req.body.id).exec(function (err, data) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.render('equipment_mange.html', {
      warehouse_id: req.session.warehouse_id,
      region_id: req.session.region_id,
      equipments: data
    })
  })
})
//2.跳转添加设备界面
equipment.get('/equipment/new', function (req, res) {
  //1.查询该仓库下的区域
  Region.find().where({ warehouse_region_id: req.session.warehouse_id, flag: 0 }).exec(function (err, regions) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    //3.传送数据到渲染界面
    res.render('equipment_new.html', {
      region_id: req.session.region_id,
      regions: regions
    })
  })
})
//3.post设备表单请求,处理提交表单数据
equipment.post('/equipment/new', function (req, res) {

  flag = 0
  if (req.body.region_equipment_id.match('W')) {
    //设置设备已经绑定
    flag = 1
    //然后根据区域编号查找该区域，将该区域的flag设置为1
    Region.findOneAndUpdate(req.body.region_equipment_id, 
      {equipment_region_id:req.body.equipment_id,flag:1}, 
      function (err) {
      if (err) {
        return res.status(500).send('Server error.')
      }
  })
}
  // 新建设备实体
  new Equipment({
    equipment_id: req.body.equipment_id,
    equipment_mac: req.body.equipment_mac,
    equipment_name: req.body.equipment_name,
    region_equipment_id: req.body.region_equipment_id,
    flag: flag
  }).save(function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/equipment/mange')
  })
})
//4.编辑设备信息界面
equipment.get('/equipment/edit', function (req, res) {
  Equipment.findById(req.query.id.replace(/"/g, ''), function (err, equipment) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    //显示该仓库下的未绑定的区域
    Region.find().where('warehouse_region_id', req.session.warehouse_id).exec(function (err, data) {
      if (err) {
        return res.status(500).send('Server error.')
      }
      res.render('equipment_edit.html', {
        equipment: equipment,
        regions: data
      })
    })
  })
})
//5.提交编辑界面数据更新
equipment.post('/equipment/edit', function (req, res) {
  //1.获取表单数据
  //  req.body
  //2.更新
  //3.发送响应
  var id = req.body.id.replace(/"/g, '')
  Equipment.findByIdAndUpdate(id, req.body, function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/equipment/mange')
  })
})
//6.删除设备
equipment.get('/equipment/delete', function (req, res) {
  //1.获取要删除的ID
  //2.根据ID执行删除操作
  //3.根据操作结果发送响应数据
  var id = req.query.id.replace(/"/g, '')
  Equipment.findByIdAndRemove(id, function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/equipment/mange')
  })
})
module.exports = equipment