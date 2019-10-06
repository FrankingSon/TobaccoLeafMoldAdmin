/**
 * app.js功能：
 *   创建服务
 *   做一些服务相关配置
 *      模板引擎
 *      解析表单post请求
 *      提供静态资源服务
 *   挂载路由
 *   监听端口启动服务
 */

var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var router = require('./router')
var session_router = require('../app/routes/session')
var warehouse = require('../app/routes/warehouse')
var region = require('../app/routes/region')
var equipment = require('../app/routes/equipment')
var index = require('../app/routes/index')
var session = require('express-session')


const app = express()
app.disable('x-powered-by')

//====开放静态资源====
//app.use('/public/',express.static('./public/'))
//省略第一个参数   直接用/定位资源
//./a.txt相当于执行node命令所处的终端路径
//在文件操作张使用的相对路径都统一转换为----动态绝对路径
//模块中的路径标识和这里的路径没有关系，不受执行node命令所处目录影响
app.use('/public/', express.static(path.join(__dirname, './public')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules')))
//====在挂在路由之前配置====
//====使用art-template模板引擎====
app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views/'))

//====配置body-parser中间件,使服务器能够实现POST操作请求====
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//====配置express-session解决用户登录问题=====
//在配置好插件之后，我们就可以通过req.session来访问和设置session成员
//添加和访问session数据
app.use(session({
    secret: 'tobacco',
    resave: false,
    saveUninitialized: true//无论是否使用session，都默认分配一把钥匙
}))

//=====把路由容器挂在到app服务中====
//index管理
app.use(index)
app.use(router)
//登录注册登出路由
app.use(session_router)
//仓库管理
app.use(warehouse)
//区域管理
app.use(region)
//设备管理
app.use(equipment)

//=====配置处理404请求的中间件====
app.use(function (req, res) {
    res.render('404.html')
})

//=====配置错误处理中间件====
app.use(function (err, req, res, next) {
    //优先处理错误情况
    return res.status(500).json({
        err_code: 500,
        message: err.message
    })
})

app.listen(3000, () => console.log('app listening on port 3000!'))
