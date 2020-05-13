var moment = require('moment');
var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
const readline = require('readline');
const _path = require('path');
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

    let path;
    //存放消息记录
    if (!fs.existsSync('./ChatHistory/' + account + " " + str.to) &&
        !fs.existsSync('./ChatHistory/' + str.to + " " + account))
    {
      fs.mkdirSync('./ChatHistory/' + account + " " + str.to);
    }

    if (fs.existsSync('./ChatHistory/' + account + " " + str.to))
    {
      path = './ChatHistory/' + account + " " + str.to;
    }

    if (fs.existsSync('./ChatHistory/' + str.to + " " + account))
    {
      path = './ChatHistory/' + str.to + " " + account;
    }

    let chat_date = moment(Date.now()).format('YYYY-MM-DD');
    let chat_time = moment(Date.now()).format('HH:mm:ss');
    //文件夹命名为用户a账号 用户b账号,则三个标志位分别为a对该信息的删除情况,b对该信息的删除情况,该信息是消息还是文件
    let message = "0 " + "0 " + "0 " + chat_time + " " + account + " " + str.to + " " + str.message + '\n';
    fs.writeFile(path + '/' + chat_date + '.txt', message, { 'flag': 'a' }, function (error) {
      if (error) {
        console.log('存储失败')
      } else {
        console.log('存储成功')
      }
    });

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
  
//发送申请
  socket.on('sendApplication', function (str) {
    var time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log("(sendApplication) account: " + account + ' to ' +str.to + ' message: ' + str.message + 'time: ' +  time);
    // Online
    if(online_users[str.to] !== undefined){
      console.log("online");
      online_users[str.to].emit('application',{'from':account, 'to': str.to, 'type': -1, 'content':str.message, 'time': time});
    }else{
      // Offline operation
      console.log("offline");
      db_helper.storeOfflineMessage(account, str.to, -1, str.message, time);
    }


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

router.post('/search', function (req, res, next) {
  var flag_pos;
  var account = req.body.account;
  var contact = req.body.contact;
  var date = req.body.date;
  let path;
  //寻找存放消息记录路径

  var list_map = new Array();

  if (fs.existsSync('./ChatHistory/' + account + " " + contact))
  {
    path = './ChatHistory/' + account + " " + contact;
    flag_pos = 0;
  }

  if (fs.existsSync('./ChatHistory/' + contact + " " + account))
  {
    path = './ChatHistory/' + contact + " " + account;
    flag_pos = 1;
  }

  let filepath = _path.join(path, date + '.txt');
  let input = fs.createReadStream(filepath);
  input.on('error',function(err){
    res.json({
      status: false
    })
  });
  const rl = readline.createInterface({
    input: input
  });
  rl.on('line', (line) => {
    var b = ((line.toString()).split(" "));
    if (b[flag_pos]==="0"){
      list_map.push({
        type: b[2],
        time: date + " " + b[3],
        from: b[4],
        to: b[5],
        message: b[6]
      })
    }
  });
  rl.on('close', (line) => {
    res.json({
      status: true,
      chat_history_list: list_map
    })
  });

});

router.post('/search_key', function (req, res, next) {
  var flag_pos;
  var account = req.body.account;
  var contact = req.body.contact;
  var start_date = req.body.start_date;
  var end_date = req.body.end_date;
  var key_word = req.body.key_word;
  var date_list = new Array();
  var end = new Date(end_date).getTime();
  for (var start = new Date(start_date).getTime();start <= end; start += 3600 * 1000 * 24){
    let time = moment(new Date(start)).format('YYYY-MM-DD');
    date_list.push(time);
  }
  let path;
  //寻找存放消息记录路径

  var list_map = new Array();

  if (fs.existsSync('./ChatHistory/' + account + " " + contact))
  {
    path = './ChatHistory/' + account + " " + contact;
    flag_pos = 0;
  }

  if (fs.existsSync('./ChatHistory/' + contact + " " + account))
  {
    path = './ChatHistory/' + contact + " " + account;
    flag_pos = 1;
  }
  //查询结果中是否有错误以及是否全部读取完成
  var error_flag = false;
  var read_sum = date_list.length;
  for (let date in date_list){
    let filepath = _path.join(path, date_list[date] + '.txt');
    let input = fs.createReadStream(filepath);
    input.on('error',function(err){
      error_flag = true;
      read_sum --;
    });
    const rl = readline.createInterface({
      input: input
    });
    rl.on('line', (line) => {
      var b = ((line.toString()).split(" "));
      if (b[flag_pos]==="0"){
        if (b[6].search(key_word)!==-1){
          list_map.push({
            type: b[2],
            time: date_list[date] + " " + b[3],
            from: b[4],
            to: b[5],
            message: b[6]
          });
        }
      }
    });
    rl.on('close', (line) => {
      read_sum --;
      if (read_sum === 0){
        if (error_flag){
          res.json({
            //status: false,
            chat_history_list: list_map
          })
        }else{
          res.json({
            //status: true,
            chat_history_list: list_map
          })
        }
      }
    });
  }

});

router.post('/delete', function (req, res, next) {
  var flag_pos;
  var account = req.body.account;
  var contact = req.body.contact;
  var date = req.body.date;
  let path;
  //寻找存放消息记录路径
  var temp = ((date.toString()).split(" "));
  date = temp[0];
  var time = temp[1];
  if (fs.existsSync('./ChatHistory/' + account + " " + contact))
  {
    path = './ChatHistory/' + account + " " + contact;
    flag_pos = 0;
  }

  if (fs.existsSync('./ChatHistory/' + contact + " " + account))
  {
    path = './ChatHistory/' + contact + " " + account;
    flag_pos = 1;
  }

  var fWriteName = path + '/temp.txt';
  let filepath = _path.join(path, date + '.txt');
  let input = fs.createReadStream(filepath);
  var fWrite = fs.createWriteStream(fWriteName);
  input.on('error',function(err){
    res.json({
      status: false
    })
  });
  const rl = readline.createInterface({
    input: input
  });
  rl.on('line', (line) => {
    var b = ((line.toString()).split(" "));
    if (b[flag_pos]==="0" && b[3]===time){
      b[flag_pos]="1";
      line = b[0] + " " + b[1] + " " + b[2] + " " + b[3] + " " + b[4] + " " + b[5] + " " + b[6];
    }
    fWrite.write(line.toString() + '\n');
  });
  rl.on('close', (line) => {
    fs.unlinkSync(path + '/' + date + '.txt');
    fs.rename(fWriteName,path + '/' + date + '.txt',function(err){
    });
    res.json({
      status: true,
    })
  });

});
module.exports = router;
