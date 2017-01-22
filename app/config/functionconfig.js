/**
 * @Function:
 * 这里作为功能点的测验的动作配置
 */

var functionConfig = {
    backendApp: {
        applicationID: 1,
        applicationName: "jit后台",
        userManage: {
            functionName: "用户管理",
            functionCode: "BACKEND-USER-MANAGE",
            //改模块下对应的功能
            userAdd: {
                functionName: "用户新增",
                functionCode: "BACKEND-USER-ADD",
            },
            userDel: {
                functionName: "用户删除",
                functionCode: "BACKEND-USER-DELETE"
            },
            userQuery: {
                functionName: "用户查询",
                functionCode: "BACKEND-USER-QUERY"
            },
            userEdit: {
                functionName: "用户修改",
                functionCode: "BACKEND-USER-EDIT"
            },
        },
        roleManage: {
            functionName: "角色管理",
            functionCode: "BACKEND-ROLE-MANAGE",
            roleAdd: {
                functionName: "角色新增",
                functionCode: "BACKEND-ROLE-ADD"
            },
            roleDel: {
                functionName: "角色删除",
                functionCode: "BACKEND-ROLE-DELETE"
            },
            roleQuery: {
                functionName: "角色查询",
                functionCode: "BACKEND-ROLE-QUERY"
            },
            roleEdit: {
                functionName: "角色修改",
                functionCode: "BACKEND-ROLE-EDIT"
            },
        },
        memuManage: {
            functionName: "菜单管理",
            functionCode: "BACKEND-MENU-MANAGE",
            menuAdd: {
                functionName: "菜单新增",
                functionCode: "BACKEND-MENU-ADD"
            },
            menuDel: {
                functionName: "菜单删除",
                functionCode: "BACKEND-MENU-DELETE"
            },
            menuEdit: {
                functionName: "菜单修改",
                functionCode: "BACKEND-MENU-EDIT"
            },
            menuQuery: {
                functionName: "菜单查询",
                functionCode: "BACKEND-MENU-QUERY"
            },
        },
        appManage: {
            functionName: "应用管理",
            functionCode: "BACKEND-APP-MANAGE",
            appAdd: {
                functionName: "应用新增",
                functionCode: "BACKEND-APP-ADD"
            },
            appDel: {
                functionName: "应用删除",
                functionCode: "BACKEND-APP-DELETE"
            },
            appEdit: {
                functionName: "应用修改",
                functionCode: "BACKEND-APP-EDIT"
            },
            appQuery: {
                functionName: "应用查询",
                functionCode: "BACKEND-APP-QUERY"
            },
        },
        functionManage: {
            functionName: "功能点管理",
            functionCode: "BACKEND-FUNCTION-MANAGE",
            functionAdd: {
                functionName: "功能点新增",
                functionCode: "BACKEND-FUNCTION-ADD"
            },
            functionDel: {
                functionName: "功能点删除",
                functionCode: "BACKEND-FUNCTION-DELETE"
            },
            functionEdit: {
                functionName: "功能点修改",
                functionCode: "BACKEND-FUNCTION-EDIT"
            },
            functionQuery: {
                functionName: "功能点查询",
                functionCode: "BACKEND-FUNCTION-QUERY"
            },
        },
        userMenuManage: {
            functionName: "用户菜单管理",
            functionCode: "BACKEND-USER-MENU-MANAGE",
            userMenuAdd: {
                functionName: "用户菜单新增",
                functionCode: "BACKEND-USER-MENU-ADD"
            },
            userMenuDel: {
                functionName: "用户菜单删除",
                functionCode: "BACKEND-USER-MENU-DELETE"
            },
            userMenuEdit: {
                functionName: "用户菜单修改",
                functionCode: "BACKEND-USER-MENU-EDIT"
            },
            userMenuQuery: {
                functionName: "用户菜单查询",
                functionCode: "BACKEND-USER-MENU-QUERY"
            },
        },
        userRoleManage: {
            functionName: "用户角色管理",
            functionCode: "BACKEND-USER-ROLE-MANAGE",
            userRoleAdd: {
                functionName: "用户角色新增",
                functionCode: "BACKEND-USER-ROLE-ADD"
            },
            userRoleDel: {
                functionName: "用户角色删除",
                functionCode: "BACKEND-USER-ROLE-DELETE"
            },
            userRoleEdit: {
                functionName: "用户角色修改",
                functionCode: "BACKEND-USER-ROLE-EDIT"
            },
            userRoleQuery: {
                functionName: "用户角色查询",
                functionCode: "BACKEND-USER-ROLE-QUERY"
            },
        },
        roleFuncManage: {
            functionName: "角色功能点管理",
            functionCode: "BACKEND-ROLE-FUNC-MANAGE",
            roleFuncAdd: {
                functionName: "角色功能点新增",
                functionCode: "BACKEND-ROLE-FUNC-ADD"
            },
            roleFuncDel: {
                functionName: "角色功能点删除",
                functionCode: "BACKEND-ROLE-FUNC-DELETE"
            },
            roleFuncEdit: {
                functionName: "角色功能点修改",
                functionCode: "BACKEND-ROLE-FUNC-EDIT"
            },
            roleFuncQuery: {
                functionName: "角色功能点查询",
                functionCode: "BACKEND-ROLE-FUNC-QUERY"
            },
        },
    },
    jinkeBroApp: {
        applicationID: 2,
        applicationName: "金科小哥",
        customerManage: {
            functionName: "客户管理",
            functionCode: "JB-CUSTOMER-MANAGE",
            customerAdd: {
                functionName: "客户新增",
                functionCode: "JB-CUSTOMER-ADD"
            },
            customerEdit: {
                functionName: '客户修改',
                functionCode: "JB-CUSTOMER-EDIT"
            },
            customerQuery: {
                functionName: '客户查询',
                functionCode: 'JB-CUSTOMER-QUERY'
            },
            customerDel: {
                functionName: '客户删除',
                functionCode: 'JB-CUSTOMER-DELETE'
            }
        },
        orderManger: {
            functionName: "订单管理",
            functionCode: "JB-ORDER-MANAGE",
            orderAdd: {
                functionName: "订单新增",
                functionCode: "JB-ORDER-ADD"
            },
            orderEdit: {
                functionName: "订单编辑",
                functionCode: "JB-ORDER-EDIT"
            },
            orderDel: {
                functionName: "订单删除",
                functionCode: "JB-ORDER-DELETE"
            },
            orderQuery: {
                functionName: "订单查询",
                functionCode: "JB-ORDER-QUERY"
            },
        },
        orderDelivery: {
            functionName: "订单配送管理",
            functionCode: "JB-ORDER-DELIVERY-MANAGE",
            orderdeliveryAdd: {
                functionName: "配送情况单新增",
                functionCode: "JB-ORDER-DELIVERY-ADD"
            },
            orderdeliveryEdit: {
                functionName: "配送情况单更新",
                functionCode: "JB-ORDER-DELIVERY-EDIT"
            },
            orderdeliveryDel: {
                functionName: "配送情况单删除",
                functionCode: "JB-ORDER-DELIVERY-DELETE"
            },
            orderdeliveryQuery: {
                functionName: "配送员情况单查询",
                functionCode: "JB-ORDER-DELIVERY-QUERY"
            }
        },
        orderProduct: {
            functionName: "订单商品情况管理",
            functionCode: "JB-ORDER-PRODUCT-MANAGE",
            orderProductAdd: {
                functionName: "配送商品情况新增",
                functionCode: "JB-ORDER-PRODUCT-ADD"
            },
            orderProductEdit: {
                functionName: "配送商品情况更新",
                functionCode: "JB-ORDER-PRODUCT-EDIT"
            },
            orderProductDel: {
                functionName: "配送商品情况删除",
                functionCode: "JB-ORDER-PRODUCT-DELETE"
            },
            orderProductQuery: {
                functionName: "配送员商品情况查询",
                functionCode: "JB-ORDER-PRODUCT-QUERY"
            }
        },
        product: {
            functionName: "商品管理",
            functionCode: "JB-PRODUCT-MANAGE",
            productAdd: {
                functionName: "商品新增",
                functionCode: "JB-PRODUCT-ADD"
            },
            productEdit: {
                functionName: "商品更新",
                functionCode: "JB-PRODUCT-EDIT"
            },
            productDel: {
                functionName: "商品删除",
                functionCode: "JB-PRODUCT-DELETE"
            },
            productQuery: {
                functionName: "商品查询",
                functionCode: "JB-PRODUCT-QUERY"
            }
        },
        productStock: {
            functionName: "商品库存管理",
            functionCode: "JB-PRODUCT-STOCK-MANAGE",
            productStockAdd: {
                functionName: "商品库存新增",
                functionCode: "JB-PRODUCT-STOCK-ADD"
            },
            productStockEdit: {
                functionName: "商品库存更新",
                functionCode: "JB-PRODUCT-STOCK-EDIT"
            },
            productStockDel: {
                functionName: "商品库存删除",
                functionCode: "JB-PRODUCT-STOCK-DELETE"
            },
            productStockQuery: {
                functionName: "商品库存查询",
                functionCode: "JB-PRODUCT-STOCK-QUERY"
            }
        },
        productType: {
            functionName: "商品种类管理",
            functionCode: "JB-PRODUCT-TYPE-MANAGE",
            productTypeAdd: {
                functionName: "商品种类新增",
                functionCode: "JB-PRODUCT-TYPE-ADD"
            },
            productTypeEdit: {
                functionName: "商品种类更新",
                functionCode: "JB-PRODUCT-TYPE-EDIT"
            },
            productTypeDel: {
                functionName: "商品种类删除",
                functionCode: "JB-PRODUCT-TYPE-DELETE"
            },
            productTypeQuery: {
                functionName: "商品种类查询",
                functionCode: "JB-PRODUCT-TYPE-QUERY"
            },
        },
    },
    sfmsApp: {
        applicationID: 3,
        applicationName: "实验室管理系统",
        projectManage: {
            functionName: "项目管理",
            functionCode: "SFMS-PROJECT-MANAGE",
            projectAdd: {
                functionName: "项目新增",
                functionCode: "SFMS-PROJECT-ADD"
            },
            projectEdit: {
                functionName: "项目编辑",
                functionCode: "SFMS-PROJECT-EDIT"
            },
            projectQuery: {
                functionName: "项目查询",
                functionCode: "SFMS-PROJECT-QUERY"
            },
            projectDelete: {
                functionName: "项目删除",
                functionCode: "SFMS-PROJECT-DELETE"
            },
        },
        projectUserManage: {
            functionName: "项目成员管理",
            functionCode: "SFMS-PROJECT-USER-MANAGE",
            projectUserAdd: {
                functionName: "项目人员新增",
                functionCode: "SFMS-PROJECT-USER-ADD"
            },
            projectUserEdit: {
                functionName: "项目人员编辑",
                functionCode: "SFMS-PROJECT-USER-EDIT"
            },
            projectUserQuery: {
                functionName: "项目人员查询",
                functionCode: "SFMS-PROJECT-USER-QUERY"
            },
            projectUserDelete: {
                functionName: "项目人员删除",
                functionCode: "SFMS-PROJECT-USER-DELETE"
            },
        },
        projectRemarkManage: {
            functionName: "项目备注管理",
            functionCode: "SFMS-PROJECT-REMARK-MANAGE",
            projectRemarkAdd: {
                functionName: "项目备注新增",
                functionCode: "SFMS-PROJECT-REMARK-ADD"
            },
            projectRemarkQuery: {
                functionName: "项目备注查询",
                functionCode: "SFMS-PROJECT-REMARK-QUERY"
            },
            projectRemarkEdit: {
                functionName: "项目备注修改",
                functionCode: "SFMS-PROJECT-REMARK-EDIT"
            },
            projectRemarkDelete: {
                functionName: "项目备注删除",
                functionCode: "SFMS-PROJECT-REMARK-DELETE"
            },
        },
        financeManage: {
            functionName: "财务管理",
            functionCode: "SFMS-FINANCE-MANAGE",
            financeAdd: {
                functionName: "财务新增",
                functionCode: "SFMS-FINANCE-ADD"
            },
            financeEdit: {
                functionName: "财务编辑",
                functionCode: "SFMS-FINANCE-UPDATE"
            },
            financeQuery: {
                functionName: "财务查询",
                functionCode: "SFMS-FINANCE-QUERY"
            },
            financeDelete: {
                functionName: "财务删除",
                functionCode: "SFMS-FINANCE-DELETE"
            },
            financeCheck: {
                functionName: "财务审核",
                functionCode: "SFMS-FINANCE-CHECK"
            },
            financeCount: {
                functionName: "财务统计",
                functionCode: "SFMS-FINANCE-COUNT"
            },
        },
        KPIManage: {
            functionName: "绩效管理",
            functionCode: "SFMS-KPI-MANAGE",
            KPIAdd: {
                functionName: "绩效新增",
                functionCode: "SFMS-KPI-ADD"
            },
            KPIEdit: {
                functionName: "绩效编辑",
                functionCode: "SFMS-KPI-EDIT"
            },
            KPIQuery: {
                functionName: "绩效查询",
                functionCode: "SFMS-KPI-QUERY"
            },
            KPIDelete: {
                functionName: "绩效删除",
                functionCode: "SFMS-KPI-DELETE"
            },
            KPICheck: {
                functionName: "绩效审核",
                functionCode: "SFMS-KPI-CHECK"
            },
            KPICount: {
                functionName: "绩效统计",
                functionCode: "SFMS-KPI-COUNT"
            },
        },
        SignManage: {
            functionName: "签到记录管理",
            functionCode: "SFMS-SIGN-MANAGE",
            SignLogADD: {
                functionName: "打卡",
                functionCode: "SFMS-SIGN-LOG-ADD"
            },
            SignLogQuery: {
                functionName: "签到记录查询",
                functionCode: "SFMS-SIGN-LOG-QUERY"
            },
            SignLogCount: {
                functionName: "签到记录统计",
                functionCode: "SFMS-SIGN-LOG-COUNT"
            },
        },
    },
    weChat: {
        applicationID: 4,
        applicationName: "微信端",
        infoManage: {
            functionName: "获取信息模块",
            functionCode: "",
            access_tokenGet: {
                functionName: "获取token",
                functionCode: 4001
            },
            customerInfo: {
                functionName: "消费者信息获取",
                functionCode: 4002
            },
            customerList: {
                functionName: "消费者列表获取",
                functionCode: 4003
            },
            customerNextList: {
                functionName: "指定消费者列表获取",
                functionCode: 4004
            }
        }
    }
};


module.exports = functionConfig;