/**
 * @Author: Duncan
 * @Date:   2016-12-09
 * @Last Modified by:
 * @Last Modified time:
 * @Function : 微信的用户相关
 */

var customerDAL = appRequire('dal/jinkebro/customer/customerdal'),
    moment = require('moment'),
    logService = appRequire('service/backend/log/logservice'),
    operationConfig = appRequire('config/operationconfig'),
    config = appRequire('config/config'),
    logModel = appRequire('model/jinkebro/log/logmodel');
var wechat = appRequire("service/wechat/wechatservice");
wechat.token = config.weChat.token;

//一个微信的用户类
var Customer = function() {
    this.createTime = moment().format("YYYY-MM-DD HH:mm:ss"); //创建的时间
}

//用户的插入service
Customer.prototype.insert = function(data, callback) {
    data.CreateTime = this.createTime;
    //插入
    for (var key in data) {
        //这边待重构 by snail 2017-01-01 10:52
        if (data[key] === undefined) {
            logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
            logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
            logModel.OperationName = '插入客户的信息时,用户信息为undefined';
            logModel.Action = operationConfig.jinkeBroApp.customerManage.customerAdd.actionName;
            logModel.Memo = '新增客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.operationType.operation;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');

            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });

            return;
        }
    }

    customerDAL.insert(data, function(err, results) {
        if (err) {
            //生成操作的日志
            //这边待重构 by snail 2017-01-01 10:52
            logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
            logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
            logModel.OperationName = '插入客户的信息失败';
            logModel.Action = operationConfig.jinkeBroApp.customerManage.customerAdd.actionName;
            logModel.Memo = '插入客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');

            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });

            console.log("插入失败");
            return;
        }
        //生成操作的日志
        console.log("插入成功");
        callback(false, results);
    });
};

//用户的账户更新的service
Customer.prototype.update = function(data, callback) {
    //判断传过来的数据是否未定义
    for (var key in data) {
        if (data[key] === undefined) {
            logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
            logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
            logModel.OperationName = '更新客户的信息时，有数据未定义';
            logModel.Action = operationConfig.jinkeBroApp.customerManage.customerUpd.actionName;
            logModel.Memo = '更新客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.operationType.operation;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');

            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
            console.log("更新的数据数据未定义");
            return;
        }
    }

    customerDAL.update(data, function(err, result) {
        if (err) {
            logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
            logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
            logModel.OperationName = '更新客户的信息时出错';
            logModel.Action = operationConfig.jinkeBroApp.customerManage.customerUpd.actionName;
            logModel.Memo = '更新客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');

            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
            console.log("更新失败，sql的检查");
            callback(true);
            return;
        }
        callback(false, result);
    });
};

//用户的账户的查询
Customer.prototype.query = function(data, callback) {
    for (var key in data) {
        if (data[key] === undefined) {
            logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
            logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
            logModel.OperationName = '查询客户的信息时，有数据未定义';
            logModel.Action = operationConfig.jinkeBroApp.customerManage.customerQuery;
            logModel.Memo = '查询客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.operationType.operation;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');

            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
            console.log("查询的数据数据未定义");
            return;
        }
    }

    customerDAL.query(data, function(err, result) {
        if (err) {
            logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
            logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
            logModel.OperationName = '查询客户的信息时';
            logModel.Action = operationConfig.jinkeBroApp.customerManage.customerQuery;
            logModel.Memo = '查询客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeErr('生成操作日志异常' + new Date());
                }
            });
            console.log("查询数据失败");
            callback(true);
            return;
        }
        callback(false, result);
    });
}

/** 
 * 用户关注公众号
 * 潜在的问题：新关注的用户在关注的时候，应用在走到最后的insert方法的时候，假如失败了，其实此时并没有入库
 * by snail 2017-01-01 暂时可以不fix
 * 
 */
Customer.prototype.addSubscibe = function(token, msg, callback) {
    //用类中的函数
    var me = this;

    //获取用户的信息
    wechat.getCustomerInfo(token, msg.FromUserName, function(info) {
        var data = {
            'WechatUserCode': info.openid,
            Sex: info.sex,
            NickName: info.nickname,
            IsActive: 1
        };

        /**
         *这边可以写成遍历info的所有属性，如果含有city、province、country、remark属性且不为空
         *即可以
         *by snail 2017-01-01 11:00
         */
        if (info.city.length != 0) {
            data.City = info.city;
        }

        if (info.province.length != 0) {
            data.Province = info.province;
        }

        if (info.country.length != 0) {
            data.Country = info.country;
        }

        if (info.remark.length != 0) {
            data.Memo = info.remark;
        }

        //根据WechatUserCode来查询是否存在这个用户
        var queryInfo = {
            'WechatUserCode': info.openid
        };

        //开始查询是否存在用户
        me.query(queryInfo, function(err, resultInfo) {
            if (err) {
                console.log("查询失败");
                var errinfo = '在添加用户的时候查询失败';
                callback(true, errinfo);
                return;
            }

            if (resultInfo != undefined && resultInfo.length != 0) {
                // console.log("用户名已经存在");
                //当用户名存在做更新操作
                data.CustomerID = resultInfo[0].CustomerID;

                me.update(data, function(err, updataInfo) {
                    if (err) {
                        var errinfo = '关注的时候二次关注更新失败';
                        console.log("更新失败");
                        callback(true, errinfo);
                        return;
                    }

                    if (updataInfo != undefined && updataInfo.affectedRows != 0) {
                        console.log("更新成功");
                        callback(false, '');
                        return;
                    }
                });
            } else {
                //用户名不存在的时候做插入的操作
                me.insert(data, function(err, insertInfo) {
                    if (err) {
                        console.log("插入失败");
                        var errinfo = '当插入客户信息失败';
                        callback(true, errinfo);
                        return;
                    }

                    if (insertInfo != undefined && insertInfo.affectedRows != 0) {
                        console.log("插入成功");
                        callback(false, '');
                        return;
                    }
                });
            }
        });
    });
}

//取消关注的人
Customer.prototype.unsubscribe = function(token, msg, callback) {
    //用类中的函数
    var me = this;

    wechat.getCustomerInfo(token, msg.FromUserName, function(info) {
        var data = {
            WechatUserCode: info.openid,
            IsActive: 1
        }

        me.query(data, function(err, resultInfo) {
            if (err) {
                console.log("查询失败");
                var errinfo = '在用户取消关注公众号的时候查询失败';
                callback(true, errinfo);
                return;
            }

            if (resultInfo != undefined && resultInfo.length != 0) {
                //当用户名存在做更新操作
                data.CustomerID = resultInfo[0].CustomerID;
                data.IsActive = 0;

                me.update(data, function(err, updataInfo) {
                    if (err) {
                        console.log("更新失败");
                        var errinfo = '用户取消关注公众号时更新失败';
                        callback(true, errinfo);
                        return;
                    }

                    if (updataInfo != undefined && updataInfo.affectedRows != 0) {
                        console.log("更新成功");
                        callback(false, '');
                        return;
                    }
                });
            }
        });
    });
}

//添加获取地址的模块
Customer.prototype.addLocation = function(msg, callback) {
    me = this;
    //获取地址事件者的openid
    var locationData = {
        'WechatUserCode': msg.FromUserName,
        'Lon': msg.Longitude,
        'Lat': msg.Latitude
    }

    var queryData = {
        'WechatUserCode': msg.FromUserName
    }

    this.query(queryData, function(err, queryInfo) {
        if (err) {
            console.log("查询失败");
            var errinfo = '在获取地址的时候查询失败';
            callback(true, errinfo);
            return;
        }

        if (queryInfo != undefined && queryInfo.length != 0) {
            locationData.CustomerID = queryInfo[0].CustomerID;
            me.update(locationData, function(err, updataInfo) {
                if (err) {
                    console.log("更新失败");
                    var errinfo = "获取地址时出错";
                    callback(true, errinfo);
                    return;
                }
                if (updataInfo != undefined && updataInfo.affectedRows != 0) {
                    console.log("更新成功");
                    callback(false);
                    return;
                }
            });
        }
    });
}

//关于添加微信的所有列表
Customer.prototype.addAllList = function(token, callback) {
    var me = this;
    //用来记录总共有多少的openid   
    var arrOfOpenID = [];

    //获取所有的列表
    wechat.getCustomerList(token, function(infoList) {
        var list = new Array();

        for (var key in infoList.data.openid) {
            // list[k] = infoList.data.openid[key];
            // k++;
            arrOfOpenID.push(infoList.data.openid[key]);
        }

        // for (var i = 0; i < k; ++i) {
        //     var queryInfo = {
        //         'WechatUserCode': list[i]
        //     };

        //     me.addListFunction(token, queryInfo, function(err, result) {
        //         if (err) {
        //             callback(true, result);
        //             return;
        //         }

        //         callback(false, result);
        //     });
        // }

        for (openid in arrOfOpenID) {
            me.addListFunction(token, {
                'WechatUserCode': openid
            }, function(err, result) {
                if (err) {
                    callback(true, result);
                    return;
                }

                callback(false, result);
            });
        }
    });
}

/**
 *1、当获取所有的列表的时候，for的循环的时候，解决异步问题
 *2、具体的方法：查询openid，如果存在就不填加信息，，如果不存在就添加用户的信息
 */
Customer.prototype.addListFunction = function(token, data, callback) {
    var me = this;
    this.query(data, function(err, resultInfo) {

        if (err) {
            var errinfo = '在添加用户的时候查询失败';
            callback(true, errinfo);
            return;
        }

        //console.log(resultInfo);

        if (resultInfo != undefined && resultInfo.length != 0) {
            var errinfo = '用户名已经存在，不需要重复插入';
            callback(true, errinfo);
            return;
        } else {
            wechat.getCustomerInfo(token, data.WechatUserCode, function(info) {
                var insertData = {
                    'WechatUserCode': info.openid
                };
                //获取用户的信息
                insertData.Sex = info.sex;
                insertData.NickName = info.nickname;
                insertData.IsActive = 1;

                if (info.city && info.city.length != 0) {
                    insertData.City = info.city;
                }
                if (info.province && info.province.length != 0) {
                    insertData.Province = info.province;
                }
                if (info.country && info.country.length != 0) {
                    insertData.Country = info.country;
                }
                if (info.remark && info.remark.length != 0) {
                    insertData.Memo = info.remark;
                }

                me.insert(insertData, function(err, insertInfo) {
                    if (err) {
                        console.log("插入失败");
                        var errinfo = '当插入客户信息失败';
                        callback(true, errinfo);
                        return;
                    }
                    if (insertInfo != undefined && insertInfo.affectedRows != 0) {
                        console.log("插入成功");
                        callback(false, '获取所有列表的填补成功');
                        return;
                    }
                });
            });
        }
    });
}

module.exports = new Customer();