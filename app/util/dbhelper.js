/**
 * 生成插入某表的sql语句
 * @param {string} tbname 要插入的表名
 * @param {object} obj 要插入的列的对象集合
 * @return {string} 生成的sql语句
 */
exports.generateInsertCommonSql = function(tbname, obj) {
    var insertSql = 'insert into ' + tbname + ' set ';
    var sql = '';

    if (tbname == undefined || obj == undefined || obj.length == 0) {
        return sql;
    }

    for (var key in obj) {
        if (sql.length == 0) {
            if (!isNaN(obj[key])) {
                sql += " " + key + " = " + obj[key] + " ";
            } else {
                sql += " " + key + " = '" + obj[key] + "' ";
            }
        } else {
            if (!isNaN(obj[key])) {
                sql += ", " + key + " = " + obj[key] + " ";
            } else {
                sql += ", " + key + " = '" + obj[key] + "' ";
            }
        }
    }

    return insertSql += sql + ';';
}