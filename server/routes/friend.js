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
router.post('/get_contact', function(req, res, next){
    db_helper.getContact(req.body.user_account, req.body.str,function (results) {
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
router.post('/get_app', function(req, res, next){
    //var i=req.body
    db_helper.getApplicationList(req.body.account, function (result) {
        var list=[];
        for(var i=0;i<result.length;i++){
            var tem={};
            tem.name=result[i].name;
            tem.account=result[i].account;
            tem.personal_profile=result[i].personal_profile;
            tem.content=result[i].content;
            tem.id=result[i].request_id;
            if(result[i].status==0)
                tem.status="待处理";
            else if(result[i].status==1)
                tem.status="添加成功";
            else if(result[i].status==2)
                tem.status="已拒绝";
            else if(result[i].status==3)
                tem.status="已过期";
            var FilePath = LogoSavePathBase +result[i].account;
            let data = fs.readFileSync(FilePath, (err, data) => {
            });
            tem.img_path = data;
            list.push(tem);
        }
        list.reverse();
        res.json(list);
    })

});
router.post('/change_status', function(req, res, next){
    //var i=req.body
    db_helper.changeApplicationList( req.body.contact_account,req.body.user_account,req.body.status,function (result) {

    })

});
router.post('/get_status', function(req, res, next){

    db_helper.getAplicationStatus( req.body.id,function (result) {
        if(result[0].status==0)
            result[0].status="待处理";
        else if(result[0].status==1)
            result[0].status="添加成功";
        else if(result[0].status==2)
            result[0].status="已拒绝";
        else if(result[0].status==3)
            result[0].status="已过期";
        res.json(result);
        console.log("aa");
    })

});
router.post('/change_refuse_status', function(req, res, next){
    //var i=req.body
    db_helper.changeRefuseApplication( req.body.request_id,2,function (result) {

    })

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

router.post('/del_contact', function(req, res, next){

    db_helper.delContact(req.body.account,req.body.contact_account, function (results) {
        res.json(results.affectedRows);
    });

});

router.post('/del_History', function(req, res, next){
    db_helper.delRecentList(req.body.account,req.body.contact_account, function (results) {

    });

    var path='./ChatHistory/' + req.body.account + " " + req.body.contact_account;
    if (fs.existsSync(path))
    {
        if (fs.statSync(path).isDirectory()) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    deleteFolder(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }
    path='./ChatHistory/' + req.body.contact_account + " " + req.body.account;
    if (fs.existsSync(path))
    {
        if (fs.statSync(path).isDirectory()) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    deleteFolder(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }


});

router.post('/change_remark', function(req, res, next){
    db_helper.changeRemark(req.body.contact_account,req.body.account,req.body.str, function (results) {
        res.json(results.affectedRows);
    });



});
module.exports = router;


