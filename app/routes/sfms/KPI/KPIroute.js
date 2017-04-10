/**
 * @Author: bitzo
 * @Date: 2016/12/2 16:25
 * @Last Modified by: bitzo
 * @Last Modified time: 2016/12/13 10:25
 * @Function: KPI 路由
 */

var express = require('express'),
    router = express.Router(),
    KPIservice = appRequire('service/sfms/KPI/KPIservice'),
    projectservice = appRequire('service/sfms/project/projectservice'),
    dataservice = appRequire('service/backend/datadictionary/datadictionaryservice'),
    projectuserservice = appRequire('service/sfms/project/projectuserservice'),
    userservice = appRequire('service/backend/user/userservice'),
    config = appRequire('config/config'),
    moment = require('moment'),
    logger = appRequire("util/loghelper").helper,
    functionConfig = appRequire('config/functionconfig'),
    nodeExcel = require('excel-export'),
    userFuncService = appRequire('service/backend/user/userfuncservice'),
    formidable=require('formidable'),
    fs = require('fs'),
    path = require('path');

//KPI证明材料接收
router.post('/file', function (req, res) {
    // parse a file upload
    var form = new formidable.IncomingForm(),files=[],fields=[],docs=[];
    console.log('start upload');
    var ID = 0,
        fileID = 0,
        baseID = -1;
    //存放目录
    form.uploadDir = 'public/imgs/KPIMaterial';
    // var isDelete = 0;

    var fileUrl = 'public/imgs/KPIMaterial';

        form.on('field', function(field, value) {
            // console.log(field, value);
            // fields.push([field, value]);
            if(field == 'ID') ID = value;
            else fileID = value;

        }).on('file', function(field, file) {
            // console.log(field, file);
            files.push([field, file]);
            docs.push(file);

            var types = file.name.split('.')[file.name.split('.').length-1];
            var date = moment().format("YYYYMMDD");
            fs.readdir(fileUrl,function(err,files) {
                if (err) {
                    console.log('file dir error');
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '错误'
                    })
                }

                // console.log('=======' + ID)
                for (var i in files) {
                    if (ID === files[i].split('_')[1]) {
                        // console.log(files[i].split('_')[2].split('.')[0])
                        if (baseID < files[i].split('_')[2].split('.')[0]) {
                            baseID = files[i].split('_')[2].split('.')[0];
                        }
                    }
                }
                // console.log('======= ' + baseID)
                if(baseID != -1){
                    fileID =parseInt(fileID) + parseInt(baseID) + 1;
                }
                // console.log('fileID: ' + fileID)
                fs.renameSync(file.path, "public/imgs/KPIMaterial/KPIMaterial" + date + '_'+ ID + '_' + fileID + '.' + types);
            });
        }).on('end', function() {
            res.writeHead(200, {
                'content-type': 'text/plain'
            });
            var out={
                Resopnse:{
                    'result-code':0,
                    timeStamp:new Date(),
                },
                files:docs
            };
            var sout=JSON.stringify(out);
            res.end(sout);
        });

        form.parse(req, function(err, fields, files) {
            err && console.log('formidabel error : ' + err);

            // console.log('parsing done');
        });
});

//KPI证明材料查询
router.get('/file', function (req, res) {
    var ID = req.query.ID,
        userID = req.query.jitkey;

    if(!ID || isNaN(ID)){
        res.status(400);

        return res.json({
            code: 400,
            isSuccess: false,
            msg: '查询失败,ID不合法'
        });
    }
    var fileUrl = 'public/imgs/KPIMaterial';
    fs.readdir(fileUrl,function(err,files){
        if(err){
            console.log('file dir error');
            return res.json({
                code: 200,
                isSuccess: true,
                data: {},
                msg:'未查询到结果'
            })
        }

        var count = files.length;
        // console.log(files)
        var filesArr = [];
        // console.log('ID: ' + ID)
        for(var i in files){
            // console.log(files[i].split('_')[1])
            if(ID === files[i].split('_')[1]) {
                var size = fs.statSync(path.join(fileUrl,files[i])).size;
                // console.log(size);
                filesArr.push({
                    'fileName': files[i],
                    'fileUrl': path.join('imgs/KPIMaterial',files[i]),
                    'size': size
                })
            }
        }
        return res.json({
            code: 200,
            isSuccess: true,
            data: filesArr,
            msg:'查询成功'
        })
    });
});


//KPI证明材料删除
router.delete('/file', function (req, res) {
    var fileName = req.query.fileName,
        userID = req.query.jitkey;

    console.log(req.body)
    if(!fileName){
        res.status(400);

        return res.json({
            code: 400,
            isSuccess: false,
            msg: '查询失败,文件不合法'
        });
    }
    var fileUrl = 'public/imgs/KPIMaterial';
    if(fs.existsSync(path.join(fileUrl, fileName))){
        fs.unlink(path.join(fileUrl, fileName), function (err) {
            if(err){
                console.log(err)
            }
            return res.json({
                code: 200,
                isSuccess: true,
                msg:'操作成功'
            })
        })
    }else{
        return res.json({
            code: 200,
            isSuccess: true,
            msg:'操作成功'
        })
    }
});

/**
 * KPI信息新增：
 *  所需要做的步骤
 *  1、验证绩效分用户userID是否属于项目projectID
 *  2、查询KPIName, KPIType是否在字典表里
 *  3、查询当前申请的projectID内是否已经有KPIType类型的绩效
 *  4、获取userID的用户名UserName
 *  5、数据获取并验证完毕后再存入KPI数据
 */
router.post('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPIAdd.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        var query = req.body.formdata,
            ProjectID = query.ProjectID,
            KPIType = query.KPIType,//字典表的ID
            KPIScore = query.KPIScore,
            OperateUser = req.query.jitkey,
            UserID = query.UserID || req.query.jitkey,
            KPIName = query.KPIName,
            Remark = query.Remark || '';

        //检查所需要的参数是否齐全
        var temp = ['KPIName', 'KPIType', 'KPIScore', 'ProjectID'],
            temp1 = ['绩效名称', '绩效类型', '绩效分', '所属项目'];

        err = '缺少值: ';

        for(var value in temp)
        {
            if(!(temp[value] in query))
            {
                logger.writeInfo("缺少值 " + temp[value]);
                err += temp1[value] + ' ';
            }
        }

        if(err!='缺少值: ')
        {
            res.status(400);

            return res.json({
                status: 400,
                isSuccess: false,
                msg: err
            });
        }

        projectuserservice.judgeUserProject({userID:UserID,projectID:ProjectID,operateUserID:req.query.jitkey},function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            if (!results.isSuccess) {
                res.status(400);

                return res.json({
                    status: 404,
                    isSuccess: false,
                    msg: '操作失败，用户不在所在的项目中'
                });
            }
            console.log(results.isProjectManger + ' : '+ KPIType)
            if(results.isProjectManger && KPIType == 16){
                res.status(400);

                return res.json({
                    status: 404,
                    isSuccess: false,
                    msg: '操作失败，项目组长请勿申请组员绩效！'
                });
            }
            if(!results.isProjectManger && KPIType == 10){
                res.status(400);

                return res.json({
                    status: 404,
                    isSuccess: false,
                    msg: '操作失败，您不是该项目的项目组长！'
                });
            }
            //查询KPIName, KPIType是否在字典表里
            var DicID = {
                'DictionaryID': [KPIType]
            };

            dataservice.queryDatadictionaryByID(DicID, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                }

                if (!(results !== undefined && results.length == DicID.DictionaryID.length)) {
                    res.status(400);

                    return res.json({
                        status: 404,
                        isSuccess: false,
                        msg: '操作失败，该绩效类型或名称无效'
                    });
                }

                //查询当前申请的projectID内是否已经有KPIType类型的绩效
                query = {
                    'ProjectID': ProjectID,
                    'KPIType': KPIType,
                    'UserID': UserID,
                    'OperateUserID': req.query.jitkey,
                    'IsActive': 1
                };

                KPIservice.queryKPI(query, function (err, results) {
                    if (err) {
                        res.status(500);

                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        });
                    }

                    if (!(results !== undefined && results.length == 0)) {
                        res.status(400);

                        return res.json({
                            status: 400,
                            isSuccess: false,
                            msg: '操作失败，当前项目，该用户已申请过此类型的绩效，不可重复申请'
                        });
                    }

                    //获取userID的用户名UserName
                    userservice.querySingleID(UserID, function (err, results) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            });
                        }

                        if (results !== undefined && results.length > 0) {
                            var UserName = results[0].UserName;
                            //数据获取并验证完毕后再存入KPI数据
                            data = {
                                'KPIName': KPIName,
                                'KPIType': KPIType,
                                'KPIScore': KPIScore,
                                'ProjectId': ProjectID,
                                'UserID': UserID,
                                'UserName': UserName,
                                'OperateUser': OperateUser,
                                'OperateUserID': req.query.jitkey,
                                'KPIStatus': '待审核',
                                'Remark': Remark,
                                'IsActive': 1
                            };

                            if (data.KPIName.length>45) {
                                res.status(400);

                                return res.json({
                                    code: 400,
                                    isSuccess: false,
                                    msg: '绩效名称过长,请勿超过45个字符'
                                });
                            }

                            if (isNaN(data.KPIScore)||data.KPIScore<0) {
                                res.status(400);

                                return res.json({
                                    code: 400,
                                    isSuccess: false,
                                    msg: '绩效分不是正确的数值'
                                });
                            }

                            if (data.Remark.length>45) {
                                res.status(400);

                                return res.json({
                                    code: 400,
                                    isSuccess: false,
                                    msg: '备注过长,请勿超过45个字符'
                                });
                            }

                            KPIservice.addKPI(data, function (err, results) {
                                if (err) {
                                    res.status(500);

                                    return res.json({
                                        status: 500,
                                        isSuccess: false,
                                        msg: '操作失败，服务器出错'
                                    });
                                }

                                if(results !== undefined && results.insertId > 0) {
                                    res.status(200);

                                    return res.json({
                                        status: 200,
                                        isSuccess: true,
                                        msg: '操作成功'
                                    });
                                } else {
                                    res.status(400);

                                    return res.json({
                                        status: 404,
                                        isSuccess: false,
                                        msg: results
                                    });
                                }
                            });
                        } else {
                            res.status(400);

                            return res.json({
                                status: 404,
                                isSuccess: false,
                                msg: '操作失败，用户有误！'
                            });
                        }
                    });
                });
            });
        });
    });
});

//绩效启用
router.put('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPIEdit.functionCode
    };

    userFuncService.checkUserFunc(data, function (err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        data = req.body.formdata;
        data.OperateUserID = req.query.jitkey;

        KPIservice.updateKPI(data, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            if(results !== undefined && results.affectedRows > 0) {
                res.status(200);

                return res.json({
                    status: 200,
                    isSuccess: true,
                    msg: '操作成功'
                });
            } else {
                res.status(400);

                return res.json({
                    status: 404,
                    isSuccess: false,
                    msg: results
                });
            }
        });
    });
});

//KPI基本信息编辑
router.put('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPIEdit.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        var query = req.body.formdata,
            ID = query.ID,
            KPIName = query.KPIName,
            KPIType = query.KPIType,
            KPIScore = query.KPIScore,
            ProjectID = query.ProjectID,
            UserID = query.UserID,
            UserName = query.UserName,
            OperateUser = req.query.jitkey,
            Remark = query.Remark || '';

        data ={
            'ID': ID,
            'KPIName': KPIName,
            'KPIType': KPIType,
            'KPIScore': KPIScore,
            'ProjectId': ProjectID,
            'UserID': UserID,
            'UserName': UserName,
            'OperateUser': OperateUser,
            'OperateUserID': req.query.jitkey,
            'KPIStatus': '待审核',
            'Remark': Remark,
            'IsActive': 1
        };

        if (data.KPIName.length>45) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: '绩效名称过长,请勿超过45个字符'
            });
        }

        if (isNaN(data.KPIScore)||data.KPIScore<0) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: '绩效分不是正确的数值'
            });
        }

        if (data.Remark.length>45) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: '备注过长,请勿超过45个字符'
            });
        }

        //检查所需要的参数是否齐全
        var temp = ['ID', 'KPIName', 'KPIType', 'KPIScore', 'ProjectID', 'UserID'],
            temp1 = ['绩效ID', '绩效名称', '绩效类型', '绩效分', '所属项目', '用户名'];

        err = '缺少值: ';

        for(var value in temp)
        {
            if(!(temp[value] in query))
            {
                logger.writeInfo("缺少值 " + temp[value]);
                err += temp1[value] + ' ';
            }
        }

        if(err!='缺少值: ')
        {
            res.status(400);

            return res.json({
                status: 400,
                isSuccess: false,
                msg: err
            });
        }

        KPIservice.queryKPI({'ID':ID, 'OperateUserID': req.query.jitkey}, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            if(!(results !== undefined && results.length>0 && results[0].IsActive === 1)) {
                res.status(400);

                return res.json({
                    status: 404,
                    isSuccess: false,
                    msg: '绩效记录无效或不存在'
                })
            }

            if (results[0].KPIStatus != '待审核') {
                res.status(400);

                return res.json({
                    status: 404,
                    isSuccess: false,
                    msg: '操作失败，已审核的绩效不可编辑'
                });
            }

            projectuserservice.judgeUserProject({userID:UserID,projectID:ProjectID,operateUserID:req.query.jitkey},function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                }

                if (!results.isSuccess) {
                    res.status(400);

                    return res.json({
                        status: 404,
                        isSuccess: false,
                        msg: '操作失败，用户不在所在的项目中'
                    });
                }

                //查询KPIType是否在字典表里
                var DicID = {
                    'DictionaryID': [KPIType]
                };

                dataservice.queryDatadictionaryByID(DicID, function (err, results) {
                    if (err) {
                        res.status(500);

                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        });
                    }

                    if (results !== undefined && results.length == DicID.DictionaryID.length) {
                        // KPIType = results[0].DictionaryValue;
                        KPIservice.updateKPI(data, function (err, results) {
                            if (err) {
                                res.status(500);

                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '操作失败，服务器出错'
                                });
                            }

                            if(results !== undefined && results.affectedRows > 0) {
                                res.status(200);

                                return res.json({
                                    status: 200,
                                    isSuccess: true,
                                    msg: '操作成功'
                                });
                            } else {
                                res.status(400);

                                return res.json({
                                    status: 404,
                                    isSuccess: false,
                                    msg: results
                                });
                            }
                        });
                    } else {
                        res.status(400);

                        return res.json({
                            status: 400,
                            isSuccess: false,
                            msg: '操作失败，绩效类型有误！'
                        });
                    }
                });
            });
        });
    });
});

//绩效统计导出excel
router.get('/excel', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPICount.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            return res.send('数据异常');
        }

        if (!(results !== undefined && results.isSuccess)) {
            return res.send(result.msg);

        }

        var query = req.query,
            startTime = query.startTime || '',
            endTime = query.endTime || '',
            isActive = query.isActive || '';

        if (startTime) startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');

        if (endTime) endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');

        var filename = moment().format('YYYYMMDDHHmmss').toString();

        var data = {
            'startTime': startTime,
            'endTime': endTime,
            'OperateUserID': req.query.jitkey
        };

        userservice.countUser({isActive: isActive}, function (err, results) {
            if (err) {
                return res.send("数据异常");
            }

            if (results === undefined || results.length<=0) {
                return res.send("数据异常");
            }

            var totalNum = results[0].num;

            userservice.queryAllUsers({IsPage: 1, isActive: isActive}, function (err, results) {
                if (err) {
                    return res.send("数据异常");
                }

                if (results===undefined || results.length!=totalNum) {
                    return res.send("数据异常");
                }

                var ID = [], userInfo = [];

                for (var i in results) {
                    ID[i] = results[i].AccountID;
                    userInfo[i] = {
                        'userID': results[i].AccountID,
                        'userName': results[i].UserName,
                        'college': results[i].College,
                        'class': results[i].Class,
                        'kpiScore': 0,
                        'isActive': results[i].IsActive ? '是':'否'
                    }
                }

                data.userID = ID;

                KPIservice.countKPI(data, function (err, results) {
                    if (err) {
                        return res.send("数据异常");
                    }

                    if (results!==undefined&&results.length>0) {
                        for (var i in results) {
                            for (var j in userInfo) {
                                if (userInfo[j].userID == results[i].UserId) {
                                    userInfo[j].kpiScore = results[i].sum;
                                    break;
                                }
                            }
                        }

                    }

                    var conf ={};

                    conf.cols = [{
                        caption:'序号',
                        type:'string',
                    },{
                        caption:'帐号',
                        type:'string',
                    },{
                        caption:'用户名',
                        type:'string'
                    },{
                        caption:'学院',
                        type:'string'
                    },{
                        caption:'班级',
                        type:'string'
                    },{
                        caption:'绩效分',
                        type:'number'
                    },{
                        caption:'有效用户',
                        type:'string'
                    }];

                    conf.rows = [];

                    for(var i=0;i<userInfo.length;++i) {
                        conf.rows.push([(i+1).toString(), userInfo[i].userID.toString(), userInfo[i].userName, userInfo[i].college,
                            userInfo[i].class, userInfo[i].kpiScore, userInfo[i].isActive]);
                    }

                    var result = nodeExcel.execute(conf);

                    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                    res.setHeader("Content-Disposition", "attachment; filename="+filename+".xlsx");

                    return res.end(result, 'binary');
                });
            });
        });
    });
});

//绩效统计
router.get('/count', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPICount.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }
        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }
        var query = JSON.parse(req.query.f),
            startTime = query.startTime || '',
            endTime = query.endTime || '',
            page = req.query.pageindex || 1,
            pagesize = req.query.pagesize || config.pageCount;

        page = page > 0 ? page : 1;

        if (startTime != '') startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');

        if (endTime != '') endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');

        var data = {
            'startTime': startTime,
            'endTime': endTime,
            'OperateUserID': req.query.jitkey
        };

        userservice.countUser({isActive: 1}, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            if (results!==undefined&&results.length>0) {
                var totalNum = results[0].num;

                userservice.queryAllUsers({page: page, pageNum: pagesize, IsPage: 0, isActive: 1}, function (err, results) {
                    if (err) {
                        res.status(500);

                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        });
                    }
                    if (results !== undefined && results.length > 0) {
                        var ID = [], userInfo = [];

                        for (var i in results) {
                            ID[i] = results[i].AccountID;
                            userInfo[i] = {
                                'userID': results[i].AccountID,
                                'userName': results[i].UserName,
                                'college': results[i].College,
                                'class': results[i].Class,
                                'kpiScore': 0
                            }
                        }

                        data.userID = ID;

                        KPIservice.countKPI(data, function (err, results) {
                            if (err) {
                                res.status(500);
                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '操作失败，服务器出错'
                                });
                            }

                            if (results!==undefined&&results.length>0) {
                                for (var i in results) {
                                    for (var j in userInfo) {
                                        if (userInfo[j].userID == results[i].UserId) {
                                            userInfo[j].kpiScore = results[i].sum;
                                            break;
                                        }
                                    }
                                }

                                var temp = {
                                    status: 200,
                                    isSuccess: true,
                                    dataNum: totalNum,
                                    curPage: page,
                                    totalPage: Math.ceil(totalNum/pagesize),
                                    curPageNum: pagesize,
                                    data: userInfo
                                };

                                if(temp.curPage == temp.totalPage) {
                                    temp.curPageNum = temp.dataNum - (temp.totalPage-1)*pagesize;
                                }

                                res.status(200);

                                return res.json(temp);
                            } else {
                                var temp = {
                                    status: 200,
                                    isSuccess: true,
                                    dataNum: totalNum,
                                    curPage: page,
                                    totalPage: Math.ceil(totalNum/pagesize),
                                    curPageNum: pagesize,
                                    data: userInfo
                                };

                                if(temp.curPage == temp.totalPage) {
                                    temp.curPageNum = temp.dataNum - (temp.totalPage-1)*pagesize;
                                }

                                res.status(200);
                                return res.json(temp)
                            }
                        });
                    } else {
                        res.status(200);

                        return res.json({
                            status: 200,
                            isSuccess: true,
                            msg: '暂无数据'
                        });
                    }
                });
            } else {
                res.status(200);

                return res.json({
                    status: 200,
                    isSuccess: true,
                    msg: '暂无数据'
                });
            }
        });
    });
});

//KPI查询，用于个人查询
router.get('/person', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPIQuery.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        var UserID = req.query.jitkey,
            query =  JSON.parse(req.query.f),
            ID = query.ID,
            ProjectID = query.ProjectID || '',
            StartTime = query.StartTime || '',
            EndTime = query.EndTime || '',
            KPIStatus = query.KPIStatus || '',
            KPIType = query.KPIType || '',
            IsActive = query.IsActive || '',
            page = req.query.pageindex > 0 ? req.query.pageindex : 1,
            pageNum = req.query.pagesize || config.pageCount,
            totalNum = 0;

        data = {
            'ID': ID,
            'ProjectID': ProjectID,
            'UserID': UserID,
            'OperateUserID': req.query.jitkey,
            'KPIStatus': KPIStatus.trim(),
            'KPIType': KPIType,
            'StartTime': StartTime,
            'EndTime': EndTime,
            'IsActive': IsActive,
            'page': page,
            'pageNum': pageNum,
        };

        KPIservice.countQuery(data, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            totalNum = results[0].num;

            if(totalNum <= 0) {
                res.status(200);

                return res.json({
                    status: 200,
                    isSuccess: false,
                    msg: '无数据'
                });
            }

            //查询所需的详细数据
            KPIservice.queryKPI(data, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                }

                if (!(results !== undefined && results.length > 0)) {
                    res.status(200);

                    return res.json({
                        status: 200,
                        isSuccess: false,
                        msg: '无数据'
                    });
                }

                for (var i in results) {
                    results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD');
                    if(results[i].CheckTime !== null)
                        results[i].CheckTime = moment(results[i].CheckTime).format('YYYY-MM-DD HH:mm');
                }

                var result = {
                    status: 200,
                    isSuccess: true,
                    dataNum: totalNum,
                    curPage: page,
                    totalPage: Math.ceil(totalNum/pageNum),
                    curPageNum: pageNum,
                    data: results
                };

                if(result.curPage == result.totalPage) {
                    result.curPageNum = result.dataNum - (result.totalPage-1)*pageNum;
                }

                //替换用户名
                var ID = [],DicID = [];

                for (var i=0;i<results.length;++i) {
                    if (results[i].CheckUser == null) continue;

                    if (i==0) {
                        ID[i] = results[i].CheckUser;
                    } else {
                        var j = 0;

                        for (j=0;j<ID.length;++j) {
                            if (ID[j] == results[i].CheckUser) break;
                        }
                        if (j == ID.length) ID[j] = results[i].CheckUser;
                    }
                }

                for (var i=0;i<results.length;++i) {
                    if (i==0) {
                        DicID[i] = results[i].KPIType;
                    } else {
                        var k=0;

                        for (k=0;k<DicID.length;++k) {
                            if (DicID[k] == results[i].KPIType) break;
                        }

                        if (k == DicID.length) DicID[k] = results[i].KPIType;
                    }
                }

                userservice.queryAccountByID(ID, function (err, data) {
                    if (err) {
                        res.status(500);

                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        });
                    }

                    for (var i in results) {
                        for (var j in data) {
                            if (results[i].CheckUser == data[j].AccountID) {
                                results[i].CheckUser = data[j].UserName;
                                break;
                            }
                        }
                    }

                    //查询字典表 更新所有字典表数据
                    dataservice.queryDatadictionaryByID({"DictionaryID":DicID}, function (err, data) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            });
                        }

                        if (data!==undefined && data.length>0) {
                            for (var i in results) {
                                var j=0;
                                for (j=0;j<data.length;++j) {
                                    if (results[i].KPIType == data[j].DictionaryID) results[i].KPITypeValue = data[j].DictionaryValue;
                                }
                            }

                            res.status(200);

                            return res.json(result);
                        } else {
                            res.status(200);

                            return res.json({
                                status: 200,
                                isSuccess: false,
                                msg: '无数据'
                            });
                        }
                    });
                });
            });
        });
    });
});

//KPI查询,此查询用于可审核绩效的角色进行查询
router.get('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPIQuery.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        var query =  JSON.parse(req.query.f),
            ID = query.ID || '',
            UserID = query.UserID || '',
            ProjectID = query.ProjectID || '',
            StartTime = query.StartTime || '',
            EndTime = query.EndTime || '',
            KPIStatus = query.KPIStatus || '',
            KPIType =  query.KPIType || '',
            KPIName = query.KPIName || '',
            IsActive = query.IsActive || '',
            page = req.query.pageindex > 0 ? req.query.pageindex : 1,
            pageNum = req.query.pagesize || config.pageCount,
            totalNum = 0;

        data = {
            'ID': ID,
            'ProjectID': ProjectID,
            'UserID': UserID,
            'KPIStatus': KPIStatus.trim(),
            'KPIType': KPIType,
            'KPIName': KPIName,
            'StartTime': StartTime,
            'EndTime': EndTime,
            'OperateUserID': req.query.jitkey,
            'page': page,
            'pageNum': pageNum,
            'IsActive': IsActive
        };

        KPIservice.countQuery(data, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }
            totalNum = results[0].num;

            if(totalNum <= 0) {
                res.status(200);

                return res.json({
                    status: 200,
                    isSuccess: false,
                    msg: '无数据'
                });
            }
            //查询所需的详细数据
            KPIservice.queryKPI(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                }

                if (!(results !== undefined && results.length > 0)) {
                    res.status(200);

                    return res.json({
                        status: 200,
                        isSuccess: false,
                        msg: '无数据'
                    });
                }

                for (var i in results) {
                    results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD HH:mm');
                    if(results[i].CheckTime !== null)
                        results[i].CheckTime = moment(results[i].CheckTime).format('YYYY-MM-DD HH:mm');
                }

                var result = {
                    status: 200,
                    isSuccess: true,
                    dataNum: totalNum,
                    curPage: page,
                    totalPage: Math.ceil(totalNum/pageNum),
                    curPageNum: pageNum,
                    data: results
                };

                if(result.curPage == result.totalPage) {
                    result.curPageNum = result.dataNum - (result.totalPage-1)*pageNum;
                }

                //替换用户名
                var ID = [],DicID = [];

                for (var i=0;i<results.length;++i) {
                    if (results[i].CheckUser == null) continue;

                    if (i==0) {
                        ID[i] = results[i].CheckUser;
                    } else {
                        var j = 0;
                        for (j=0;j<ID.length;++j) {
                            if (ID[j] == results[i].CheckUser) break;
                        }
                        if (j == ID.length) ID[j] = results[i].CheckUser;
                    }
                }

                for (var i=0;i<results.length;++i) {
                    if (i==0) {
                        DicID[i] = results[i].KPIType;
                    } else {
                        var k=0;

                        for (k=0;k<DicID.length;++k) {
                            if (DicID[k] == results[i].KPIType) break;
                        }
                        if (k == DicID.length) DicID[k] = results[i].KPIType;
                    }
                }

                userservice.queryAccountByID(ID, function (err, data) {
                    if (err) {
                        res.status(500);

                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        });
                    }

                    for (var i in results) {
                        for (var j in data) {
                            if (results[i].CheckUser == data[j].AccountID) {
                                results[i].CheckUser = data[j].UserName;
                                break;
                            }
                        }
                    }

                    //查询字典表 更新所有字典表数据
                    dataservice.queryDatadictionaryByID({"DictionaryID":DicID}, function (err, data) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            });
                        }

                        if (data!==undefined && data.length>0) {
                            for (var i in results) {
                                var j=0;

                                for (j=0;j<data.length;++j) {
                                    if (results[i].KPIType == data[j].DictionaryID) results[i].KPITypeValue = data[j].DictionaryValue;
                                }
                            }
                            ID = query.ID || '';
                            console.log(ID)
                            if(ID === ''){
                                res.status(200);

                                return res.json(result);
                            }
                            console.log('files')
                            var fileUrl = 'public/imgs/KPIMaterial';
                            fs.readdir(fileUrl,function(err,files){
                                if(err){
                                    console.log('file dir error');
                                    return res.json({
                                        code: 200,
                                        isSuccess: true,
                                        data: {},
                                        msg:'未查询到结果'
                                    })
                                }

                                var count = files.length;
                                // console.log(files)
                                var filesArr = [];
                                // console.log('ID: ' + ID)
                                for(var i in files){
                                    // console.log(files[i].split('_')[1])
                                    if(ID === files[i].split('_')[1]) {
                                        var size = fs.statSync(path.join(fileUrl,files[i])).size;
                                        // console.log(size);
                                        filesArr.push({
                                            'fileName': files[i],
                                            'fileUrl': path.join('imgs/KPIMaterial',files[i]),
                                            'size': size
                                        })
                                    }
                                }
                                result.data[0].files = filesArr;

                                res.status(200);

                                return res.json(result);
                            });
                        } else {
                            res.status(200);

                            return res.json({
                                status: 200,
                                isSuccess: false,
                                msg: '无数据'
                            });
                        }
                    })
                });

            });

        });
    });
});

//KPI查询,此查询用于可审核绩效的角色进行查询
router.get('/manage', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPIQuery.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        var query =  JSON.parse(req.query.f),
            ID = query.ID || '',
            UserID = query.UserID || '',
            ProjectID = query.ProjectID || '',
            StartTime = query.StartTime || '',
            EndTime = query.EndTime || '',
            KPIStatus = query.KPIStatus || '',
            KPIType =  10,
            KPIName = query.KPIName || '',
            IsActive = query.IsActive || '',
            page = req.query.pageindex > 0 ? req.query.pageindex : 1,
            pageNum = req.query.pagesize || config.pageCount,
            totalNum = 0;

        data = {
            'ID': ID,
            'ProjectID': ProjectID,
            'UserID': UserID,
            'KPIStatus': KPIStatus.trim(),
            'KPIType': KPIType,
            'KPIName': KPIName,
            'StartTime': StartTime,
            'EndTime': EndTime,
            'OperateUserID': req.query.jitkey,
            'page': page,
            'pageNum': pageNum,
            'IsActive': IsActive
        };

        KPIservice.countQuery(data, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }
            totalNum = results[0].num;

            if(totalNum <= 0) {
                res.status(200);

                return res.json({
                    status: 200,
                    isSuccess: false,
                    msg: '无数据'
                });
            }
            //查询所需的详细数据
            KPIservice.queryKPI(data, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                }

                if (!(results !== undefined && results.length > 0)) {
                    res.status(200);

                    return res.json({
                        status: 200,
                        isSuccess: false,
                        msg: '无数据'
                    });
                }

                for (var i in results) {
                    results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD HH:mm');
                    if(results[i].CheckTime !== null)
                        results[i].CheckTime = moment(results[i].CheckTime).format('YYYY-MM-DD HH:mm');
                }

                var result = {
                    status: 200,
                    isSuccess: true,
                    dataNum: totalNum,
                    curPage: page,
                    totalPage: Math.ceil(totalNum/pageNum),
                    curPageNum: pageNum,
                    data: results
                };

                if(result.curPage == result.totalPage) {
                    result.curPageNum = result.dataNum - (result.totalPage-1)*pageNum;
                }

                //替换用户名
                var ID = [],DicID = [];

                for (var i=0;i<results.length;++i) {
                    if (results[i].CheckUser == null) continue;

                    if (i==0) {
                        ID[i] = results[i].CheckUser;
                    } else {
                        var j = 0;
                        for (j=0;j<ID.length;++j) {
                            if (ID[j] == results[i].CheckUser) break;
                        }
                        if (j == ID.length) ID[j] = results[i].CheckUser;
                    }
                }

                for (var i=0;i<results.length;++i) {
                    if (i==0) {
                        DicID[i] = results[i].KPIType;
                    } else {
                        var k=0;

                        for (k=0;k<DicID.length;++k) {
                            if (DicID[k] == results[i].KPIType) break;
                        }
                        if (k == DicID.length) DicID[k] = results[i].KPIType;
                    }
                }

                userservice.queryAccountByID(ID, function (err, data) {
                    if (err) {
                        res.status(500);

                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        });
                    }

                    for (var i in results) {
                        for (var j in data) {
                            if (results[i].CheckUser == data[j].AccountID) {
                                results[i].CheckUser = data[j].UserName;
                                break;
                            }
                        }
                    }

                    //查询字典表 更新所有字典表数据
                    dataservice.queryDatadictionaryByID({"DictionaryID":DicID}, function (err, data) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            });
                        }

                        if (data!==undefined && data.length>0) {
                            for (var i in results) {
                                var j=0;

                                for (j=0;j<data.length;++j) {
                                    if (results[i].KPIType == data[j].DictionaryID) results[i].KPITypeValue = data[j].DictionaryValue;
                                }
                            }
                            res.status(200);

                            return res.json(result);
                        } else {
                            res.status(200);

                            return res.json({
                                status: 200,
                                isSuccess: false,
                                msg: '无数据'
                            });
                        }
                    })
                });
            });
        });
    });
});

//KPI查询,此查询用于可审核绩效的角色进行查询
router.get('/lead', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPIQuery.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        var query =  JSON.parse(req.query.f),
            ID = query.ID || '',
            UserID = query.UserID || '',
            ProjectID = query.ProjectID || '',
            StartTime = query.StartTime || '',
            EndTime = query.EndTime || '',
            KPIStatus = query.KPIStatus || '',
            KPIType =  16,
            KPIName = query.KPIName || '',
            IsActive = query.IsActive || '',
            page = req.query.pageindex > 0 ? req.query.pageindex : 1,
            pageNum = req.query.pagesize || config.pageCount,
            totalNum = 0;

        data = {
            'ID': ID,
            'ProjectID': ProjectID,
            'UserID': UserID,
            'KPIStatus': KPIStatus.trim(),
            'KPIType': KPIType,
            'KPIName': KPIName,
            'StartTime': StartTime,
            'EndTime': EndTime,
            'OperateUserID': req.query.jitkey,
            'page': page,
            'pageNum': pageNum,
            'IsActive': IsActive
        };

        projectservice.queryProject({ProjectManageID:req.query.jitkey,
            OperateUserID: req.query.jitkey, IsActive: 1, SelectType:1}, function(err, results){
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }
            if(results.length == 0){
                res.status(200);

                return res.json({
                    status: 200,
                    isSuccess: false,
                    msg: '无数据'
                });
            }
            data.ProjectID = [];
            for(var i in results){
                data.ProjectID.push(results[i].ID);
            }
            KPIservice.countQuery(data, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        status: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                }
                totalNum = results[0].num;

                if(totalNum <= 0) {
                    res.status(200);

                    return res.json({
                        status: 200,
                        isSuccess: false,
                        msg: '无数据'
                    });
                }
                //查询所需的详细数据
                KPIservice.queryKPI(data, function (err, results) {
                    if (err) {
                        res.status(500);
                        return res.json({
                            status: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        });
                    }

                    if (!(results !== undefined && results.length > 0)) {
                        res.status(200);

                        return res.json({
                            status: 200,
                            isSuccess: false,
                            msg: '无数据'
                        });
                    }

                    for (var i in results) {
                        results[i].CreateTime = moment(results[i].CreateTime).format('YYYY-MM-DD HH:mm');
                        if(results[i].CheckTime !== null)
                            results[i].CheckTime = moment(results[i].CheckTime).format('YYYY-MM-DD HH:mm');
                    }

                    var result = {
                        status: 200,
                        isSuccess: true,
                        dataNum: totalNum,
                        curPage: page,
                        totalPage: Math.ceil(totalNum/pageNum),
                        curPageNum: pageNum,
                        data: results
                    };

                    if(result.curPage == result.totalPage) {
                        result.curPageNum = result.dataNum - (result.totalPage-1)*pageNum;
                    }

                    //替换用户名
                    var ID = [],DicID = [];

                    for (var i=0;i<results.length;++i) {
                        if (results[i].CheckUser == null) continue;

                        if (i==0) {
                            ID[i] = results[i].CheckUser;
                        } else {
                            var j = 0;
                            for (j=0;j<ID.length;++j) {
                                if (ID[j] == results[i].CheckUser) break;
                            }
                            if (j == ID.length) ID[j] = results[i].CheckUser;
                        }
                    }

                    for (var i=0;i<results.length;++i) {
                        if (i==0) {
                            DicID[i] = results[i].KPIType;
                        } else {
                            var k=0;

                            for (k=0;k<DicID.length;++k) {
                                if (DicID[k] == results[i].KPIType) break;
                            }
                            if (k == DicID.length) DicID[k] = results[i].KPIType;
                        }
                    }

                    userservice.queryAccountByID(ID, function (err, data) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            });
                        }

                        for (var i in results) {
                            for (var j in data) {
                                if (results[i].CheckUser == data[j].AccountID) {
                                    results[i].CheckUser = data[j].UserName;
                                    break;
                                }
                            }
                        }

                        //查询字典表 更新所有字典表数据
                        dataservice.queryDatadictionaryByID({"DictionaryID":DicID}, function (err, data) {
                            if (err) {
                                res.status(500);

                                return res.json({
                                    status: 500,
                                    isSuccess: false,
                                    msg: '操作失败，服务器出错'
                                });
                            }

                            if (data!==undefined && data.length>0) {
                                for (var i in results) {
                                    var j=0;

                                    for (j=0;j<data.length;++j) {
                                        if (results[i].KPIType == data[j].DictionaryID) results[i].KPITypeValue = data[j].DictionaryValue;
                                    }
                                }
                                for (var i=0;i<result.data.length;++i)
                                {
                                    if(req.query.jitkey == result.data[i].UserID)
                                    {
                                        result.data.splice(i,1);
                                        i--;
                                    }
                                }

                                res.status(200);

                                return res.json(result);
                            } else {
                                res.status(200);

                                return res.json({
                                    status: 200,
                                    isSuccess: false,
                                    msg: '无数据'
                                });
                            }
                        })
                    });
                });
            });
        });
    });
});

//KPI审核
router.put('/check', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPICheck.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (!(results !== undefined && results.isSuccess)) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }

        var temp = ['ID', 'KPIStatus'],
            temp1 = ['绩效ID', '审核意见'];

        err = '缺少值: ';

        data = req.body.formdata;

        for (var key in temp) {
            if (!(temp[key] in data)) {
                logger.writeInfo("缺少值: " + temp[key]);
                err += temp1[key];
            }
        }

        if (err != '缺少值: ') {
            res.status(400);

            return res.json({
                status: 400,
                isSuccess: false,
                msg: err
            });
        }

        if (data.KPIStatus != '不通过' && data.KPIStatus != '通过' ) {
            res.status(400);

            return res.json({
                status: 400,
                isSuccess: false,
                msg: '操作失败,未选择审核结果'
            });
        }

        if(data.KPIStatus == '不通过' && (data.Memo === undefined || data.Memo.trim()==='')) {
            res.status(400);

            return res.json({
                status: 400,
                isSuccess: false,
                msg: '操作失败，不通过的审核需填写备注信息'
            });
        }

        if(data.KPIStatus == '不通过') {
            data.Remark = data.Memo;
        }

        if (data.Remark.length>45) {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: '备注过长,请勿超过45个字符'
            });
        }

        data.CheckUser = req.query.jitkey;

        var ID = data.ID;

        //查看该绩效信息是否已经被审核
        KPIservice.queryKPI({'ID':ID, 'OperateUserID': req.query.jitkey}, function (err, results) {
            if (err) {
                res.status(500);

                return res.json({
                    status: 500,
                    isSuccess: false,
                    msg: '操作失败，服务器出错'
                });
            }

            if (results !== undefined && results.length>0 && results[0].IsActive === 1) {
                if (results[0].KPIStatus == '待审核') {
                    KPIservice.checkKPI(data, function (err, results) {
                        if (err) {
                            res.status(500);

                            return res.json({
                                status: 500,
                                isSuccess: false,
                                msg: '操作失败，服务器出错'
                            });
                        }

                        if (results !== undefined && results.affectedRows > 0) {
                            res.status(200);

                            return res.json({
                                status: 200,
                                isSuccess: true,
                                msg: '操作成功'
                            });
                        } else {
                            res.status(400);

                            return res.json({
                                status: 404,
                                isSuccess: false,
                                msg: '操作失败'
                            });
                        }
                    });
                } else {
                    res.status(400);

                    return res.json({
                        status: 400,
                        isSuccess: false,
                        msg: '当前绩效已审核！'
                    });
                }
            } else {
                res.status(400);

                return res.json({
                    status: 400,
                    isSuccess: false,
                    msg: '审核的绩效信息不存在或无效'
                });
            }
        });
    });
});

//KPI删除
router.delete('/', function (req, res) {
    var data = {
        userID: req.query.jitkey,
        functionCode: functionConfig.sfmsApp.KPIManage.KPIDelete.functionCode
    };

    userFuncService.checkUserFunc(data, function(err, results) {
        if (err) {
            res.status(500);

            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }

        if (results !== undefined && results.isSuccess === true) {
            var ID = JSON.parse(req.query.d).ID;

            if (ID == '' || ID === undefined) {
                res.status(400);

                return res.json({
                    status: 400,
                    isSuccess: false,
                    msg: "缺少绩效ID"
                });
            }

            data = {
                'ID': ID,
                'OperateUserID': req.query.jitkey
            };

            KPIservice.delKPI(data, function (err, results) {
                if (err) {
                    res.status(500);

                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "操作失败，服务器出错"
                    });
                }

                if(results !== undefined && results.affectedRows > 0) {
                    res.status(200);

                    return res.json({
                        status: 200,
                        isSuccess: true,
                        msg: "操作成功"
                    });
                } else {
                    res.status(400);

                    return res.json({
                        status: 400,
                        isSuccess: true,
                        msg: "操作失败"
                    });
                }
            })
        } else {
            res.status(400);

            return res.json({
                code: 400,
                isSuccess: false,
                msg: results.msg
            });
        }
    });
});

module.exports = router;