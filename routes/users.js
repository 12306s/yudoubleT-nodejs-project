var express = require('express');
var router = express.Router();
var usersModule = require('../module/usersModle.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册处理
router.post('/register',function (req,res) {
  console.log('获取传递过来的post数据');
  console.log(req.body);

  var str = '';
  if (!/^\w{3,6}$/.test(req.body.nickname)) {
     res.render('werror', { code: '错误状态为：-1', msg: '请输入3-6位字符的用户名' });
    return;
  }
  if (!/^\w{5,12}$/.test(req.body.username)) {
    res.render('werror', { code: '错误状态为：-2', msg: '请输入5-12位字符的用户名' });
    return;
  }

  if (!/^\w{6,12}$/.test(req.body.password)) {
    res.render('werror', { code: '错误状态为：-3', msg: '请输入6~12位的密码 ！' });
    return;
  }

  //数据库处理
  //err需要是对象的一个格式
  usersModule.add(req.body,function (err) {
    if(err) {
      //如果有错误，渲染错误信息
      res.render('werror', { code: '错误状态为：-3', msg: '请输入6~12位的密码 ！' });
    }
    //注册成功，调到登录页面（不应该渲染，应该跳转）
    res.redirect('/login.html');
  });

});

module.exports = router;