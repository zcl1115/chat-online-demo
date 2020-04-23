var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.post('/login', function(req, res) {
  db_helper.signIn(req.body.account,req.body.pass,function (status,name,img_path) {
    //status:: 0: verified ; 1:not exists ; 2:verification error
    if(status === 0){
      res.json({
              status:'0',
              name: name,
              img_path: img_path
            });
      return;
    }
    else if(status === 1){
      res.json({
              status:'1'
            });
      return;
    }
    else {
      res.json({
        status:'2'
      });
      return;
    }
  });
});
router.post('/sign_up', function(req, res) {
  db_helper.signUp(req.body.account, req.body.pass, req.body.name, req.body.img_url, "还没有简介哦!", 0, function (status) {
    // status:: 0:success 1:account exists
    if(status === 0){
      res.json({
            status:'0'
          })
    }else{
      res.json({
        status:'1'
      })
    }
  });
});
router.post('/load_friends', function(req, res) {
  console.log(req.body.account);
  db_helper.getFriends(req.body.account,function (status, friends) {
    console.log(friends);
    if(status === 0){
      res.json(friends);
    }else{
      res.json({
        status:0,
      })
    }
  });
});

module.exports = router;
