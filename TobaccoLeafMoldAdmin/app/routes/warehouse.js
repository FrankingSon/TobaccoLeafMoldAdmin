var express = require('express')
var Warsehouse = require('../models/warehouse')
var Region = require('../models/region')

var warehouse = express.Router()
//===================================仓库管理=======================================
//1.请求仓库监控界面
warehouse.get('/warehouse', function (req, res) {
  //1.把仓库id存储到session中
  req.session.warehouse_id = req.query.id
  //2.查询该仓库下的区域,找出区域名称
  Region.find().where('warehouse_region_id', req.query.id).exec(function (err, data) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    Region.countDocuments({ warehouse_region_id: req.query.id },function (err, count) {
      if (err) {
        return res.status(500).send('Server error.')
      }
      res.render('warehouse_monitoring.html', {
        regions: data,
        count:count,
        warehouse_id:req.session.warehouse_id
      })
    })
  })
})
//2.跳转添加仓库界面
warehouse.get('/warehouse/new', function (req, res) {
  res.render('warehouse_new.html', {
  })
})
//3.post仓库表单请求,处理提交表单数据
warehouse.post('/warehouse/new', function (req, res) {
  //1.获取表单数据
  //2.处理数据
  //3.发送响应
  new Warsehouse(req.body).save(function (err) {
    console.log(req.body)
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/warehouse/mange')
  })
})
//4.请求仓库管理界面
warehouse.get('/warehouse/mange', function (req, res) {
  Warsehouse.find(function (err, warehouses) {
    if (err) {
      return res.status(500).send('Server error')
    }
    //readFile 的第二个参数是可选的，传入 utf8 就是告诉它把读取到的文件直接按照 utf8 编码转成我们能认识的字符
    res.render('warehouse_mange.html', {
      warehouses: warehouses
    })
  })
})
//5.编辑仓库信息界面
warehouse.get('/warehouse/edit', function (req, res) {
  Warsehouse.findById(req.query.id.replace(/"/g, ''), function (err, warehouse) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.render('warehouse_edit.html', {
      warehouse: warehouse
     
    })
  })
})
//6.提交编辑界面数据更新
warehouse.post('/warehouse/edit', function (req, res) {
  //1.获取表单数据
  //  req.body
  //2.更新
  //3.发送响应
  var id = req.body.id.replace(/"/g, '')
  Warsehouse.findByIdAndUpdate(id, req.body, function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/warehouse/mange')
  })
})
//7.删除仓库
warehouse.get('/warehouse/delete', function (req, res) {
  //1.获取要删除的ID
  //2.根据ID执行删除操作
  //3.根据操作结果发送响应数据
  var id = req.query.id.replace(/"/g, '')
  Warsehouse.findByIdAndRemove(id, function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/warehouse/mange')
  })
})

module.exports = warehouse
