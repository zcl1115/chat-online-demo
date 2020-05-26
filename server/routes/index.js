var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});
router.post('/login', function (req, res) {
  db_helper.signIn(req.body.account, req.body.pass, function (status, name, img_path) {
    //status:: 0: verified ; 1:not exists ; 2:verification error
    if (status === 0) {
      res.json({
        status: '0',
        name: name,
        img_path: img_path
      });
      return;
    }
    else if (status === 1) {
      res.json({
        status: '1'
      });
      return;
    }
    else {
      res.json({
        status: '2'
      });
      return;
    }
  });
});
router.post('/signup', function (req, res) {
  var uploadDir = './UserLogos/';
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = uploadDir;
  form.extensions = true;
  form.maxFieldsSize = 2 * 1024 * 1024;
  form.parse(req, function (err, fields, files) {
    console.log(fields);
    var file = files.photo;
    var oldpath = path.normalize(file.path);//返回正确格式的路径
    var newfilename = fields.account;
    var newpath = uploadDir + newfilename;
    //将老的图片路径改为新的图片路径
    fs.rename(oldpath, newpath, function (err) {
      if (err) {
        console.error("改名失败" + err);
      }
      else {
        db_helper.signUp(fields.account, fields.password, fields.name, fields.account, "还没有简介哦!", 0, function (status) {
          // status:: 0:success 1:account exists
          if (status === 0) {
            res.json({
              status: '0'
            })
          } else {
            res.json({
              status: '1'
            })
          }
        });
      }
    });
  });
});
router.post('/load_friends', function (req, res) {
  console.log(req.body.account);
  db_helper.getFriends(req.body.account, function (status, friends) {
    console.log(friends);
    if (status === 0) {
      res.json(friends);
    } else {
      res.json({
        status: 0,
      });
    }
  });
});

module.exports = router;
