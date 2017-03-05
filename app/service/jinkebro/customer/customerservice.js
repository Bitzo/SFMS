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
var logger = appRequire('util/loghelper').helper;
var wechat = appRequire("service/wechat/wechatservice");
wechat.token = config.weChat.token;

//一个微信的用户类
var Customer = function() {
    this.createTime = moment().format("YYYY-MM-DD HH:mm:ss"); //创建的时间
}

//用户的插入service
Customer.prototype.insert = function(data, callback) {
    console.log("进入插入的函数");
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
            logModel.CreateUserID = 0;
            logModel.Type = operationConfig.operationType.error;
            logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeError('生成操作日志异常' + new Date());
                }
            });
            logger.writeError("[service/jinkebro/customer/customerservice----------------47行]新增用户失败");
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
            logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');

            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeError('生成操作日志异常' + new Date());
                    return;
                }
            });

            logger.writeError("[service/jinkebro/customer/customerservice----------------74行]插入客户的时候失败");
            return;
        }
        //生成操作的日志
        console.log("插入成功");
        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
        logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
        logModel.OperationName = '插入客户的信息成功';
        logModel.Action = operationConfig.jinkeBroApp.customerManage.customerAdd.actionName;
        logModel.Memo = '插入客户成功';
        logModel.CreateUserID = 1;
        logModel.Type = operationConfig.operationType.operation;
        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        logModel.PDate = moment().format('YYYY-MM-DD');

        logService.insertOperationLog(logModel, function(err, insertId) {
            if (err) {
                logger.writeError('生成操作日志异常' + new Date());
                return;
            }
        });
        logger.writeInfo("[service/jinkebro/customer/customerservice-------------96行]插入用户的时候成功");
        return callback(false, results);
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
            logModel.Type = operationConfig.operationType.error;
            logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerUpd.identifier;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');

            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeError('生成操作日志异常' + new Date());
                }
            });
            console.log("更新的数据数据未定义");
            logger.writeError("[service/jinkebro/customer/customerservice---------123行]更新数据未定义");
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
            logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerUpd.identifier;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');

            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeError('生成操作日志异常' + new Date());
                }
            });
            console.log("更新失败，sql的检查");
            logger.writeError("[service/jinkebro/customer/customerservice---------148行]更新数据失败，sql的检查");
            callback(true);
            return;
        }

        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
        logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
        logModel.OperationName = '更新微信客户成功';
        logModel.Action = operationConfig.jinkeBroApp.customerManage.customerAdd.actionName;
        logModel.Memo = '更新客户成功';
        logModel.CreateUserID = 0;
        logModel.Type = operationConfig.operationType.operation;
        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        logModel.PDate = moment().format('YYYY-MM-DD');

        logService.insertOperationLog(logModel, function(err, insertId) {
            if (err) {
                logger.writeError('生成操作日志异常' + new Date());
                return;
            }
        });
        return callback(false, result);
    });
};

//用户的账户的查询
Customer.prototype.query = function(data, callback) {
    console.log("进入查询的接口");
    for (var key in data) {
        if (data[key] === undefined) {
            logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
            logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
            logModel.OperationName = '查询客户的信息时，有数据未定义';
            logModel.Action = operationConfig.jinkeBroApp.customerManage.customerQuery.actionName;
            logModel.Memo = '查询客户失败';
            logModel.CreateUserID = 1;
            logModel.Type = operationConfig.operationType.error;
            logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerQuery.identifier;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');

            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeError('生成操作日志异常' + new Date());
                }
            });
            console.log("查询的数据数据未定义");
            logger.writeError("[service/jinkebro/customer/customerservice---------196行]" + "查询的数据数据未定义");
            return;
        }
    }

    customerDAL.query(data, function(err, result) {
        if (err) {
            logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
            logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
            logModel.OperationName = '查询客户的信息时';
            logModel.Action = operationConfig.jinkeBroApp.customerManage.customerQuery.actionName;
            logModel.Memo = '查询客户失败';
            logModel.CreateUserID = 0;
            logModel.Type = operationConfig.operationType.error;
            logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerQuery.identifier;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertId) {
                if (err) {
                    logger.writeError('生成操作日志异常' + new Date());
                }
            });
            console.log("查询数据失败");
            logger.writeError("[service/jinkebro/customer/customerservice---------219行]" + "查询数据");
            return callback(true);
        }

        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
        logModel.ApplicationName = operationConfig.jinkeBroApp.applicationName;
        logModel.OperationName = '查询客户的信息成功';
        logModel.Action = operationConfig.jinkeBroApp.customerManage.customerAdd.actionName;
        logModel.Memo = '查询客户成功';
        logModel.CreateUserID = 0;
        logModel.Type = operationConfig.operationType.operation;
        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        logModel.PDate = moment().format('YYYY-MM-DD');

        logService.insertOperationLog(logModel, function(err, insertId) {
            if (err) {
                logger.writeError('生成操作日志异常' + new Date());
                return;
            }
        });
        return callback(false, result);
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
        for (var key in info) {
            if (info.key && info.key.length != 0) {
                data.key = info.key;
            }
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
                logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                logModel.OperationName = '添加微信的用户时验证是否已存在';
                logModel.Action = '添加微信的用户时的验证查询';
                logModel.Memo = '查询失败';
                logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
                logModel.CreateUserID = 0;
                logModel.Type = operationConfig.operationType.operation;
                logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                logModel.PDate = moment().format('YYYY-MM-DD');
                logService.insertOperationLog(logModel, function(err, insertID) {
                    if (err) {
                        logger.writeError('添加微信的用户时的验证查询失败，生成操作日志异常' + new Date());
                    }
                });

                logger.writeError("[service/jinkebro/customer/customerservice-----------299行]添加微信用户的时候查询失败");
                return callback(true, errinfo);
            }

            if (resultInfo != undefined && resultInfo.length != 0) {
                // console.log("用户名已经存在");
                //当用户名存在做更新操作
                data.CustomerID = resultInfo[0].CustomerID;
                data.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');

                me.update(data, function(err, updataInfo) {
                    if (err) {
                        var errinfo = '关注的时候二次关注更新失败';
                        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                        // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                        logModel.OperationName = '添加微信的用户时二次更新';
                        logModel.Action = '添加微信的用户时的更新';
                        logModel.Memo = '更新失败';
                        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerUpd.identifier;
                        logModel.CreateUserID = 1;
                        logModel.Type = operationConfig.operationType.error;
                        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        logModel.PDate = moment().format('YYYY-MM-DD');
                        logService.insertOperationLog(logModel, function(err, insertID) {
                            if (err) {
                                logger.writeError('添加微信的用户时的二次更新失败，生成操作日志异常' + new Date());
                            }
                        });

                        logger.writeError("[service/jinkebro/customer/customerservice----------328行]添加微信用户时的更新出错");
                        return callback(true, errinfo);
                    }

                    if (updataInfo != undefined && updataInfo.affectedRows != 0) {
                        console.log("更新成功");

                        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                        // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                        logModel.OperationName = '添加微信的用户时二次更新';
                        logModel.Action = '添加微信的用户时的更新';
                        logModel.Memo = '更新成功';
                        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
                        logModel.CreateUserID = 0;
                        logModel.Type = operationConfig.operationType.operation;
                        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        logModel.PDate = moment().format('YYYY-MM-DD');
                        logService.insertOperationLog(logModel, function(err, insertID) {
                            if (err) {
                                logger.writeError('添加微信的用户时的二次更新失败，生成操作日志异常' + new Date());
                                return;
                            }
                        });

                        logger.writeInfo("[service/jinkebro/customer/customerservice------------352行]微信添加用户的时候更新成功");
                        return callback(false, '');
                    }
                });
            } else {
                //用户名不存在的时候做插入的操作
                me.insert(data, function(err, insertInfo) {
                    if (err) {
                        console.log("插入失败");
                        var errinfo = '当插入客户信息失败';
                        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                        // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                        logModel.OperationName = '添加微信的用户';
                        logModel.Action = '添加微信的用户时的插入';
                        logModel.Memo = '插入失败';
                        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
                        logModel.CreateUserID = 0;
                        logModel.Type = operationConfig.operationType.error;
                        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        logModel.PDate = moment().format('YYYY-MM-DD');
                        logService.insertOperationLog(logModel, function(err, insertID) {
                            if (err) {
                                logger.writeError('添加微信的用户时，生成操作日志异常' + new Date());
                                return;
                            }
                        });

                        logger.writeError("[service/jinkebro/customer/customerservice-----------379行]添加微信用户的时候插入失败");
                        return callback(true, errinfo);
                    }

                    if (insertInfo != undefined && insertInfo.affectedRows != 0) {
                        console.log("插入成功");

                        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                        // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                        logModel.OperationName = '添加微信的用户';
                        logModel.Action = '添加微信的用户时的插入';
                        logModel.Memo = '插入成功';
                        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
                        logModel.Type = operationConfig.operationType.operation;
                        logModel.CreateUserID = 0;
                        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        logModel.PDate = moment().format('YYYY-MM-DD');
                        logService.insertOperationLog(logModel, function(err, insertID) {
                            if (err) {
                                logger.writeError('添加微信的用户时，生成操作日志异常' + new Date());
                                return;
                            }
                        });

                        logger.writeInfo("[service/jinkebro/customer/customerservice-------------403行]添加微信用户的时候插入成功");
                        return callback(false, '');
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
                logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                logModel.OperationName = '微信用户的取消关注查询';
                logModel.Action = '微信用户取消关注的查询';
                logModel.Memo = '查询失败';
                logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerQuery.identifier;
                logModel.CreateUserID = 0;
                logModel.Type = operationConfig.operationType.error;
                logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                logModel.PDate = moment().format('YYYY-MM-DD');
                logService.insertOperationLog(logModel, function(err, insertID) {
                    if (err) {
                        logger.writeError('微信用户取消关注的查询失败，生成操作日志异常' + new Date());
                        return;
                    }
                });
                logger.writeInfo("[service/jinkebro/customer/customerservice-------------443行]" + errinfo);
                return callback(true, errinfo);
            }

            if (resultInfo != undefined && resultInfo.length != 0) {
                //当用户名存在做更新操作
                data.CustomerID = resultInfo[0].CustomerID;
                data.IsActive = 0;
                data.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');

                me.update(data, function(err, updataInfo) {
                    if (err) {
                        console.log("更新失败");
                        var errinfo = '用户取消关注公众号时更新失败';
                        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                        // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                        logModel.OperationName = '用户取消关注公众号时的关注更新';
                        logModel.Action = '用户取消关注的时候的更新';
                        logModel.Memo = '更新失败';
                        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerUpd.identifier;
                        logModel.CreateUserID = 0;
                        logModel.Type = operationConfig.operationType.error;
                        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        logModel.PDate = moment().format('YYYY-MM-DD');
                        logService.insertOperationLog(logModel, function(err, insertID) {
                            if (err) {
                                logger.writeError('微信用户取消关注时更新失败，生成操作日志异常' + new Date());
                                return;
                            }
                        });
                        logger.writeError("[service/jinkebro/customer/customerservice----------473行]" + errinfo);
                        return callback(true, errinfo);
                    }

                    if (updataInfo !== undefined && updataInfo.affectedRows > 0) {
                        console.log("更新成功");
                        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                        // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                        logModel.OperationName = '用户取消关注公众号时的关注更新';
                        logModel.Action = '用户取消关注的时候的更新';
                        logModel.Memo = '更新成功';
                        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerUpd.identifier;
                        logModel.CreateUserID = 0;
                        logModel.Type = operationConfig.operationType.operation;
                        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        logModel.PDate = moment().format('YYYY-MM-DD');
                        logService.insertOperationLog(logModel, function(err, insertID) {
                            if (err) {
                                logger.writeError('微信用户取消关注时更新失败，生成操作日志异常' + new Date());
                                return;
                            }
                        });
                        return callback(false, '');
                    }
                });
            }
        });
    });
}

//添加获取地址的模块
Customer.prototype.addLocation = function(msg, callback) {
    var me = this;
    //获取地址事件者的openid
    var locationData = {
        'WechatUserCode': msg.FromUserName,
        'Lon': msg.Longitude,
        'Lat': msg.Latitude,
        'UpdateTime': moment().format('YYYY-MM-DD HH:mm:ss')
    }

    var queryData = {
        'WechatUserCode': msg.FromUserName
    }
//这边日志异常----
    this.query(queryData, function(err, queryInfo) {
        if (err) {
            console.log("查询失败");
            var errinfo = '在获取地址的时候查询失败';
            logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
            // logModel.Application = operationConfig.jinkeBroApp.applicationName;
            logModel.OperationName = '在获取微信地址时的查询';
            logModel.Action = '在获取微信地址时的查询';
            logModel.Memo = '查询失败';
            logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerQuery.identifier;
            logModel.CreateUserID = 0;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logModel.Type = operationConfig.operationType.error;
            
            console.log('当前logmodel:' + JSON.stringify(logModel));

            logService.insertOperationLog(logModel, function(err, insertID) {
                if (err) {
                    logger.writeError('在获取微信地址时的查询，生成操作日志异常' + new Date() + '\n\r' + JSON.stringify(err));
                    return;
                }
            });

            return callback(true, errinfo);
        }

        if (queryInfo != undefined && queryInfo.length != 0) {
            locationData.CustomerID = queryInfo[0].CustomerID;

            me.update(locationData, function(err, updataInfo) {
                if (err) {
                    console.log("更新失败");
                    var errinfo = "获取地址时出错";
                    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                    // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                    logModel.OperationName = '在获取微信地址时的更新';
                    logModel.Action = '在获取微信地址时的更新';
                    logModel.Memo = '更新失败';
                    logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerUpd.identifier;
                    logModel.CreateUserID = 0;
                    logModel.Type = operationConfig.operationType.error;
                    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    logModel.PDate = moment().format('YYYY-MM-DD');
                    logService.insertOperationLog(logModel, function(err, insertID) {
                        if (err) {
                            logger.writeError('在获取微信地址时的查询，生成操作日志异常' + new Date() + '\n\r' + JSON.stringify(err));
                            return;
                        }
                    });

                    return callback(true, errinfo);
                }
                if (updataInfo != undefined && updataInfo.affectedRows != 0) {
                    logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                    // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                    logModel.OperationName = '在获取微信地址时的更新';
                    logModel.Action = '在获取微信地址时的更新';
                    logModel.Memo = '更新成功';
                    logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerUpd.identifier;
                    logModel.Type = operationConfig.operationType.operation;
                    logModel.CreateUserID = 0;
                    logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    logModel.PDate = moment().format('YYYY-MM-DD');
                    logService.insertOperationLog(logModel, function(err, insertID) {
                        if (err) {
                            logger.writeError('在获取微信地址时的查询，生成操作日志异常' + new Date() + '\n\r' + JSON.stringify(err));
                            return;
                        }
                    });

                    return callback(false);
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
        for (var key in infoList.data.openid) {
            arrOfOpenID.push(infoList.data.openid[key]);
        }

        for (var openid in arrOfOpenID) {
            me.addListFunction(token, {
                'WechatUserCode': arrOfOpenID[openid]
            }, function(err, result) {
                if (err) {
                    return callback(true, result);
                }
                return callback(false, result);
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
            logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
            // logModel.Application = operationConfig.jinkeBroApp.applicationName;
            logModel.OperationName = '添加微信客户端所有用户的时候的查询';
            logModel.Action = '添加微信客户端所有用户时的查询';
            logModel.Memo = '查询失败';
            logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerQuery.identifier;
            logModel.CreateUserID = 0;
            logModel.Type = operationConfig.operationType.error;
            logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            logModel.PDate = moment().format('YYYY-MM-DD');
            logService.insertOperationLog(logModel, function(err, insertID) {
                if (err) {
                    logger.writeError('添加微信客户端所有用户时的查询，生成操作日志异常' + new Date());
                    return;
                }
            });
            logger.writeError("[service/jinkebro/customer/customerservice-------------650行]" + errinfo);
            return callback(true, errinfo);
        }

        if (resultInfo !== undefined && resultInfo.length != 0) {
            errinfo = '当前用户已经存在';
            return callback(true, errinfo);
        } else {
            wechat.getCustomerInfo(token, data.WechatUserCode, function(info) {
                var insertData = {
                    'WechatUserCode': info.openid
                };
                //获取用户的信息
                insertData.Sex = info.sex;
                insertData.NickName = info.nickname;
                insertData.IsActive = 1;

                for (var key in info) {
                    if (info.key && info.key.length != 0) {
                        data.key = info.key;
                    }
                }

                me.insert(insertData, function(err, insertInfo) {

                    if (err) {
                        console.log("插入失败");
                        var errinfo = '当插入客户信息失败';
                        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                        // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                        logModel.OperationName = '添加微信客户端所有用户的时候的插入';
                        logModel.Action = '添加微信客户端所有用户时的插入';
                        logModel.Memo = '插入失败';
                        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
                        logModel.CreateUserID = 0;
                        logModel.Type = operationConfig.operationType.error;
                        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        logModel.PDate = moment().format('YYYY-MM-DD');
                        logService.insertOperationLog(logModel, function(err, insertID) {
                            if (err) {
                                logger.writeError('添加微信客户端所有用户时的插入，生成操作日志异常' + new Date());
                                return;
                            }
                        });
                        
                        return callback(true, errinfo);
                    }

                    if (insertInfo != undefined && insertInfo.affectedRows != 0) {
                        logModel.ApplicationID = operationConfig.jinkeBroApp.applicationID;
                        // logModel.Application = operationConfig.jinkeBroApp.applicationName;
                        logModel.OperationName = '添加微信客户端所有用户的时候的插入';
                        logModel.Action = '添加微信客户端所有用户时的插入';
                        logModel.Memo = '插入成功';
                        logModel.Identifier = operationConfig.jinkeBroApp.customerManage.customerAdd.identifier;
                        logModel.CreateUserID = 0;
                        logModel.Type = operationConfig.operationType.operation;
                        logModel.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        logModel.PDate = moment().format('YYYY-MM-DD');
                        logService.insertOperationLog(logModel, function(err, insertID) {
                            if (err) {
                                logger.writeError('添加微信客户端所有用户时的查询，生成操作日志异常' + new Date());
                                return;
                            }
                        });

                        return callback(false, '获取所有列表的填补成功');
                    }
                });
            });
        }
    });
}

module.exports = new Customer();