var express = require('express')
var Warsehouse = require('../models/warehouse')

var index = express.Router()
//===================================主页面=======================================
index.get('/', function (req, res) {
  //首先判断用户是否登录
  if (req.session.user) {
    Warsehouse.find(function (err, warehouses) {
      if (err) {
        return res.status(500).send('Server error')
      }
      res.render('index.html', {
        warehouses: warehouses,
        isopen:req.session.warehouse_id
      })
    })
  }else{
    //如果没有登录则返回登录界面
    res.redirect('/login')
  }
})
module.exports = index
