/**
 * @Author: Cecurio
 * @Date: 2016/12/14 20:25
 * @Last Modified by: Cecurio
 * @Last Modified time: 2016/12/14 20:25
 * @Function: 商品模型
 */
var productmodel = {
    ProductID : 0,       //商品ID
    SKU : '',            //Stock Keeping Unit(库存量单位)
    ProductName : '',    //商品名称
    ProductDesc : '',    //商品描述
    ProductImgPath : '', //商品图片路径
    ExpireTime : '',     //有效期
    ProducTime : '',     //生产日期
    SupplierID : 0,      //SupplierID
    ProductTypeID : 0,   //ProductTypeID
    PK : 'ProductID',
    snackExpTime: 1296000 //即15*24*60*60秒
};

module.exports = productmodel;