//=========================登录、注册、登出=========================
var express = require('express')
var User = require('../models/users')
var md5 = require('blueimp-md5')

var session = express.Router()

session.get('/login', function (req, res) {
    res.render('login.html', {

    })
})

session.post('/login', function (req, res,next) {
    //1.获取表单数据
    //2.查询数据库用户名密码是否正确
    //3.发送响应数据
    var body = req.body

    User.findOne({
        name: body.name,
        password: md5(md5(body.password) + 'tobacco')
    }, function (err, user) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Name or Password is invalid'
            })
        }
        //用户存在，登录成功，通过session记录登录状态
        req.session.user = user

        return res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})
//渲染注册界面
session.get('/register', function (req, res, next) {
    res.render('register.html', {

    })
})
//处理注册表单
session.post('/register', function (req, res, next) {
    //1.获取表单提交数据
    //req.body
    //2.操作数据库
    //判断该用户是否存在
    //3.发送响应
    var body = req.body
    User.findOne({
        name: body.name
    }, function (err, data) {
        if (err) {
            return next(err)
        }
        if (data) {
            //用户名已经存在
            return res.status(200).json({
                err_code: 1,
                message: 'User name already exists.'
            })
        }
        //md5密码加密
        body.password = md5(md5(body.password) + 'tobacco')
        //注册成功，新建一个用户对象存储
        new User(body).save(function (err, user) {
            if (err) {
                return next(err)
            }
            //注册成功，使用session记录用户的登录状态
            req.session.user = user
            //Express提供的响应方法：json
            //该方法接受一个对象作为参数
            //自动帮你把对象转换成字符串发送给浏览器
            return res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })
    })
})
//登出
session.get('/logout', function (req, res, next) {
    //1.清除登录状态
    //2.重定向到登录页
    delete req.session.user
    res.redirect('/login')
})

module.exports = session