/**
 * @Author: Duncan
 * @Date: 2016/11/15 19:04
 * @Last Modified by: Duncan
 * @Last Modified time: 2016/11/20 15:04
 * @Function: 用户信息的插入,用户信息的查询，用户信息的更改,信息存入日志
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var moment = require('moment');
var operateconfig = appRequire("config/operationconfig");
var logger = appRequire('util/loghelper').helper;
//加载中间件
var express = require('express');
var router = express.Router();
var url = require('url');
var moment = require('moment');
var logger = appRequire('util/loghelper').helper;
//加载中间件
var user = appRequire('service/backend/user/userservice'),

    //加载菜单的service 
    menuService = appRequire('service/backend/menu/menuservice'),
    //加载应用的路由
    application = appRequire('service/backend/application/applicationservice'),
    config = appRequire('config/config'),
    userRole = appRequire('service/backend/user/userroleservice'),
    functionConfig = appRequire('config/functionconfig'),
    userFuncService = appRequire('service/backend/user/userfuncservice');
//插入用户
router.post('/', function (req, res) {
    var functionCode = functionConfig.backendApp.userManage.userAdd.functionCode;
    var funcData = {
        userID: req.query.jitkey,
        functionCode: functionCode
    }

    userFuncService.checkUserFunc(funcData, function (err, funcResult) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }
        if (funcResult !== undefined && funcResult.isSuccess === true) {
            var data = ['ApplicationID', 'Account', 'UserName', 'Pwd', 'IsActive'];
            var err = 'require: ';

            for (var value in data) {

                if (!(data[value] in req.body.formdata)) {
                    ///if(data[value]!='Email'&&data[value]!='Address')
                    err += data[value] + ' ';//检查post传输的数据
                }
            }

            if (err != 'require: ') {
                res.status(400);
                res.json({
                    code: 400,
                    isSuccess: false,
                    msg: err
                });
                logger.writeError("[routes/route/user/userroute]" + "缺少key值");
                return;
            }

            //插入要传的参数
            var applicationID = req.body.formdata.ApplicationID,
                account = req.body.formdata.Account,
                userName = req.body.formdata.UserName,
                pwd = req.body.formdata.Pwd,
                collegeID = req.body.formdata.CollegeID,
                gradeYear = req.body.formdata.GradeYear,
                phone = req.body.formdata.Phone,
                classID = req.body.formdata.ClassID,
                memo = req.body.formdata.Memo,
                createTime = moment().format("YYYY-MM-DD HH:mm:ss"),
                createUserID = req.query.jitkey,
                editUserID = req.body.formdata.EditUserID,
                isActive = req.body.formdata.IsActive,
                email = req.body.formdata.Email,
                address = req.body.formdata.Address;


            //添加角色的部分
            var roleID = req.body.formdata.RoleID;

            var roledata = {};
            if (roleID != undefined && roleID.length != 0) {
                roledata.RoleID = roleID;
            }


            data = {
                'ApplicationID': applicationID,
                'Account': account,
                'UserName': userName,
                'Pwd': pwd,
                'CreateTime': createTime,
                'CreateUserID': createUserID,
                'IsActive': isActive
            }

            var requireValue = '缺少值：';

            for (var value in data) {	//console.log(typeof(value));
                if (data[value].length == 0) {
                    requireValue += value + ' ';
                }
            }

            if (requireValue != '缺少值：') {
                res.status(400);
                res.json({
                    code: 400,
                    isSuccess: false,
                    msg: requireValue
                });
                logger.writeError("[routes/backend/user/userroute]" + requireValue);
                return;
            }
            
            //用来检验是否是数字
            var intNum = {
                "ApplicationID": applicationID,
                "CreateUserID": createUserID,
                "IsActive": isActive
            }

            for (var key in intNum) {
                if (isNaN(intNum[key])) {
                    res.status(400);
                    return res.json(
                        {
                            code: 400,
                            isSuccess: false,
                            msg: key + ":" + intNum[key] + " 必须是数字"
                        });
                }
            }

            //用来用户名判断长度
            if (userName.length > 50) {
                res.status(400);
                return res.json(
                    {
                        code: 400,
                        isSuccess: false,
                        msg: "username的字符长度超过的50"
                    });

            }

            //用来账户名判断长度
            if (account.length > 50) {
                res.status(400);
                return res.json(
                    {
                        code: 400,
                        isSuccess: false,
                        msg: "account的字符长度超过的50"
                    });

            }

            //去除相同的账户名字
            var sameAccount = { 'Account': account };
            user.queryAccount(sameAccount, function (err, result) {
                if (err) {
                    res.status(400);
                    res.json({
                        code: 400,
                        isSuccess: false,
                        msg: "查询账户失败"
                    })
                    logger.writeError("[routes/backend/user/userroute]" + "查询账户失败");
                    return;
                }
                if (result != undefined && result != 0) {
                    res.status(400);
                    res.json({
                        code: 400,
                        isSuccess: false,
                        msg: "账户名已存在"
                    })
                    logger.writeError("[routes/backend/user/userroute]" + "账户名已存在");
                    return;
                }


                if (email != undefined && email.length != 0) {
                    if (email.length > 50) {
                        res.status(400);
                        return res.json(
                            {
                                code: 400,
                                isSuccess: false,
                                msg: "email的字符长度超过的50"
                            });

                    }

                    if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
                        res.status(400);
                        return res.json(
                            {
                                code: 400,
                                isSuccess: false,
                                msg: "请输入正确的邮箱号"
                            });
                    }
                    data['Email'] = email;
                }


                if (address != undefined && address.length != 0) {
                    if (address.length > 200) {
                        res.status(400);
                        return res.json(
                            {
                                code: 400,
                                isSuccess: false,
                                msg: "address的字符长度超过的200"
                            });

                    }
                    data['Address'] = address;
                }


                if (collegeID != undefined && collegeID.length != 0) {
                    data['CollegeID'] = collegeID;
                }

                if (gradeYear != undefined && gradeYear.length != 0) {
                    data['GradeYear'] = gradeYear;
                }

                if (phone != undefined && phone.length != 0) {
                    if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
                        res.status(400);
                        return res.json(
                            {
                                code: 400,
                                isSuccess: false,
                                msg: "请输入正确的电话号码"
                            });
                    }
                    data['Phone'] = phone;
                }

                if (classID != undefined && classID.length != 0) {
                    data['ClassID'] = classID;
                }
                if (memo != undefined && memo.length != 0) {
                    if (memo.length > 200) {
                        res.status(400);
                        return res.json(
                            {
                                code: 400,
                                isSuccess: false,
                                msg: "memo的字符长度超过200"
                            });
                    }
                    data['Memo'] = memo;
                }
                if (editUserID != undefined && editUserID.length != 0) {
                    data['EditUserID'] = editUserID;
                }


                user.insert(data, function (err, results) {
                    if (err) {
                        res.status(500);
                        res.json({
                            code: 500,
                            isSuccess: false,
                            msg: '操作失败，服务器出错'
                        });
                        logger.writeError("[routes/backend/user/userrole]" + "插入失败");
                        return;
                    }
                    if (results.insertId != 0) {
                        // res.json({
                        //     code: 200,
                        //     isSuccess: true,
                        //     msg: '操作成功'
                        // });
                        logger.writeInfo("[routes/backend/user/userrole]" + "插入成功");
                        console.log(results.insertId);
                        if (roledata.RoleID != undefined && roledata.RoleID != 0) {
                            roledata.AccountID = results.insertId;
                            userRole.insert(roledata, function (err, resultInsert) {
                                if (err) {
                                    res.status(400);
                                    res.json({
                                        code: 400,
                                        isSuccess: false,
                                        msg: '插入角色失败'
                                    });
                                    logger.writeError("[routes/backend/user/userrole]" + "插入角色失败");
                                    return;
                                }
                                if (resultInsert.insertId != 0) {
                                    res.json({
                                        code: 200,
                                        isSuccess: true,
                                        msg: '插入成功'
                                    });
                                    return;
                                }
                            });
                        }
                        return;
                    }
                });
            });
        }
    });
});

//查询用户的资料
router.get('/', function (req, res) {
    var functionCode = functionConfig.backendApp.userManage.userQuery.functionCode;
    var data = {
        userID: req.query.jitkey,
        functionCode: functionCode
    }

    userFuncService.checkUserFunc(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }
        if (results !== undefined && results.isSuccess === true) {
            var query = JSON.parse(req.query.f);
            console.log(req.query);
            logger.writeInfo("查询用户的记录");
            var data = {},
                allCount,
                page = req.query.pageindex,//页数
                accountID = query.AccountID,
                applicationID = query.ApplicationID,
                account = query.Account,
                userName = query.UserName,
                classID = query.ClassID,
                createUserID = query.CreateUserID,
                editUserID = query.EditUserID,
                isActive = 1,
                pageNum = req.query.pagesize,
                applicationName = query.ApplicationName,
                createUserName = query.CreateUserName;

            //用来判断是否要分页的标志    
            var isPage = req.query.isPaging || '';

            if (page == undefined || page.length == 0) {
                page = 1;
            }
            //选定筛选的条件
            if (accountID !== undefined && accountID.length != 0) {
                data['AccountID'] = accountID;
            }
            if (applicationName !== undefined && applicationName.length != 0) {
                data['ApplicationName'] = applicationName;
            }
            if (createUserName !== undefined && createUserName.length != 0) {
                data['CreateUserName'] = createUserName;
            }
            if (applicationID !== undefined && applicationID.length != 0) {
                data['ApplicationID'] = applicationID;
            }
            if (account !== undefined && account.length != 0) {
                data['Account'] = account;
            }
            if (userName !== undefined && userName.length != 0) {
                data['UserName'] = userName;
            }
            if (classID !== undefined && classID.length != 0) {
                data['ClassID'] = classID;
            }
            if (createUserID !== undefined && createUserID.length != 0) {
                data['CreateUserID'] = createUserID;
            }
            if (editUserID !== undefined && editUserID.length != 0) {
                data['EditUserID'] = editUserID;
            }
            data['IsActive'] = isActive;
            if (pageNum == undefined) {
                pageNum = config.pageCount;
            }

            data['page'] = page;
            data['pageNum'] = pageNum;
    
            //获取所有用户的数量
            user.countUser(data, function (err, result) {
                if (err) {
                    res.status(500);
                    res.json({
                        code: 500,
                        isSuccess: false,
                        msg: "获取数量失败，服务器出错"
                    })
                    logger.writeError("[routes/backend/user/userroute]" + "数量获取失败");
                    return;
                }
                if (result !== undefined && result.length != 0) {
                    allCount = result[0]['num'];
                    data['IsPage'] = isPage;
           
                    //查询所需要的数据
                    user.queryAllUsers(data, function (err, results1) {
                        if (err) {
                            res.status(500);
                            res.json({
                                code: 500,
                                isSuccess: true,
                                msg: '查询失败'
                            });
                            console.log("查询失败");
                            logger.writeError("[routes/backend/user/userroute]" + "查询失败");
                            return;
                        }
                        if (results1 != undefined && results1.length != 0 && allCount != -1) {
                            //将时间格式化，并且将CreateUser的名字改一下
                            var dataApplication = {};
                            for (var key in results1) {
                                results1[key].CreateTime = moment(results1[key].CreateTime).format('YYYY-MM-DD HH:mm:ss');
                            }
                            var results = {
                                code: 200,
                                isSuccess: true,
                                msg: '查询成功',
                                dataNum: allCount,
                                curPage: page,
                                curpageNum: pageNum,
                                totalPage: Math.ceil(allCount / pageNum),
                                data: results1
                            };

                            if (results.curPage == results.totlePage) {
                                results.curpageNum = results.dataNum - (results.totlePage - 1) * pageNum;
                            }
                            res.status(200);
                            res.json(results);
                            return;
                        } else {
                            res.status(200);
                            res.json({
                                code: 500,
                                isSuccess: false,
                                msg: "未查到数据"
                            });
                            logger.writeWarn("[routes/backend/user/userroute]" + "未查到数据");
                            return;
                        }
                    });
                } else {
                    res.status(200);
                    res.json({
                        code: 404,
                        isSuccess: false,
                        msg: "未查询到相关信息"
                    });
                    logger.writeError("[routes/backend/user/userroute]" + "为查询到相关的信息");
                    return;
                }
            });
        }
    });
});

//后端的菜单通过用户的ID来查询用户的信息
router.get('/:userID', function (req, res) {
    var functionCode = functionConfig.backendApp.userManage.userQuery.functionCode;
    var data = {
        userID: req.query.jitkey,
        functionCode: functionCode
    }

    userFuncService.checkUserFunc(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }
        if (results !== undefined && results.isSuccess === true) {
            var userID = req.params.userID;
            if (userID === undefined || userID === '') {
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: 'require userID'
                });
            }
            if (isNaN(userID)) {
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: 'userID不是数字'
                });
            }
            var uniqueData = {
                "userID": userID
            };

            //判断user是否存在
            user.querySingleID(userID, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器出错'
                    });
                }
                //user存在，则可以进行查询
                if (result !== undefined && result.length != 0) {
                    menuService.queryMenuAndRoleByUserID(uniqueData, function (err, results) {
                        if (err) {
                            res.status(500);
                            return res.json({
                                code: 500,
                                isSuccess: false,
                                msg: '服务器出错'
                            });
                        }

                        if (results.Menu !== undefined && results.Menu.length != 0) {
                            if (results.Role !== undefined && results.Role.length != 0) {
                                return res.json({
                                    code: 200,
                                    isSuccess: true,
                                    data: results,
                                    msg: '查询菜单和角色成功'
                                });
                            } else {
                                return res.json({
                                    code: 404,
                                    isSuccess: false,
                                    msg: '未查到角色'
                                });
                            }

                        } else {
                            return res.json({
                                code: 404,
                                isSuccess: false,
                                msg: '未查到菜单'
                            });
                        }
                    });
                } else {
                    return res.json({
                        code: 404,
                        isSuccess: false,
                        msg: '用户不存在'
                    });
                }
            });
        }
    });
});

/**
 * @api {get} /backuser/singleID/ 通过userid来获取用户的信息
 * @apiParam {Number} AccountID ID unique sign
 */

router.get('/singID', function (req, res) {
    var functionCode = functionConfig.backendApp.userManage.userQuery.functionCode;
    var data = {
        userID: req.query.jitkey,
        functionCode: functionCode
    }

    userFuncService.checkUserFunc(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }
        if (results !== undefined && results.isSuccess === true) {
            var accountID = data.userID;
            if (accountID === undefined || accountID === '') {
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: 'require accountID'
                });
            }
            
            if (isNaN(accountID)) {
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: 'accountID不是数字'
                });
            }
            
            user.querySingleID(accountID, function (err, result) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器出错'
                    });
                }
                
                if (result == undefined && result.length == 0) {
                    res.status(200);
                    return res.json({
                       code: 200,
                       isSuccess: true,
                       msg: '未找到该用户' 
                    });
                }
                
                if(result !== undefined && result.length !=0) {
                    res.status(200);
                    return res.json({
                       code: 200,
                       isSuccess: true,
                       msg: result 
                    });
                }
            });
        }
    });
});
      
//用户的编辑功能
router.put('/', function (req, res) {
    var functionCode = functionConfig.backendApp.userManage.userEdit.functionCode;
    var data = {
        userID: req.query.jitkey,
        functionCode: functionCode
    }

    userFuncService.checkUserFunc(data, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '查询失败，服务器出错'
            });
        }
        if (results !== undefined && results.isSuccess === true) {

            var data = ['ApplicationID', 'Account', 'UserName', 'Pwd', 'CreateUserID', 'IsActive'];
            var err = 'require: ';

            for (var value in data) {
                if (!(data[value] in req.body.formdata)) {
                    ///if(data[value]!='Email'&&data[value]!='Address')
                    err += data[value] + ' ';//检查post传输的数据
                }
            }

            if (err != 'require: ') {
                res.status(400);
                res.json({
                    code: 400,
                    isSuccess: false,
                    msg: err
                });
                logger.writeError("[routes/backend/user/userrole---------538行]" + err);
                return;
            }

            //插入要传的参数
            var applicationID = req.body.formdata.ApplicationID,
                accountID = req.body.formdata.AccountID,
                account = req.body.formdata.Account,
                userName = req.body.formdata.UserName,
                pwd = req.body.formdata.Pwd,
                collegeID = req.body.formdata.CollegeID,
                gradeYear = req.body.formdata.GradeYear,
                phone = req.body.formdata.Phone,
                classID = req.body.formdata.ClassID,
                memo = req.body.formdata.Memo,
                createUserID = req.body.formdata.CreateUserID,
                editUserID = req.query.jitkey,
                editTime = moment().format("YYYY-MM-DD HH:mm:ss"),
                isActive = req.body.formdata.IsActive,
                email = req.body.formdata.Email,
                address = req.body.formdata.Address,
                roleID = req.body.formdata.RoleID;


            data = {
                'ApplicationID': applicationID,
                'AccountID': accountID,
                'Account': account,
                'UserName': userName,
                'Pwd': pwd,
                'EditTime': editTime,
                'CreateUserID': createUserID,
                'IsActive': isActive,
                'EditUserID': editUserID
            }

            var roledata = {
                'AccountID': accountID,
                'RoleID': roleID
            }

            var requireValue = '缺少值：';
            for (var value in data) {
                if (data[value].length == 0) {
                    requireValue += value + ' ';
                }

            }
            if (requireValue != '缺少值：') {
                res.status(400);
                res.json({
                    code: 400,
                    isSuccess: false,
                    msg: requireValue
                });

                logger.writeError(requireValue);
                return;
            }

            //判断是数字
            var intNum = {
                'ApplicationID': applicationID,
                'AccountID': accountID,
                'CreateUserID': createUserID,
                'IsActive': isActive,
                'EditUserID': editUserID,
                'AccountID': accountID,
                'RoleID': roleID
            }

            for (var key in intNum) {
                if (isNaN(intNum[key])) {
                    res.status(400);
                    return res.json(
                        {
                            code: 400,
                            isSuccess: false,
                            msg: key + ":" + intNum[key] + " 必须是数字"
                        });
                }
            }

            //用来判断密码的长度
            if (pwd.length > 50) {
                res.status(400);
                return res.json(
                    {
                        code: 400,
                        isSuccess: false,
                        msg: "密码的字符长度超过的50"
                    });

            }

            //用来用户名判断长度
            if (userName.length > 50) {
                res.status(400);
                return res.json(
                    {
                        code: 400,
                        isSuccess: false,
                        msg: "username的字符长度超过的50"
                    });

            }

            //用来账户名判断长度
            if (account.length > 50) {
                res.status(400);
                return res.json(
                    {
                        code: 400,
                        isSuccess: false,
                        msg: "account的字符长度超过的50"
                    });

            }

            if (email != undefined && email.length != 0) {
                if (email.length > 50) {
                    res.status(400);
                    return res.json(
                        {
                            code: 400,
                            isSuccess: false,
                            msg: "email的字符长度超过的50"
                        });

                }

                if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
                    res.status(400);
                    return res.json(
                        {
                            code: 400,
                            isSuccess: false,
                            msg: "请输入正确的邮箱号"
                        });
                }
                data['Email'] = email;
            }

            if (address != undefined && address.length != 0) {
                if (address.length > 200) {
                    res.status(400);
                    return res.json(
                        {
                            code: 400,
                            isSuccess: false,
                            msg: "address的字符长度超过的200"
                        });

                }
                data['Address'] = address;
            }


            if (collegeID != undefined && collegeID.length != 0) {
                data['CollegeID'] = collegeID;
            }

            if (gradeYear != undefined && gradeYear.length != 0) {
                data['GradeYear'] = gradeYear;
            }

            if (phone != undefined && phone.length != 0) {
                if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
                    res.status(400);
                    return res.json(
                        {
                            code: 400,
                            isSuccess: false,
                            msg: "请输入正确的电话号码"
                        });
                }
                data['Phone'] = phone;
            }

            if (classID != undefined && classID.length != 0) {
                data['ClassID'] = classID;
            }
            if (memo != undefined && memo.length != 0) {
                if (memo.length > 200) {
                    res.status(400);
                    return res.json(
                        {
                            code: 400,
                            isSuccess: false,
                            msg: "memo的字符长度超过200"
                        });
                }
                data['Memo'] = memo;
            }

            userRole.query(roledata, function (err, queryinfo) {

                if (err) {
                    res.status(500);
                    res.json(
                        {
                            code: 500,
                            isSuccess: false,
                            msg: '修改信息失败，服务器出错'
                        });
                    logger.writeError("[routes/backend/user/userroute]" + "修改信息失败，服务器出错");
                    return;
                }

                if (queryinfo != undefined && queryinfo.length != 0) {

                    roledata.ID = queryinfo[0].ID;

                    userRole.updateUserRole(roledata, function (err, updatinfo) {
                        if (err) {
                            res.status(500);
                            res.json(
                                {
                                    code: 500,
                                    isSuccess: false,
                                    msg: '修改信息失败，服务器出错'
                                });

                            console.log("修改角色失败");
                            logger.writeError("[routes/backend/user/userroute]" + "修改信息失败，服务器出错");
                            return;
                        }


                        if (updatinfo !== undefined && updatinfo.affectedRows != 0) {

                            console.log("检查错误");
                            console.log("修改角色成功");
                            logger.writeInfo("[routes/bcakend/user/userroute]" + "修改信息成功");
                            return;
                        } else {
                            res.status(400);
                            res.json({
                                code: 400,
                                isSuccess: false,
                                msg: "修改信息失败"
                            })
                            logger.writeError("[routes/backend/user/userroute]" + "修改信息失败");
                            return;
                        }
                    });
                }
                else {
                    userRole.insert(roledata, function (err, resultInsert) {
                        if (err) {
                            res.status(400);
                            res.json({
                                code: 400,
                                isSuccess: false,
                                errorMsg: '插入角色失败'
                            });
                            logger.writeError("[routes/backend/user/userroute]" + "插入角色失败");
                            return;
                        }
                        if (resultInsert.insertId != 0) {
                            // res.json({
                            //     code:200,
                            //     isSuccess: true,
                            //     msg:'插入成功'                  
                            //    });
                            return;
                        }
                    });
                }
            });


            user.update(data, function (err, results) {
                if (err) {
                    res.status(500);
                    res.json(
                        {
                            code: 500,
                            isSuccess: false,
                            msg: '修改信息失败，服务器出错'
                        });
                    logger.writeError("[routes/backend/user/userroute]" + "修改信息失败，服务器出错");
                    return;
                }
                if (results !== undefined && results.affectedRows != 0) {
                    res.json({
                        code: 200,
                        isSuccess: true,
                        msg: "修改信息成功"
                    })
                    logger.writeInfo("[routes/backend/user/userroute]" + "修改信息成功");
                    return;
                } else {
                    res.status(400);
                    res.json({
                        code: 400,
                        isSuccess: false,
                        msg: "修改信息失败"
                    })
                    logger.writeError("[routes/backend/user/userrout]" + "修改信息失败");
                    return;
                }
            });
        }
    });
});

//逻辑删除角色
router.delete('/', function (req, res) {
    var functionCode = functionConfig.backendApp.userManage.userDel.functionCode;
    var data = {
        userID: req.query.jitkey,
        functionCode: functionCode
    }

    userFuncService.checkUserFunc(data, function (err, results) {
        var query = JSON.parse(req.query.d),
            accountID = query.AccountID;
        var data = {
            'AccountID': accountID,
            'IsActive': 0
        }
        user.update(data, function (err, results) {
            if (err) {
                res.status(500);
                res.json(
                    {
                        code: 500,
                        isSuccess: false,
                        msg: '操作失败，服务器出错'
                    });
                logger.writeError("[routes/backend/user/userroute]" + "修改信息失败，服务器出错");
                return;
            }
            if (results !== undefined && results.affectedRows != 0) {
                res.json({
                    code: 200,
                    isSuccess: true,
                    msg: "操作成功"
                })
                logger.writeInfo("[routes/backend/user/userroute]" + "修改信息成功");
                return;
            } else {
                res.status(400);
                res.json({
                    code: 400,
                    isSuccess: false,
                    msg: "操作失败"
                })
                logger.writeError("[routes/backend/user/userroute]" + "修改信息失败");
                return;
            }
        });
    });
});

module.exports = router;