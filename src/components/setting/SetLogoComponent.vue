<template>
  <el-container class="container" :class="{'container-dark': IsDarkModeProp}">
    <div class="set-user-avatar">
      <div class="avatars">
        <div class="old-avatar">
          <img :src="UserLogoPathProp" />
        </div>
        <div class="new-avatar" :class="{'new-avatar-dark': IsDarkModeProp}">
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
      </div>
      <div class="button-div">
        <el-button type="primary" @click="SubmitButtonClicked()">提交修改</el-button>
      </div>
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
          UploadButton.style.display = "inline-block";
        }
      }, 700);

      this.UploadMark = false;
    },
    HandleOnChange(file) {
      if (!file) {
        return;
      }
      var IsFileTypeLegal = false;
      var IsFileSizeLegal = file.size <= LegalImageSize;

      var Temp = LegalImageType.indexOf(file.raw.type);
      if (Temp >= 0) {
        IsFileTypeLegal = true;
      }

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
        message: "头像修改成功！",
        type: "success"
      });

      var NewLogoURL = URL.createObjectURL(file.raw);
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
          message: "未选择图片！",
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
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--info-font-color);
  background-color: var(--right-bg-color);
}

.container-dark {
  color: var(--info-font-color-dark);
  background-color: var(--right-bg-color-dark);
}

.set-user-avatar {
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .avatars {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .old-avatar {
      img {
        height: 150px;
        width: 150px;
        border-radius: 50%;
      }
    }
  }

  .button-div {
    text-align: center;

    button {
      background-color: var(--special-color);
      border: none;
    }
  }

  .avatars,
  .button-div {
    margin: 20px 0;
  }
}
</style>

<style lang="less">
.new-avatar {
  .el-upload--picture-card {
    height: 150px !important;
    width: 150px !important;
    border-radius: 50% !important;
    border: none !important;
    background-color: var(--mid-bg-color) !important;
  }

  .el-upload-list--picture-card .el-upload-list__item {
    height: 150px !important;
    width: 150px !important;
    border-radius: 50% !important;
    border: none !important;
    background-color: var(--mid-bg-color) !important;
  }
}

.new-avatar-dark {
  .el-upload--picture-card {
    background-color: var(--mid-bg-color-dark) !important;
  }
}
</style>