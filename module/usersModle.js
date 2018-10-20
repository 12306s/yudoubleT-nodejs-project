//模板，是用来操作users相关的后台数据库处理的代码
//注册操作
//登录操作
//修改操作
//删除操作
//查询列表
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const async = require('async');

const usersModle = {
    //添加操作，注册操作
    /**
     * 
     * @param {Object} data 注册信息
     * @param {function} cb 回调函数
     */
    add(data,cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败',err);
                cb({code:-101,msg:'连接数据库失败'});
                return;
            }
            const db = client.db('yutian');
            //1.对前端传过来的data做修改，isAdmin修改为is_Admin
            //2.写一个id为1
            //思考：下一个注册，先得到之前的用户表记录条数中id最大的数，+1操作之后之后传给下一个人，
            //不允许用户名相同

            let dataSave = {
                username:data.username,
                password:data.password,
                nickname:data.nickname,
                phone:data.phone,
                is_Admin:data.isAdmin
            }

            async.series([

                //判断用户名是否注册
                function (callback) {
                    db.collection('users').find({ username: dataSave.username }).count(function (err, num) {
                        if (err) {
                            callback({ code: -100, msg: '查询注册是否失败' });
                        } else if (num !== 0) {
                            callback({ code: -101, msg: '用户已经被注册过了' });
                        } else {
                            console.log('用户不存在，可以进行注册！');
                            callback(null);
                        }
                    })
                },
                //查询最后一条数据的_id
                function (callback) {
                    db.collection('users').find().sort({ _id: -1 }).toArray(function (err, result) {
                        if (err) {
                            callback({ code: -100, msg: '查询失败' });
                        } else {
                            // console.log(result);
                            // saveData._id = 1;
                            // console.log(result == [] );
                            if (result == '') {
                                dataSave._id = 1;
                                console.log(dataSave._id);
                            } else {
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
                    db.collection('users').insertOne(dataSave, function (err) {
                        if (err) {
                            callback({ code: -100, msg: '用户注册失败！' });
                        } else {
                            console.log('用户注册成功！');
                            callback(null);
                        }
                    })
                }
            ], function (err, results) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    cb(null);
                }
                client.close();
            });











            // db.collection('users').find().sort({ _id: -1 }).toArray(function (err, result) {
            //     // console.log(result[0]._id);
            //     if(err) throw err;
            //     if (result == '') {
            //         dataSave._id=1;
            //     }else {
            //         var num = result[0]._id;
            //         num++;
            //         dataSave._id = num;
            //     }
            //     console.log(dataSave._id);
            //     db.collection('users').insertOne(dataSave, function (err) {
            //         if (err) throw err;
            //         cb(null);
            //     })
            //     cb(null);
            // });

            // client.close();

            
            //不允许用户名相同
            // db.collection('users').find({ username: dataSave.username}).count(function (err,num){
            //     //数量为空则用户名不存在
            //     if (num === 0) {
            //         //先得到之前的用户表记录条数中id最大的数，+1操作之后之后传给下一个人，
            //         db.collection('users').find().count(function (err, num) {
            //             if (err) throw err;
            //             dataSave._id = num + 1;
            //             console.log(dataSave);
            //             db.collection('users').insertOne(dataSave, function (err) {
            //                 if (err) throw err;
            //                 cb(null);
            //             })
            //             client.close();
            //         });
            //     }else {
            //         //数量>=1则用户名存在
            //         cb(new Error('用户名已被注册过了！'));
            //         client.close();
            //     }
                
            // });

            


            
            
        });
    }
}





module.exports = usersModle;
