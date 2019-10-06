/**
 * user.js
 * 数据操作文件模块
 * 职责：操作文件中的数据，只处理数据，不关心业务
 */

var fs = require('fs')
var dbPath = 'db/db.json'
/**
 * 获取所有用户列表
 */
exports.find = function (callback) {
  fs.readFile(dbPath, 'utf8', function (err, data) {
    if (err) {
      return callback(err)
    }
    //从文件中读取到的数据一定是字符串
    //所以这里一定要手动转换成对象
    callback(null, JSON.parse(data).users)
  })
}
/**
 * 根据 id 获取学生信息对象
 */
exports.findById = function (user_id, callback) {
  fs.readFile(dbPath, 'utf8', function (err, data) {
    if (err) {
      return callback(err)
    }
    var users = JSON.parse(data).users
    var ret = users.find(function (item) {
      return item.user_id === parseInt(user_id)
    })
    callback(null, ret)
  })
}
/**
* 添加保存用户
*/
exports.save = function (user, callback) {
  fs.readFile(dbPath, 'utf8', function (err, data) {
    if (err) {
      return callback(err)
    }
    var users = JSON.parse(data).users
    // 添加 id ，唯一不重复
    user.user_id = users[users.length - 1].user_id + 1
    // 把用户传递的对象保存到数组中
    users.push(user)
    // 把对象数据转换为字符串
    var fileData = JSON.stringify({
      users: users
    })
    // 把字符串保存到文件中
    fs.writeFile(dbPath, fileData, function (err) {
      if (err) {
        // 错误就是把错误对象传递给它
        return callback(err)
      }
      // 成功就没错，所以错误对象是 null
      callback(null)
    })
  })
}

/**
* 更新用户
*/
exports.updateById = function (user, callback) {
  fs.readFile(dbPath, 'utf8', function (err, data) {
    if (err) {
      return callback(err)
    }
    var users = JSON.parse(data).users
    // 注意：这里记得把 id 统一转换为数字类型
    user.user_id = parseInt(user.user_id)
    // 你要修改谁，就需要把谁找出来
    // EcmaScript 6 中的一个数组方法：find
    // 需要接收一个函数作为参数
    // 当某个遍历项符合 item.id === user.id 条件的时候，find 会终止遍历，同时返回遍历项
    var userArray = users.find(function (item) {
      return item.user_id === user.user_id
    })
    // 遍历拷贝对象
    for (var key in user) {
      userArray[key] = user[key]
    }
    // 把对象数据转换为字符串
    var fileData = JSON.stringify({
      users: users
    })
    // 把字符串保存到文件中
    fs.writeFile(dbPath, fileData, function (err) {
      if (err) {
        // 错误就是把错误对象传递给它
        return callback(err)
      }
      // 成功就没错，所以错误对象是 null
      callback(null)
    })
  })
}

/**
* 删除用户
*/
exports.deleteByID = function (user_id, callback) {
  fs.readFile(dbPath, 'utf8', function (err, data) {
    if (err) {
      return callback(err)
    }
    var users = JSON.parse(data).users

    // findIndex 方法专门用来根据条件查找元素的下标
    var deleteId = users.findIndex(function (item) {
      return item.user_id === parseInt(user_id)
    })

    // 根据下标从数组中删除对应的学生对象
    users.splice(deleteId, 1)

    // 把对象数据转换为字符串
    var fileData = JSON.stringify({
      users: users
    })

    // 把字符串保存到文件中
    fs.writeFile(dbPath, fileData, function (err) {
      if (err) {
        // 错误就是把错误对象传递给它
        return callback(err)
      }
      // 成功就没错，所以错误对象是 null
      callback(null)
    })
  })
}