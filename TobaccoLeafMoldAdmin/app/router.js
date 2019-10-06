/**
 * router功能：
 *    处理路由
 *    根据不同的请求方法+请求路径设置具体的请求处理函数
 */
var express = require('express')
var User = require('../app/models/users')
//1.创建路由容器
var router = express.Router()

//2.把路由都挂在到这个路由容器中
//html文件中一般存放在views文件中
//===================================用户管理======================================
//1.请求用户列表
router.get('/user', function (req, res) {
  User.find(function (err, users) {
    if (err) {
      return res.status(500).send('Server error')
    }
    //readFile 的第二个参数是可选的，传入 utf8 就是告诉它把读取到的文件直接按照 utf8 编码转成我们能认识的字符
    res.render('user.html', {
      users: users
    })
  })
})
//2.跳转添加用户界面
router.get('/user/new', function (req, res) {
  res.render('user_new.html', {
  })
})
//3.post用户表单请求,处理提交表单数据
router.post('/user/new', function (req, res) {
  //1.获取表单数据
  //2.处理数据
  //3.发送响应
  new User(req.body).save(function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/user')
  })
})
//4.编辑用户
router.get('/user/edit', function (req, res) {
  User.findById(req.query.id.replace(/"/g,''), function (err, user) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.render('user_edit.html', {
      user: user
    })
  })
})
//5.提交编辑界面数据更新
router.post('/user/edit', function (req, res) {
  //1.获取表单数据
  //  req.body
  //2.更新
  //3.发送响应
  var id = req.body.id.replace(/"/g,'')
  User.findByIdAndUpdate(id, req.body, function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/user')
  })
})
//6.删除用户
router.get('/user/delete', function (req, res) {
  //1.获取要删除的ID
  //2.根据ID执行删除操作
  //3.根据操作结果发送响应数据
  var id = req.query.id.replace(/"/g,'')
  User.findByIdAndRemove(id, function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/user')
  })
})

//3.导出router
module.exports = router
