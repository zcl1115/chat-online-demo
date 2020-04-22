// Import Module
var DB_helper = require("./DB_helper");
var Path = require("path");

// Config
var PORT = 80;

// Initialization app
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res){
    res.sendFile(Path.dirname(__dirname) + '/index_local.html');
});

// Initialization DB_helper
var db_helper = new DB_helper();
db_helper.setAllOffline(); // when server starts all users must be offline

var online_users = {};
io.on('connection', function (socket) {
    console.log("A user connected");
    var account = null;

    // signUp event
    socket.on('signUp',function (str) {
        /*var newUser = new User();
        Object.assign(newUser, JSON.parse(str));
        Object.setPrototypeOf(newUser, User.prototype);*/
        console.log("Begin: (sign up) account: " + str.account);

        // isExist
        db_helper.isAcoountExist(str.account,function (result) {
            if(result){
                console.log("End: (signUp fails) account: " + str.account + " exists !");
                socket.emit('signUp_res',{'status':false, 'message': 'account exists'});
            }
            else {
                db_helper.signUp(str.account, str.password, str.name,function (result) {
                    console.log("End: (signUp succeeds) account: " + str.account);
                    socket.emit('signUp_res',{'status':true, 'message': 'sign up successfully'});
                })
            }
        })
    });

    // signIn event
    socket.on('signIn',function (str) {
        // register on server
        online_users[str.account] = socket;
        // check if already online first and then verify account and password
        console.log("Begin: (sign in) account: " + str.account);
        db_helper.isOnline(str.account,function (result) {
            if(result){
                console.log("End: (signIn fails) account: " + str.account + " already online");
                socket.emit('signIn_res',{'status':false, 'message':'already online'});
            }else{
                db_helper.signIn(str.account, str.password,function (result) {
                    if(result){
                        console.log("End: (signIn succeeds) account: " + str.account);
                        db_helper.setOnline(str.account);
                        socket.emit('signIn_res',{'status':true, 'message':'sign in successfully'});
                        account = str.account;
                    }else{
                        console.log("End: (signIn fails) account: " + str.account + " verification failure");
                        socket.emit('signIn_res',{'status':false, 'message':'verification failure'});
                    }
                })
            }
        })
    });

    // signOut event
    socket.on('signOut', function () {
        if(account != null){
            console.log("Begin: (signOut) account: " + account);
            db_helper.setOffline(account,function () {
                console.log("End: (signOut) account: " + account);
                socket.emit('signOut_res',{'status':true, 'message':'sign out successfully'});
                online_users[account] = undefined;
                account = null;
            });
        }else{
            socket.emit('signOut_res',{'status':false, 'message':'not signed in'});
        }
    });

    // sendMessage event
    socket.on('sendMessage', function (str) {
        console.log("Begin: (sendMessage) account: " + account);
        // Online
        if(online_users[str.to]){
            online_users[str.to].emit('message',{'from':account, 'message':str.message});
            socket.emit('sendMessage_res',{'status':true});
        }else{
            socket.emit('sendMessage_res',{'status':false});
        }
        console.log("End: (sendMessage) account: ");
        // Offline operation
    });

    // updatePassword event
    socket.on('updatePassword', function (str) {
        console.log("Begin: (updatePassword) account: " + account);
        console.log(str);
        if(account == null){
            socket.emit('updatePassword_res',{'status':false,'message':'not signed in yet'});
            console.log("End: (updatePassword) not signed in yet");
        }else{
            db_helper.signIn(account,str.old_password,function (result) {
                if(result){
                    db_helper.updatePassword(account, str.new_password);
                    socket.emit('updatePassword_res',{'status':true,'message':'update password successfully'});
                }else{
                    socket.emit('updatePassword_res',{'status':false,'message':'incorrect old password'});
                }
            });
            console.log("End: (updatePassword) successfully");
        }
    });

    // disconnect event
    socket.on('disconnect', function () {
        console.log("Begin: (disconnect)");
        if(account != null)
        {
            db_helper.setOffline(account,function () {
                online_users[account] = undefined;
                console.log("End: (disconnect) account: " + account);
            });
        }else{
            console.log("End: (disconnect)");
        }
    });


});

http.listen(PORT);
console.log("listening port:" + PORT);