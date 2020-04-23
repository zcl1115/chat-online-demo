<template>
  <el-container :class="{BGCDark: IsDarkModeProp}">
    <div class="SetLogoDiv" :class="{BGCDark: IsDarkModeProp}">
      <div class="PersonalInfoLogoDiv">
        <img :src="UserLogoPathProp" />
      </div>
      <div class="NewLogoDiv">
        <el-upload
          :action="UploadAction()"
          list-type="picture-card"
          :on-remove="HandleRemove"
          :on-change="HandleOnChange"
          :on-success="UploadOnSuccess"
          :auto-upload="false"
          :limit="1"
          :data="UploadData"
          ref="UploadLogoRef"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div class="InfoDiv" :class="{InfoDivDark: IsDarkModeProp}">
        <div class="UserIDDiv">帐号：{{ UserIDProp }}</div>
        <div class="UserNameDiv">昵称：{{ UserNameProp }}</div>
        <div class="UserIntroductionDiv">简介：{{ UserIntroductionProp }}</div>
      </div>
      <el-form label-position="right" label-width="80px">
        <el-form-item class="SubmitButtonFormItem" label-width="0">
          <el-button type="primary" class="SubmitButton" @click="SubmitButtonClicked()">提交修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-container>
</template>

<script>
const SetLogoURL = "api/setting/NewLogo";
const LegalImageType = ["image/jpeg", "image/png"];
const LegalImageSize = 1048576;

export default {
  data() {
    return {
      UploadMark: false,

      UploadData: {
        UserID: this.UserIDProp
      }
    };
  },
  methods: {
    HandleRemove() {
      setTimeout(() => {
        var UploadButton = document.getElementsByClassName(
          "el-upload--picture-card"
        )[0];

        if (UploadButton) {
          UploadButton.style.display = "block";
        }
      }, 700);

      this.UploadMark = false;
    },
    HandleOnChange(file) {
      if (!file) {
        return;
      }
      console.log("file:", file);

      var IsFileTypeLegal = false;
      var IsFileSizeLegal = file.size <= LegalImageSize;

      var Temp = LegalImageType.indexOf(file.raw.type);
      if (Temp >= 0) {
        IsFileTypeLegal = true;
      }

      console.log("IsFileTypeLegal", IsFileTypeLegal);
      console.log("IsFileSizeLegal", IsFileSizeLegal);

      if (!IsFileTypeLegal || !IsFileSizeLegal) {
        this.$refs.UploadLogoRef.clearFiles();

        this.$message({
          showClose: true,
          message: "新的头像文件必须为jpg或png格式且大小小于1MB，请检查！",
          type: "error"
        });

        return;
      }

      var UploadButton = document.getElementsByClassName(
        "el-upload--picture-card"
      )[0];
      if (UploadButton) {
        UploadButton.style.display = "none";
      }

      this.UploadMark = true;
    },
    UploadAction() {
      return SetLogoURL;
    },
    UploadOnSuccess(response, file) {
      if (!response.Status) {
        this.UploadOnError();
        return;
      }

      this.$message({
        showClose: true,
        message: "头像修改成功",
        type: "success"
      });

      var NewLogoURL = URL.createObjectURL(file.raw);
      console.log("NewLogoURL", NewLogoURL);

      this.UploadMark = false;

      this.$emit("UpdatePersonalInfoInVue", { UserLogoPath: NewLogoURL });
      this.$emit("SetDisplayMark", "ViewPersonalInfoComponent");
    },
    UploadOnError() {
      this.$message({
        showClose: true,
        message: "头像修改失败，请重试！",
        type: "error"
      });
    },
    SubmitButtonClicked() {
      if (!this.UploadMark) {
        this.$message({
          showClose: true,
          message: "未选择图片，请上传图片！",
          type: "error"
        });
        return;
      }
      this.$refs.UploadLogoRef.submit();
    }
  },
  props: [
    "UserIDProp",
    "UserNameProp",
    "UserIntroductionProp",
    "UserLogoPathProp",
    "IsDarkModeProp"
  ],

  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.UploadMark = false;
  },
  updated() {}
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  margin: 0;
}

.SetLogoDiv {
  height: 400px;
  width: 500px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .PersonalInfoLogoDiv {
    height: 150px;
    width: 150px;
    position: relative;
    left: 25%;
    top: 25%;
    transform: translate(-50%, -50%);
    margin-bottom: 50px;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }

  .NewLogoDiv {
    height: 150px;
    width: 150px;
    position: absolute;
    left: 75%;
    top: 25%;
    transform: translate(-50%, -50%);
    margin-bottom: 50px;
  }

  .InfoDiv {
    margin: 20px 0;
    text-align: center;
    font-size: 18px;
    color: #303133;

    .UserIDDiv,
    .UserNameDiv {
      margin-bottom: 20px;
    }
  }

  .InfoDivDark {
    color: rgb(230, 230, 230);
  }
}

.SubmitButtonFormItem {
  margin: 0;

  .SubmitButton {
    background-color: rgb(78, 81, 158);
    position: relative;
    left: 50%;
    transform: translate(-50%);
    border: none;
  }

  .SubmitButton2 {
    background-color: rgb(78, 81, 158);
    position: relative;
    left: 50%;
    transform: translate(-50%);
    border: none;
  }
}
</style>
