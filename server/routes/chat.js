var moment = require('moment');
var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var async = require('async');
var server = http.createServer(function (req, res) {
}).listen(3001);//创建http服务

var LogoSavePathBase = "./UserLogos/";

console.log('Server running ');
var io = require('socket.io').listen(server);

var online_users = {}; // records online users'socket
io.on('connection', function (socket) {
  console.log("A user connected");
  var account = null;

  // register account with socket
  socket.on('register', function (str) {
    console.log(str.account + "login");
    account = str.account;
    online_users[str.account] = socket;
    db_helper.setOnline(str.account);
    // load friends' avatar
    db_helper.getImgPath(account, function (img_path) {
      socket.emit("login", { 'account': account, 'img_path': img_path });
    })
    // load offline messages
    db_helper.getOfflineMessage(str.account, function (messages) {
      for (var i = 0; i < messages.length; i++) {
        socket.emit('message', { 'from': messages[i].account_from, 'to': messages[i].account_to, 'type': messages[i].type, 'content': messages[i].message, 'time': messages[i].time });
      }
      // clear stored offline messages
      db_helper.clearOfflineMessage(account);
    })


  });

  // sendMessage event
  socket.on('sendMessage', function (str) {
    let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log("(sendMessage) account: " + account + ' to ' + str.to + ' message: ' + str.message + 'time: ' + time);
    // Online
    if (online_users[str.to] !== undefined) {
      console.log("online");
      online_users[str.to].emit('message', { 'from': account, 'to': str.to, 'type': 0, 'content': str.message, 'time': time });
    } else {
      // Offline operation
      console.log("offline");
      db_helper.storeOfflineMessage(account, str.to, 0, str.message, time);
    }

    // update mutual recent contact list
    db_helper.updateRecentList(account, time, str.to, null);
    db_helper.updateRecentList(str.to, time, account, null);
  });

  // sendFile event
  socket.on('sendFile', function (str) {
    let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log("(sendFile) account: " + account + ' to ' + str.to + 'time: ' + time);

    if (!fs.existsSync('./files/' + account)) fs.mkdirSync('./files/' + account);
    if (!fs.existsSync('./files/' + account + '/' + str.to)) fs.mkdirSync('./files/' + account + '/' + str.to);
    // store file
    fs.writeFile('./files/' + account + '/' + str.to + '/' + str.file_name, str.arraybuffer, function (error) {
      if (error) {
        console.log(error);
        console.log('存储失败')
      } else {
        console.log('存储成功')
      }
    });

    // Online
    if (online_users[str.to] !== undefined) {
      console.log("online");
      online_users[str.to].emit('message', { 'from': account, 'to': str.to, 'type': 1, 'content': str.file_name, 'time': time });
    } else {
      // Offline operation
      console.log("offline");
      db_helper.storeOfflineMessage(account, str.to, 1, str.file_name, time);
    }

    // update mutual recent contact list
    db_helper.updateRecentList(account, time, str.to, null);
    db_helper.updateRecentList(str.to, time, account, null);

  });

  // getFile event
  socket.on('getFile', function (str) {
    console.log("getFile called");
    fs.readFile("./files/" + str.from + "/" + str.to + "/" + str.file_name, (err, data) => {
      if (err) throw err;
      online_users[account].emit('getFile', { 'from': str.from, 'to': str.from, 'arraybuffer': data.buffer, 'file_name': str.file_name });
    });
  });

  // disconnect event
  socket.on('disconnect', function () {
    if (account != null) {
      db_helper.setOffline(account, function () {
        online_users[account] = undefined;
        console.log("(disconnect) account: " + account);
      });
    } else {
      console.log("(disconnect) account: undefined");
    }
  });
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/get_recent_list', function (req, res, next) {
  db_helper.getRecentList(req.body.account, function (results) {
    let user;
    for (user in results) {
      var FilePath = LogoSavePathBase + results[user].contact;
      let data = fs.readFileSync(FilePath, (err, data) => {
      });
      results[user].img_path = data;
    }
    res.json(results);
  });
});
module.exports = router;
