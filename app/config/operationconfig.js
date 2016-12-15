/**
 * @Author: snail
 * @Date: 2016-12-13
 * @Function:
 * 这里作为OperationLog的动作配置
 * identifier设置的数值，按照每个应用递增1000开始，也就是说每次新增第n个应用，第一个identifier=n*1000+1
 * 原则上只在记录operationlog方法中作为其参数使用
 */

var operationConfig = {
    operationType: {
        error: 1, //异常
        operation: 2 //操作
    },
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
            customerUpd{
                actionName:'客户修改',
                identifier:2002
            },
            customerDel{
                actionName:'客户的删除',
                identifier:2003
            }
        }
        orderManger:{
            module:"订单模块",
            orderAdd:{
                actionName:"订单的新增",
                identifier:2101
            }
            orderUpd:{
                actionName:"订单的更新",
                identifier:2102
            }
            orderDel:{
                actionName:"订单的删除",
                identifier:2103
            }
            orderQuery:{
                actionName:"订单的查询",
                identifier:2104
            }
        }
        orderDelivery:{
            module:"订单配送情况的模块",
            orderdeliveryAdd:{
                actionName:"配送情况单的新增",
                identifier:2201
            }
            orderdeliveryUpd：{
                actionName:"配送情况单的更新",
                identifier:2202
            }
            orderdeliveryDel:{
                actionName:"配送情况单的删除",
                identifier:2203
            }
            orderdeliveryQuery:{
                actionName:"配送员情况单的查询",
                identifier:2204
            }
        }
        orderProduct:{
            module:"订单商品情况的模块",
            orderProductAdd:{
                actionName:"配送商品情况的新增",
                identifier:2301
            }
            orderProductUpd：{
                actionName:"配送商品情况的更新",
                identifier:2302
            }
            orderProductDel:{
                actionName:"配送商品情况的删除",
                identifier:2303
            }
            orderProductQuery:{
                actionName:"配送员商品情况的查询",
                identifier:2304
            }
        }
       product:{
            module:"商品模块",
           productAdd:{
                actionName:"商品新增",
                identifier:2401
            }
           productUpd：{
                actionName:"商品更新",
                identifier:2402
            }
           productDel:{
                actionName:"商品删除",
                identifier:2403
            }
           productQuery:{
                actionName:"商品查询",
                identifier:2304
            }
        }
        productStock:{
            module:"商品库存模块",
            productStockAdd:{
                actionName:"商品库存新增",
                identifier:2501
            }
            productStockUpd：{
                actionName:"商品库存更新",
                identifier:2502
            }
            productStockDel:{
                actionName:"商品库存删除",
                identifier:2503
            }
            productStockQuery:{
                actionName:"商品库存查询",
                identifier:2504
            }
        }
        productType:{
            module:"商品种类模块",
            productTypeAdd:{
                actionName:"商品种类新增",
                identifier:2601
            }
            productTypeUpd：{
                actionName:"商品种类更新",
                identifier:2602
            }
            productTypeDel:{
                actionName:"商品种类删除",
                identifier:2603
            }
            productTypeQuery:{
                actionName:"商品种类查询",
                identifier:2604
            }
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