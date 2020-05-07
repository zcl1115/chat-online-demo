var express = require('express');
var router = express.Router();

router.post('/get_contacts', function(req, res, next){
    db_helper.getContacts(req.body.account, function (results) {
        res.json(results);
    });

});
router.post('/update_recent_contacts', function(req, res, next){
    db_helper.updateRecentList(req.body.user_account,req.body.time,req.body.contact_account, function (results) {
        res.json(results);
    });

});


module.exports = router;
