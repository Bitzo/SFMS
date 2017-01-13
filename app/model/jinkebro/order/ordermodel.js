/**
 * @Author: Cecurio
 * @Date: 2017/1/2 19:08
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/1/2 19:08
 * @Function:订单模块
 */
var orderModel = {
    OrderID : 0,
    OrderTime : '',
    PayTime : '',
    DeliveryTime : '',
    PayMethod : 0,
    IsValid : 0,
    IsActive : 0,
    DeliveryUserID : '',
    IsCancel :'',
    CancelTime : '',
    DiscountMoney : '',
    DiscountType : '',
    BizID : '',          /*业务ID，预留的*/
    Memo : '',
    IsCheck : '',        /*是否审核*/
    PDate : '',         /*分区索引*/
    OrderStatus : 0,    /* 1、等待配送 2、配送中 3、配送成功 4、已确认 5、已取消*/
    PK : 'OrderID'
}
// orderModel共17个属性

module.exports = orderModel;