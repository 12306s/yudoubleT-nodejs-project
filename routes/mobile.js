var express = require('express');
var router = express.Router();
var phoneModle = require('../module/phoneModle.js');
//引入multer，并设置好默认的一个tmp目录
var multer = require('multer');
var upload = multer({
    dest:'D:/tep/'
});
var fs = require('fs');
var path = require('path');
var async = require('async');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

router.post('/list',function (req,res) {
    var page = parseInt(req.body.page);
    var pageSize = parseInt(req.body.pageSize);
    var totalPage = 0;

    MongoClient.connect(url, function (err, client) {
        if (err) {
            console.log(err);
        } else {
            var db = client.db('yutian');

            async.parallel([
                function (callback) {
                    // 查询所有条数
                    db.collection('phone').find().count(function (err, num) {
                        if (err) {
                            console.log('查询所有条数失败');
                            callback({ code: -1, msg: '查询失败' });
                        } else {
                            totalPage = Math.ceil(num / pageSize);
                            callback(null,num);
                        }
                    });
                },

                function (callback) {
                    // 分页查询
                    db.collection('phone').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function (err, data) {
                        if (err) {
                            console.log('查询分页数据失败');
                            callback({ code: -1, msg: '查询失败' });
                        } else {
                            callback(null, data);
                        }
                    });
                }
            ], function (err, results) {
                console.log('最终的回调');
                if (err) {
                    res.send(err);
                } else {
                    console.log(results);
                    res.send({ code: 0, msg: '成功', data: {
                        list: results[1],
                        totalPage: totalPage
                    }})
                }
            })

        }
        client.close();
    });

});

router.post('/add', upload.single('mobile'),function (req,res) {
    //req上面就有一个req.file这个属性，这个属性是一个对象，对象里面就是我上传的这个文件的一些属性
    //并且multer还会把其余的一些数据放到req.body 里面
    // console.log(req.file);
    // console.log(req.body.choose);
    //需要将临时目录下的文件读取过来，在写入到哪里
    fs.readFile (req.file.path,function (err,data) {
        if (err) {
            console.log('读取文件失败',err);
        } else {
            //写
            var fileName = new Date().getTime() + "_" + req.file.originalname;
            var dest_file = path.resolve(__dirname, '../public/images/phone/', fileName);
            console.log(dest_file);
            fs.writeFile(dest_file,data,function (err) {
                if (err) {
                    console.log ('写入失败',err);
                } else {
                    phoneModle.add ({
                        name: req.body.mobileName,
                        brand:req.body.choose,
                        guanPrice: req.body.guanPrice,
                        secondPrice: req.body.secondPrice,
                        src: 'images/phone/'+fileName
                    },function (err,data) {
                        if (err) {
                            res.render('werror',err);
                        } else {
                            console.log('进来了吗');
                            res.redirect('/mobile-manager.html');
                        }
                    });
                }
            });
        }
    });
});

router.get('/delete', function (req, res) {

    phoneModle.deletePhone(req.query.id, function (err) {
        if (err) {
            res.render('werror', err);
        } else {
            res.send('<script>location.replace("/mobile-manager.html")</script>');
        }
    });
});

//修改功能
router.post('/update', function (req, res) {
    phoneModle.updatePhone({
        _id: req.body.id,
        names: req.body.names,
        brands: req.body.brands,
        guanprices: req.body.guanprices,
        secondprices: req.body.secondprices
    }, function (err, data) {
        if (err) {
            console.log('执行出错');
        } else {
            console.log('执行完成');
            res.redirect('/mobile-manager.html')
            // res.send('<script>location.replace("/user-manager.html")</script>');
        }
    })
});

router.post('/brandAdd', upload.single('logo'),function (req,res) {
    fs.readFile(req.file.path, function (err, data) {
        if (err) {
            console.log('读取文件失败', err);
        } else {
            //写
            var fileName = new Date().getTime() + "_" + req.file.originalname;
            var dest_file = path.resolve(__dirname, '../public/images/phone/', fileName);
            console.log(dest_file);
            fs.writeFile(dest_file, data, function (err) {
                if (err) {
                    console.log('写入失败', err);
                    res.send({code:-1,msg:'新增手机失败'});
                } else {
                    phoneModle.add({
                        name: req.body.mobileName,
                        brand: req.body.choose,
                        guanPrice: req.body.guanPrice,
                        secondPrice: req.body.secondPrice,
                        src: 'images/phone/' + fileName
                    }, function (err, data) {
                        if (err) {
                            res.render('werror', err);
                        } else {
                            console.log('进来了吗');
                            res.redirect('/mobile-manager.html');
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;