// provide db interface
// Necessary Modules
// var User = require("./User");
function DB_helper(){
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'test',
        timezone : "08:00",
        charset  :'UTF8MB4_GENERAL_CI'
    });
    connection.connect();
    this.isAcoountExist = function (account, cb) {
        var sql = 'SELECT count(*) AS exist FROM user where account = ?';
        var SqlParams = [account];
        connection.query(sql, SqlParams,function (err, result) {
            if(err){
                console.log(err.message);
                return;
            }
            console.log(result[0].exist === 1);
            if(cb != null ) return cb(result[0].exist === 1);
        });
    };
    this.signUp = function (account, password, name, img_url, personal_profile, online_status, cb) {
        var sql = 'INSERT INTO USER ' +
            '(account, password, name, img_path, personal_profile, online_status ) ' +
            'values(?, ?, ?, ?, ?, ?);';
        var SqlParams = [account, password, name, img_url, personal_profile, online_status];

        var status = 0;
        if(this.isAcoountExist(account, function (isExist) {
            if(isExist){
                status = 1;
                if(cb != null ) return cb(status);
            }else{
                status = 0;
                connection.query(sql,SqlParams,function (err, result) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }
                    if(cb != null ) return cb(status);
                });
            }
        }));
    };
    this.isOnline = function (account, cb) {
        var sql = 'SELECT online_status FROM user where account = ?';
        var SqlParams = [account];
        connection.query(sql, SqlParams,function (err, result) {
            if(err){
                console.log(err.message);
                return;
            }
            if(cb != null ) return cb(result.length !==0 && result[0].online_status === 1);
        });
    };
    this.setOnline = function (account, cb) {
        var modSql = 'UPDATE user SET online_status = 1 WHERE account = ?';
        var modSqlParams = [account];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
            if(cb != null) return cb(result);
        });
    };
    this.setOffline = function (account, cb) {
        var modSql = 'UPDATE user SET online_status = 0 WHERE account = ?';
        var modSqlParams = [account];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
            if(cb != null ) return cb(result);
        });
    };
    this.setAllOffline = function (account, cb) {
        var modSql = 'UPDATE user SET online_status = 0';
        connection.query(modSql,null,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
            if(cb != null ) return cb(result);
        });
    };
    this.updatePassword = function (account, password, cb) {
        var modSql = 'UPDATE user SET password = ? WHERE account = ?';
        var modSqlParams = [password, account];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
            if(cb != null) return cb(result);
        });
    };
    this.signIn = function (account, password, cb) {
        var sql = 'SELECT * FROM user where account = ?';
        var SqlParams = [account, password];
        connection.query(sql, SqlParams,function (err, result) {
            console.log(result);
            if(err){
                console.log(err.message);
                return;
            }
            var status;
            var name;
            console.log("pwd:" + password);
            if(result.length === 0){
                status = 1;
            }else if (result[0].password === password){
                status = 0;
                name = result[0].name;
            }else{
                status = 2;
            }
            console.log(status);
            console.log(name);
            if(cb != null ) return cb(status, name);
        });
    }
    this.getImgPath = function (account, cb) {
        var sql = 'SELECT img_path FROM user where account = ?';
        var SqlParams = [account];
        connection.query(sql, SqlParams,function (err, result) {
            if(err){
                console.log(err.message);
                return;
            }
            if(cb != null )
            {
                if(result.length === 0) return cb('');
                else return cb(result[0].img_path);
            }
        });
    }
    this.getFriends = function (account, cb) {
        var sql='select account, name, img_path from user where account in (select contact_account from contact where user_account = ?);';
        connection.query(sql,[account],function (err,results){
            console.log(results);
            if (err) {
                console.log(err.message);
                return;
            }
            var status;
            var friends;
            if(results.length > 0){
                status = 0;
                friends = results;
            }else{
                status = 1;
                friends = {};
            }
            cb(status, friends);

        });
    }
    this.getRecentList = function (account, cb) {
        var sql='select recent_chat.contact,user.name,user.img_path,recent_chat.chat_time from user,recent_chat where recent_chat.contact=user.account and recent_chat.account=?';
        connection.query(sql,[account],function (err,results){
            if (err) {
                console.log(err.message);
            }
            else{
                cb(results);
            }
        });
    }
    this.updateRecentList = function (account, time, contact, cb) {
        var modSql = 'INSERT INTO recent_chat(account, chat_time, contact) VALUES (?,?,?) ON DUPLICATE KEY UPDATE chat_time = ?;\n';
        var modSqlParams = [account, time, contact, time];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
            if(cb != null) return cb(result);
        });
    }
    this.storeOfflineMessage = function (account_from, account_to, type, message, time, cb) {
        var sql = 'INSERT INTO offline_chat ' +
            '(account_from, account_to, type, message, time) ' +
            'values(?, ?, ?, ?, ?);';
        var SqlParams = [account_from, account_to, type, message, time];
        connection.query(sql,SqlParams,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            if(cb != null ) return cb();
        });
    }
    this.clearOfflineMessage = function (account, cb) {
        var sql='delete from offline_chat where account_to = ?';
        connection.query(sql,[account],function (err,results){
            if (err) {
                console.log(err.message);
            }
            else{
                if(cb != null ) cb(results);
            }
        });
    }
    this.getOfflineMessage = function (account, cb) {
        var sql='select * from offline_chat where account_to = ?';
        connection.query(sql,[account],function (err,results){
            if (err) {
                console.log(err.message);
            }
            else{
                if(cb != null ) cb(results);
            }
        });
    }
}
module.exports = DB_helper;
