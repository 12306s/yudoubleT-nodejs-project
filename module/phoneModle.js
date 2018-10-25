const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const async = require('async');

const phoneModle = {
    //添加操作
    add (data,cb) {
        MongoClient.connect (url,function (err,client) {
            if (err) {
                cb({code:'错误状态为：-101',msg:'错误信息为：连接数据库失败'});
                return;
            } else {
                var db = client.db('yutian');
                let dataSave = {
                    name: data.name,
                    brand: data.brand,
                    guanprice: data.guanPrice,
                    secondprice: data.secondPrice,
                    src: data.src,
                }
                console.log(dataSave);

                async.series([
                    function (callback) {
                        db.collection('phone').find().sort({ _id: -1 }).toArray(function (err, result) {
                            if (err) {
                                callback({ code: '错误状态为：-101', msg: '查询记录失败' });
                            } else {
                                if (result == '') {
                                    dataSave._id = 1;
                                } else {
                                    //result是一个数组，当前获取的是倒序后排第一的id
                                    var num = result[0]._id;
                                    console.log(result[0]._id);
                                    num++;
                                    dataSave._id = num;
                                }
                                callback(null);
                            }
                        });
                    },
                    function (callback) {
                        //添加数据库的操作
                        db.collection('phone').insertOne(dataSave, function (err) {
                            if (err) {
                                callback({ code: '错误状态为：-101', msg: '新增写入失败！' });
                            } else {
                                console.log('新增写入成功！');
                                callback(null);
                            }
                        })
                    }
                ],function (err,result) {
                    if(err) {
                        cb (err);
                    } else {
                        console.log('进来fff了吗');
                        cb(null,result)
                    }
                });
            }
        })
    },
    //删除操作
    deletePhone(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: '错误信息为:-101', msg: '连接数据库失败' });
            } else {
                var db = client.db('yutian');
                db.collection('phone').deleteOne({ _id: parseInt(data) }, function (err) {
                    if (err) {
                        cb({ code: '错误信息为:-101', msg: '删除数据失败' })
                    } else {
                        cb(null);
                        console.log("删除成功");
                    }
                });
                client.close();
            }
        })
    },
    //更新
    updatePhone(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: '错误信息为:-101', msg: '连接数据库失败' });
            } else {
                var db = client.db('yutian');
                console.log(data.guanprices.split('￥')[1]);
                db.collection('phone').updateOne({
                    _id: parseInt(data._id)
                },{
                    $set: {
                        name: data.names,
                        brand: data.brands,
                        guanprice: data.guanprices.split('￥')[1],
                        secondprice: data.secondprices.split('￥')[1]
                    }
                });
                cb(null);
            }
            client.close();
        });
    }
}
module.exports = phoneModle;