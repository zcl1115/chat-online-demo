const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const fs = require('fs');

const LogoSavePathBase = "./UserLogos/";

router.post('/GetPersonalInfo', (req, res) => {
  let InputData = {
    UserID: req.body.UserID
  };

  db_helper.GetPersonalInfo(InputData, (ReturnData) => {
    res.json(ReturnData);
  })
})

router.post('/GetPersonalLogo', (req, res) => {
  let FilePath = LogoSavePathBase + req.body.UserID;
  let JSONData = {
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

    res.json(JSONData);
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
  let TempForm = new multiparty.Form();
  let ReturnData = {
    Status: false
  };

  TempForm.parse(req, (err, fields, files) => {
    if (err) {
      console.log("error");
      res.json(ReturnData);
      return;
    }
    if (!files || !files.file) {
      console.log("files error");
      res.json(ReturnData);
      return;
    }

    let NewLogoPath = LogoSavePathBase + fields.UserID;
    let ReaderStream = fs.createReadStream(files.file[0].path);
    let WriterStream = fs.createWriteStream(NewLogoPath);

    ReaderStream.pipe(WriterStream);
    ReturnData.Status = true;

    res.json(ReturnData);
  })
})

router.post('/Logout', (req, res) => {
  let InputData = {
    UserID: req.body.UserID
  };

  db_helper.Logout(InputData, (ReturnData) => {
    res.json(ReturnData);
  })
})

module.exports = router;