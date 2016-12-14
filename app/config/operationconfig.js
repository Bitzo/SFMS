/**
 * @Author: snail
 * @Date: 2016-12-13
 * @Function:
 * 这里作为OperationLog的动作配置
 * identifier设置的数值，按照每个应用递增1000开始，也就是说每次新增第n个应用，第一个identifier=n*1000+1
 * 原则上只在记录operationlog方法中作为其参数使用
 */

var operationConfig = {
    backendApp: {
        applicationID: 1, //应用的唯一id
        applicationName: "jit后台", //应用的名称
        //模块
        userManage: {
            module: "用户模块",
            //改模块下对应的功能
            userAdd: {
                actionName: "用户新增",
                identifier: 1
            },
            userDel: {
                actionName: "用户删除",
                identifier: 2
            },
            userSingleQuery: {
                actionName: "用户单个查询",
                identifier: 3
            },
            userMultiQuery: {
                actionName: "用户批量查询",
                identifier: 4
            },
        },
        roleManage: {
            module: "角色模块",
            roleAdd: {
                actionName: "角色新增",
                identifier: 101
            },
            userDel: {
                actionName: "角色删除",
                identifier: 102
            },
            userSingleQuery: {
                actionName: "用户单个查询",
                identifier: 103
            },
            userMultiQuery: {
                actionName: "用户批量查询",
                identifier: 104
            },
        },
    },
    jinkeBroApp: {
        applicationID: 2,
        applicationName: "金科小哥",
        customerManage: {
            module: "客户模块",
            customerAdd: {
                actionName: "客户新增",
                identifier: 2001
            },
        }
    },
    sfmsApp: {
        applicationID: 3,
        applicationName: "实验室管理系统",
        projectManage: {
            module: "项目模块",
            projectAdd: {
                actionName: "项目新增",
                identifier: 3001
            },
        }
    }


};