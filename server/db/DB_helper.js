const SQLConfig = {
    host: 'localhost',
    user: 'root',
    password: 'zheng1998',
    database: 'test',
    timezone: "08:00",
    charset: 'UTF8MB4_GENERAL_CI'
};
const SQLConfig2 = {
    host: 'localhost',
    user: 'rjgc',
    password: 'rjgc123',
    database: 'seproject',
    timezone: "08:00",
    charset: 'UTF8MB4_GENERAL_CI'
};

function DB_helper() {
    var mysql = require('mysql');
    var connection = mysql.createConnection(SQLConfig2);
    connection.connect(function(err){
        if(err){
            console.log("connection failed!");
            throw(err);
        }
    });
    this.isAcoountExist = function (account, cb) {
        var sql = 'SELECT count(*) AS exist FROM user where account = ?';
        var SqlParams = [account];
        connection.query(sql, SqlParams, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            console.log(result[0].exist === 1);
            if (cb != null) return cb(result[0].exist === 1);
        });
    };
    this.signUp = function (account, password, name, img_url, personal_profile, online_status, cb) {
        var sql = 'INSERT INTO user ' +
            '(account, password, name, img_path, personal_profile, online_status ) ' +
            'values(?, ?, ?, ?, ?, ?);';
        var SqlParams = [account, password, name, img_url, personal_profile, online_status];

        var status = 0;
        if (this.isAcoountExist(account, function (isExist) {
            if (isExist) {
                status = 1;
                if (cb != null) return cb(status);
            } else {
                status = 0;
                connection.query(sql, SqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    if (cb != null) return cb(status);
                });
            }
        }));
    };
    this.isOnline = function (account, cb) {
        var sql = 'SELECT online_status FROM user where account = ?';
        var SqlParams = [account];
        connection.query(sql, SqlParams, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            if (cb != null) return cb(result.length !== 0 && result[0].online_status === 1);
        });
    };
    this.setOnline = function (account, cb) {
        var modSql = 'UPDATE user SET online_status = 1 WHERE account = ?';
        var modSqlParams = [account];
        connection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            if (cb != null) return cb(result);
        });
    };
    this.setOffline = function (account, cb) {
        var modSql = 'UPDATE user SET online_status = 0 WHERE account = ?';
        var modSqlParams = [account];
        connection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            if (cb != null) return cb(result);
        });
    };
    this.createTables=function () {
        var sql="CREATE TABLE IF NOT EXISTS `user`(\n" +
            "   `account` VARCHAR(20) NOT NULL,\n" +
            "   `password` VARCHAR(12) NOT NULL,\n" +
            "   `name` VARCHAR(20) NOT NULL,\n" +
            "   `img_path` TEXT,\n" +
            "   `personal_profile` VARCHAR(64) DEFAULT '还没有简介哦!',\n" +
            "   `online_status` int DEFAULT 0, \n" +
            "   PRIMARY KEY ( `account` )\n" +
            ");";
        connection.query(sql,function (err) {
            if(err){
                console.log("[CREATE TABLE ERROR - ]",err.message);
                return;
            }
        });
        sql="CREATE TABLE IF NOT EXISTS `recent_chat`(\n" +
            "   `account` VARCHAR(20) NOT NULL,\n" +
            "   `chat_time` DATETIME,\n" +
            "   `contact` VARCHAR(20) NOT NULL,\n" +
            "   PRIMARY KEY ( `account` , `contact`),\n" +
            "   FOREIGN KEY (`account`) REFERENCES `user`(`account`) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
            "   FOREIGN KEY (`contact`) REFERENCES `user`(`account`) ON DELETE CASCADE ON UPDATE CASCADE\n" +
            ");";
        connection.query(sql,function (err) {
            if(err){
                console.log("[CREATE TABLE ERROR - ]",err.message);
                return;
            }
        });
        sql="CREATE TABLE IF NOT EXISTS `chat_history`(\n" +
            "   `chat_id` int NOT NULL AUTO_INCREMENT,\n" +
            "   `account` VARCHAR(20) NOT NULL,\n" +
            "   `start_time` DATE,\n" +
            "   `end_time` DATE,\n" +
            "   `save_path` TEXT,\n" +
            "   PRIMARY KEY ( `chat_id` )\n" +
            ");";
        connection.query(sql,function (err) {
            if(err){
                console.log("[CREATE TABLE ERROR - ]",err.message);
                return;
            }
        });
        sql="CREATE TABLE IF NOT EXISTS `offline_chat`(\n" +
            "   `account_from` VARCHAR(20) NOT NULL,\n" +
            "   `account_to` VARCHAR(20) NOT NULL,\n" +
            "   `time` DATETIME,\n" +
            "   `type` int default 0,\n" +
            "   `message` TEXT character set utf8mb4,\n" +
            "   FOREIGN KEY (`account_from`) REFERENCES `user`(`account`) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
            "   FOREIGN KEY (`account_to`) REFERENCES `user`(`account`) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
            "   PRIMARY KEY ( `account_from`, `account_to`, `time` )\n" +
            ");";
        connection.query(sql,function (err) {
            if(err){
                console.log("[CREATE TABLE ERROR - ]",err.message);
                return;
            }
        });
        sql="CREATE TABLE IF NOT EXISTS `contact`(\n" +
            "   `user_account` VARCHAR(20) NOT NULL,\n" +
            "   `contact_account` VARCHAR(20) NOT NULL,\n" +
            "   `name` VARCHAR(20) NOT NULL,\n" +
            "   PRIMARY KEY ( `user_account`, `contact_account`)\n" +
            ");";
        connection.query(sql,function (err) {
            if(err){
                console.log("[CREATE TABLE ERROR - ]",err.message);
                return;
            }
        });
        sql="CREATE TABLE IF NOT EXISTS `request`(\n" +
            "   `request_id` INT PRIMARY KEY AUTO_INCREMENT,\n" +
            "   `account` VARCHAR(20) NOT NULL,\n" +
            "   `contact_account` VARCHAR(20) NOT NULL,\n" +
            "   `content` VARCHAR(64) DEFAULT '空',\n" +
            "   `time` DATETIME, \n" +
            "   `status` int default 0,\n"+
            "   FOREIGN KEY (`account`) REFERENCES `user`(`account`) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
            "   FOREIGN KEY (`contact_account`) REFERENCES `user`(`account`) ON DELETE CASCADE ON UPDATE CASCADE\n" +
            ");";
        connection.query(sql,function (err) {
            if(err){
                console.log("[CREATE TABLE ERROR - ]",err.message);
                return;
            }
        });

    };
    this.setAllOffline = function (account, cb) {

        var modSql = 'UPDATE user SET online_status = 0';
        connection.query(modSql, null, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            if (cb != null) return cb(result);
        });
    };
    this.updatePassword = function (account, password, cb) {
        var modSql = 'UPDATE user SET password = ? WHERE account = ?';
        var modSqlParams = [password, account];
        connection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            if (cb != null) return cb(result);
        });
    };
    this.signIn = function (account, password, cb) {
        var sql = 'SELECT * FROM user where account = ?';
        var SqlParams = [account, password];
        connection.query(sql, SqlParams, function (err, result) {
            console.log(result);
            if (err) {
                console.log(err.message);
                return;
            }
            var status;
            var name;
            var img_path;
            console.log("pwd:" + password);
            if (result.length === 0) {
                status = 1;
            } else if (result[0].password === password) {
                status = 0;
                name = result[0].name;
                img_path = result[0].img_path;
            } else {
                status = 2;
            }
            console.log(status);
            console.log(name);
            if (cb != null) return cb(status, name, img_path);
        });
    };
    this.getImgPath = function (account, cb) {
        var sql = 'SELECT img_path FROM user where account = ?';
        var SqlParams = [account];
        connection.query(sql, SqlParams, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            if (cb != null) {
                if (result.length === 0) return cb('');
                else return cb(result[0].img_path);
            }
        });
    };
    this.getFriends = function (account, cb) {
        var sql = 'select account, name, img_path from user where account in (select contact_account from contact where user_account = ?);';
        connection.query(sql, [account], function (err, results) {
            console.log(results);
            if (err) {
                console.log(err.message);
                return;
            }
            var status;
            var friends;
            if (results.length > 0) {
                status = 0;
                friends = results;
            } else {
                status = 1;
                friends = {};
            }
            cb(status, friends);

        });
    };
    this.getRecentList = function (account, cb) {
       var sql = 'select recent_chat.contact,contact.name,user.img_path,recent_chat.chat_time from user,recent_chat,contact where recent_chat.contact=user.account and recent_chat.contact=contact.contact_account and recent_chat.account=?';
        connection.query(sql, [account], function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                cb(results);
            }
        });
    };
    this.updateRecentList = function (account, time, contact, cb) {
        var modSql = 'INSERT INTO recent_chat(account, chat_time, contact) VALUES (?,?,?) ON DUPLICATE KEY UPDATE chat_time = ?;\n';
        var modSqlParams = [account, time, contact, time];
        connection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            if (cb != null) return cb(result);
        });
    };
    this.delRecentList = function (account, contact_account, cb) {
        var modSql = 'DELETE FROM recent_chat WHERE (account=? AND contact=?) OR (account=? AND contact=?);';
        var modSqlParams = [account,contact_account,contact_account,account];
        connection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log(err.message);
            }
            else{
                if (cb != null) return cb(result);
            }

        });
    };
    this.storeOfflineMessage = function (account_from, account_to, type, message, time, cb) {
        var sql = 'INSERT INTO offline_chat ' +
            '(account_from, account_to, type, message, time) ' +
            'values(?, ?, ?, ?, ?);';
        var SqlParams = [account_from, account_to, type, message, time];
        connection.query(sql, SqlParams, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            if (cb != null) return cb();
        });
    };
    this.clearOfflineMessage = function (account, cb) {
        var sql = 'delete from offline_chat where account_to = ?';
        connection.query(sql, [account], function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                if (cb != null) cb(results);
            }
        });
    };
    this.getOfflineMessage = function (account, cb) {
        var sql = 'select * from offline_chat where account_to = ?';
        connection.query(sql, [account], function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                if (cb != null) cb(results);
            }
        });
    };
    this.GetPersonalInfo = (InputData, cb) => {
        let SQLString = 'select * from user where account = ?';
        let SQLParam = [InputData.UserID];
        let ReturnData = {
            Status: false
        };

        connection.query(SQLString, SQLParam, (err, results) => {
            if (!err && results.length == 1) {
                ReturnData.Status = true;
                ReturnData.UserName = results[0].name;
                ReturnData.UserIntroduction = results[0].personal_profile;
            }

            if (cb) {
                cb(ReturnData);
            }
        });
    };
    this.SetPersonalInfo = (InputData, cb) => {
        let SQLString = 'update user set ';
        let SQLParam = [];
        let Mark = false;
        let ReturnData = {
            Status: false
        };

        if (InputData.NewName != undefined) {
            SQLString += 'name = ?';
            SQLParam.push(InputData.NewName);
            Mark = true;
        }
        if (InputData.NewIntroduction != undefined) {
            if (Mark) {
                SQLString += ', ';
            }

            SQLString += 'personal_profile = ?';
            SQLParam.push(InputData.NewIntroduction);
        }

        SQLString += ' where account = ?';
        SQLParam.push(InputData.UserID);

        connection.query(SQLString, SQLParam, (err, results) => {
            if (!err && results.affectedRows == 1) {
                ReturnData.Status = true;
            }
            if (cb) {
                cb(ReturnData);
            }
        });
    };
    this.SetPassword = (InputData, cb) => {
        let SQLString = 'update user set password = ? where account = ?';
        let SQLParam = [InputData.NewPassword, InputData.UserID];
        let ReturnData = {
            Status: false
        };

        connection.query(SQLString, SQLParam, (err, results) => {
            if (!err && results.affectedRows == 1) {
                ReturnData.Status = true;
            }

            if (cb) {
                cb(ReturnData);
            }
        });
    };
    this.SetLoginStatus = (InputData, cb) => {
        let SQLString = 'update user set online_status = ? where account = ?';
        let SQLParam = [InputData.LoginStatus, InputData.UserID];
        let ReturnData = {
            Status: false
        };

        connection.query(SQLString, SQLParam, (err, results) => {
            if (!err && results.affectedRows == 1) {
                ReturnData.Status = true;
            }

            if (cb) {
                cb(ReturnData);
            }
        });
    };
    this.getContacts = function (account, cb) {
        var sql = 'select account,user.name as u_name,img_path,personal_profile,contact.name as f_name from user,contact where contact.user_account=?and user.account=contact.contact_account;';
        connection.query(sql, [account], function (err, results) {
            if (err) {
                console.log(err.message);
            }
            else{
                cb(results);}
        });
    };
     this.getUser = function (account, cb) {
         var sql = 'select account,name as f_name,name as u_name,img_path,personal_profile from user where account =?;';
        connection.query(sql, [account], function (err, results) {
            console.log(results);
            if (err) {
                console.log(err.message);
            }
            else{
                cb(results);}
        });
    };
    this.isContact = function (user_account,contact_account, cb) {
        var sql = 'select contact_account from contact where user_account =?and contact_account=?;';
        let SQLParam=[user_account,contact_account];
        connection.query(sql, SQLParam, function (err, results) {
            if (err) {
                console.log(err.message);
            }
            else{
                var status=results.length;
                cb(status);
            }
        });
    };
    this.addContact = function (user_account,contact_account,name,cb) {
         var sql = 'INSERT INTO contact ' +
            '(user_account,contact_account,name) ' +
            'values(?, ?, ?);';

        let SQLParam=[user_account,contact_account,name];
        connection.query(sql, SQLParam, function (err, results) {
            if (err) {
                console.log(err.message);
            }
            else{
                cb(results);
            }
        });
    };
    //发送好友申请
    this.addRequest=function (account,contact_account,content,time,cb) {
        var sql ="INSERT INTO request"+
            '(account,contact_account,content,time,status)'+
            'value(?,?,?,?,?)';
        let SQLParam=[account,contact_account,content,time,0];
        var status=0;
        connection.query(sql, SQLParam, function (err, results) {
            if (err) {
                console.log(err.message);
                status=-1;
                cb(status);
            }
            else
            {
                cb(status);
            }
        });
    };
    //获取申请列表
    this.getApplicationList=function (account,cb) {
        //发给acoount的
        var sql="select user.name,user.account,user.personal_profile,request.content,request.status,request.request_id " +
            "from request left join user on request.account=user.account where contact_account =?";
        let SQLParam=[account];
        connection.query(sql, SQLParam, function (err, results) {
            if (err) {
                console.log(err.message);
            }
            else{
                cb(results);
            }
        });
    };
    //改变状态
    this.changeApplicationList=function (account,contact_account,status,cb) {
        //发给acoount的
        var sql="UPDATE request SET status=? WHERE account=? AND contact_account=? AND status=0;";
        let SQLParam=[status,account,contact_account];
        connection.query(sql, SQLParam, function (err, results) {
            if (err) {
                console.log(err.message);
            }
            else{
                cb(results);
            }
        });

    };

    this.changeRefuseApplication=function (id,status,cb) {

        var sql="UPDATE request SET status=? WHERE request_id=?;";
        let SQLParam=[status,id];
        connection.query(sql, SQLParam, function (err, results) {
            if (err) {
                console.log(err.message);
            }
            else{
                cb(results);
            }
        });

    }
    this.delContact=function (account,contact_account,cb) {
        //发给acoount的
        var sql="DELETE FROM contact WHERE user_account=? and contact_account=?";
        var sql1="UPDATE request SET status=3 WHERE account=? AND contact_account=? AND status!=2";
        let SQLParam=[account,contact_account];
        let SQLParam1=[contact_account,account];
        connection.query(sql, SQLParam, function (err, results) {
            if (err) {
                console.log(err.message);
            }
        });
        connection.query(sql, SQLParam1, function (err, results) {
            if (err) {
                console.log(err.message);
            }

        });
        connection.query(sql1, SQLParam1, function (err, results) {
            if (err) {
                console.log(err.message);
            }
            else{
                cb(results);
            }
        });

    }
    this.getContact = function (user_account,str, cb) {
        var sql = 'select account,user.name as u_name,img_path,personal_profile,contact.name as f_name from user,contact where contact.user_account=?and user.account=contact.contact_account and (contact.name=? or user.name=? or user.account=?);';
        let SQLParam=[user_account,str,str,str];
        connection.query(sql, SQLParam, function (err, results) {
            if (err) {
                console.log(err.message);
            }
            else{
                cb(results);}
        });
    }
}
module.exports = DB_helper;
