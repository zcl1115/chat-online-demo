var express = require('express');
var router = express.Router();
const multiparty = require('multiparty');
const fs = require('fs');

const LogoSavePathBase = "./UserLogos/";
//const LogoSavePathBase = "E://UserLogos/";

router.post('/GetPersonalInfo', (req, res) => {
  let InputData = {
    UserID: req.body.UserID
  };

  db_helper.GetPersonalInfo(InputData, (ReturnData) => {
    res.json(ReturnData);
  })
})

router.post('/GetPersonalLogo', (req, res) => {
  console.log("GetPersonalLogo req: ", req.body);
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
  let InputData = {
    UserID: req.body.UserID
  };

  if (req.body.NewName != undefined) {
    InputData.NewName = req.body.NewName;
  }
  if (req.body.NewIntroduction != undefined) {
    InputData.NewIntroduction = req.body.NewIntroduction;
  }

  db_helper.SetPersonalInfo(InputData, (ReturnData) => {
    res.json(ReturnData);
  })
})

router.post('/SetPassword', (req, res) => {
  let InputData = {
    UserID: req.body.UserID,
    NewPassword: req.body.NewPassword
  };

  db_helper.SetPassword(InputData, (ReturnData) => {
    res.json(ReturnData);
  })
})

router.post('/NewLogo', (req, res) => {
  console.log("NewLogo");

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

    var NewLogoPath = LogoSavePathBase + fields.UserID;

    var ReaderStream = fs.createReadStream(files.file[0].path);
    var WriterStream = fs.createWriteStream(NewLogoPath);

    ReaderStream.pipe(WriterStream);

    res.json({
      Status: true
    });
  })
})

router.post('/SetLoginStatus', (req, res) => {
  let InputData = {
    UserID: req.body.UserID,
    LoginStatus: 1
  };

  if (req.body.LoginStatus === "false") {
    InputData.LoginStatus = 0;
  }

  db_helper.SetLoginStatus(InputData, (ReturnData) => {
    res.json(ReturnData);
  })
})

module.exports = router;