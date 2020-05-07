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
    connection.connect();
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
    }
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
    }
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
    }
    this.getRecentList = function (account, cb) {
        var sql = 'select recent_chat.contact,user.name,user.img_path,recent_chat.chat_time from user,recent_chat where recent_chat.contact=user.account and recent_chat.account=?';
        connection.query(sql, [account], function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                cb(results);
            }
        });
    }
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
    }
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
    }
    this.clearOfflineMessage = function (account, cb) {
        var sql = 'delete from offline_chat where account_to = ?';
        connection.query(sql, [account], function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                if (cb != null) cb(results);
            }
        });
    }
    this.getOfflineMessage = function (account, cb) {
        var sql = 'select * from offline_chat where account_to = ?';
        connection.query(sql, [account], function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                if (cb != null) cb(results);
            }
        });
    }
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
        })
    }
    this.SetPersonalInfo = (InputData, cb) => {
        let SQLString = 'update user set ';
        let SQLParam = [];
        let Mark = false;
        let ReturnData = {
            Status: false
        };

        if (InputData.NewName != undefined) {
            SQLString += 'name = ?'
            SQLParam.push(InputData.NewName)
            Mark = true
        }
        if (InputData.NewIntroduction != undefined) {
            if (Mark) {
                SQLString += ', '
            }

            SQLString += 'personal_profile = ?'
            SQLParam.push(InputData.NewIntroduction)
        }

        SQLString += ' where account = ?'
        SQLParam.push(InputData.UserID)

        connection.query(SQLString, SQLParam, (err, results) => {
            if (!err && results.affectedRows == 1) {
                ReturnData.Status = true;
            }

            if (cb) {
                cb(ReturnData);
            }
        })
    }
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
        })
    }
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
        })
    }
    this.getContacts = function (account, cb) {
        var sql = 'select account,name,img_path,personal_profile from user where account in (select contact_account from contact where user_account =?);';
        connection.query(sql, [account], function (err, results) {
            if (err) {
                console.log(err.message);
            }
            else {

                cb(results);
            }
        });
    }
}
module.exports = DB_helper;
