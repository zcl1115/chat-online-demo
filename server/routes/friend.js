var express = require('express');
var router = express.Router();
var fs = require('fs');
var LogoSavePathBase = "./UserLogos/";
router.post('/get_contacts', function(req, res, next){
    db_helper.getContacts(req.body.account, function (results) {
        let user;
        for (user in results) {
            console.log(results[user]);
            var FilePath = LogoSavePathBase + results[user].account;
            let data = fs.readFileSync(FilePath, (err, data) => {
            });
            results[user].img_path = data;
        }
        res.json(results);
    });

});
router.post('/update_recent_contacts', function(req, res, next){
    db_helper.updateRecentList(req.body.user_account,req.body.time,req.body.contact_account, function (results) {
        res.json(results);
    });

});
router.post('/get_user', function(req, res, next){
    db_helper.getUser(req.body.account, function (results) {
        let user;
        for (user in results) {
            console.log(results[user]);
            var FilePath = LogoSavePathBase +results[user].account;
            let data = fs.readFileSync(FilePath, (err, data) => {
            });
            results[user].img_path = data;
        }
        res.json(results);
    });

});
router.post('/is_contact', function(req, res, next){
    db_helper.isContact(req.body.user_account,req.body.contact_account, function (status) {
        if(status===0){
            res.json({
                IsContact:true
            });
            return;
        }
        else{
            res.json({
                IsContact:false
            });
            return;
        }
    });

});
router.post('/add_contact', function(req, res, next){
    db_helper.addContact(req.body.user_account,req.body.contact_account,req.body.name, function (results) {
        res.json(results);
    });

});

module.exports = router;
