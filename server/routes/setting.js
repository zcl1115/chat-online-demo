var express = require('express');
var router = express.Router();
const multiparty = require('multiparty');
const fs = require('fs');

const LogoSavePathBase = "./UserLogos/";
//const LogoSavePathBase = "E://UserLogos/";

router.post('/GetPersonalInfo', (req, res) => {
  var SQLString = 'select * from user where account = ?'

  connection.query(SQLString, [req.body.UserID], (err, results) => {
    if (err) {
      res.json({
        Status: false
      })
    } else if (results.length == 1) {
      res.json({
        Status: true,
        UserName: results[0].name,
        UserIntroduction: results[0].personal_profile
      })
    } else {
      res.json({
        Status: false
      })
    }
  })
})

router.post('/GetPersonalLogo', (req, res) => {
  var FilePath = LogoSavePathBase + req.body.UserID;
  var JSONData = {
    Status: false,
    UserLogoFile: null
  }

  fs.readFile(FilePath, (err, data) => {
    if (err) {
      res.json(JSONData);
      return;
    }
    JSONData.Status = true;
    JSONData.UserLogoFile = data;
    console.log("length:", data.length);

    res.json(JSONData);
    return;
  })
})

router.post('/SetPersonalInfo', (req, res) => {
  var SQLString = 'update user set '
  var SQLParam = []
  var Mark = false

  console.log("test:", req.body);
  if (req.body.NewLogoFileType) {
    console.log("req.body.NewLogoFile: ", req.body.NewLogoFile);
  }

  if (req.body.NewName != null) {
    SQLString += 'name = ?'
    SQLParam.push(req.body.NewName)
    Mark = true
  }
  if (req.body.NewIntroduction != null) {
    if (Mark) {
      SQLString += ', '
    }

    SQLString += 'personal_profile = ?'
    SQLParam.push(req.body.NewIntroduction)
  }

  SQLString += ' where account = ?'
  SQLParam.push(req.body.UserID)

  connection.query(SQLString, SQLParam, (err, results) => {
    if (err) {
      res.json({
        Status: false
      })
    } else if (results.affectedRows == 1) {
      res.json({
        Status: true
      })
    } else {
      res.json({
        Status: false
      })
    }
  })
})

router.post('/SetPassword', (req, res) => {
  var SQLString = 'update user set password = ? where account = ?'
  var SQLParam = [req.body.NewPassword, req.body.UserID]

  connection.query(SQLString, SQLParam, (err, results) => {
    if (err) {
      res.json({
        Status: false
      })
    } else if (results.affectedRows == 1) {
      res.json({
        Status: true
      })
    } else {
      res.json({
        Status: false
      })
    }
  })
})

router.post('/NewLogo', (req, res) => {
  console.log("NewLogo");

  console.log("body: ", req.params);

  var TempForm = new multiparty.Form()
  TempForm.parse(req, (err, fields) => {
    if (err) {
      console.log("error");
    } else {
      if (fields) {
        console.log("NewLogoFile:", fields.NewLogoFile);
      }
    }
  })

  res.json({
    Status: true
  });
})

router.post('/NewLogo2', (req, res) => {
  console.log("NewLogo");
  console.log("body: ", req.params);

  var TempForm = new multiparty.Form()
  TempForm.parse(req, (err, fields, files) => {
    if (err) {
      console.log("error");
      res.json({
        Status: false
      });
      return;
    }
    if (!files || !files.file) {
      console.log("files error");
      res.json({
        Status: false
      });
      return;
    }

    console.log("fields:", fields);
    console.log("file:", files.file[0]);
    console.log("path:", files.file[0].path);

    var UserID = fields.UserID;
    var FileType = fields.FileType;
    var NewLogoPath = LogoSavePathBase + UserID;

    var ReaderStream = fs.createReadStream(files.file[0].path);
    var WriterStream = fs.createWriteStream(NewLogoPath);

    var SQLString = "update user set img_path = ? where account = ?";
    var SQLParam = [FileType, UserID];

    ReaderStream.pipe(WriterStream);

    connection.query(SQLString, SQLParam, (err, results) => {
      if (err) {
        res.json({
          Status: false
        })
      } else if (results.affectedRows == 1) {
        res.json({
          Status: true
        })
      } else {
        res.json({
          Status: false
        })
      }
    })
  })
})

router.post('/SetLoginStatus', (req, res) => {
  console.log("req.body:", req.body);
  var LoginStatus = 1;
  if(req.body.LoginStatus === "false") {
    LoginStatus = 0;
  }

  var SQLString = 'update user set online_status = ? where account = ?';
  var SQLParam = [LoginStatus, req.body.UserID];

  console.log("SQLParam:", SQLParam);

  connection.query(SQLString, SQLParam, (err, results) => {
    if (err) {
      res.json({
        Status: false
      })
    } else if (results.affectedRows == 1) {
      res.json({
        Status: true
      })
    } else {
      res.json({
        Status: false
      })
    }
  })
})

module.exports = router;
