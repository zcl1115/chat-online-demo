<template>
  <el-container :class="{BGCDark: IsDarkModeProp}">
    <div class="SetPersonalInfoDiv" :class="{BGCDark: IsDarkModeProp}">
      <div class="PersonalInfoLogoDiv">
        <img :src="UserLogoPathProp" />
      </div>
      <div class="UserIDDiv" :class="{UserIDDivDark: IsDarkModeProp}">帐号：{{ UserIDProp }}</div>
      <el-form
        label-position="right"
        label-width="80px"
        :model="PersonlInfoForm"
        :rules="PersonlInfoFormRules"
        ref="PersonlInfoFormRef"
        :class="{PersonalInfoFormDark: IsDarkModeProp}"
      >
        <el-form-item label prop="NewName" :class="{FormItemDark: IsDarkModeProp}">
          <label class="FormLabel" :class="{FontDark: IsDarkModeProp}">昵称：</label>
          <el-input v-model="PersonlInfoForm.NewName"></el-input>
        </el-form-item>
        <el-form-item label="" prop="NewIntroduction">
          <label class="FormLabel" :class="{FontDark: IsDarkModeProp}">简介：</label>
          <el-input v-model="PersonlInfoForm.NewIntroduction"></el-input>
        </el-form-item>
        <el-form-item class="SubmitButtonFormItem" label-width="0">
          <el-button type="primary" class="SubmitButton" @click="SubmitButtonClicked()">提交修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-container>
</template>

<script>
const SetPersonalInfoURL = "api/setting/SetPersonalInfo";

export default {
  data() {
    return {
      PersonlInfoForm: {
        NewName: "",
        NewIntroduction: ""
      },

      PersonlInfoFormRules: {
        NewName: [
          { required: true, message: "昵称必填！", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "昵称长度必须在20以内！",
            trigger: "blur"
          }
        ],
        NewIntroduction: [
          {
            min: 0,
            max: 64,
            message: "简介长度必须在64以内！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    SubmitButtonClicked() {
      if (
        this.PersonlInfoForm.NewName === this.UserNameProp &&
        this.PersonlInfoForm.NewIntroduction === this.UserIntroductionProp
      ) {
        this.$message({
          showClose: true,
          message: "请输入新的个人信息！",
          type: "error"
        });
        return;
      }

      this.$refs.PersonlInfoFormRef.validate(valid => {
        if (!valid) {
          this.$message({
            showClose: true,
            message: "新的个人信息不规范，请重新检查！",
            type: "error"
          });
          return;
        }

        var Temp = { UserID: this.UserIDProp };

        if (this.PersonlInfoForm.NewName !== this.UserNameProp) {
          Temp.NewName = this.PersonlInfoForm.NewName;
        }
        if (this.PersonlInfoForm.NewIntroduction !== this.UserIntroductionProp) {
          Temp.NewIntroduction = this.PersonlInfoForm.NewIntroduction;
        }

        var SendObj = this.qs.stringify(Temp);

        this.axios.post(SetPersonalInfoURL, SendObj).then(response => {
          if (!response.data.Status) {
            this.$message({
              showClose: true,
              message: "errer SubmitButtonClicked()",
              type: "error"
            });
            return;
          }

          this.$message({
            showClose: true,
            message: "信息修改成功",
            type: "success"
          });

          this.$emit("SetDisplayMark", "ViewPersonalInfoComponent");
          this.$emit("UpdatePersonalInfoInVue", Temp);
        });
      });
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
  created() {
    this.PersonlInfoForm.NewName = this.UserNameProp;
    this.PersonlInfoForm.NewIntroduction = this.UserIntroductionProp;
  },
  beforeMount() {},
  mounted() {
    this.UploadMark = false;
  },
  updated() {}
};
</script>

<style  lang="less" scoped>
.el-container {
  height: 100%;
  margin: 0;
}

.SetPersonalInfoDiv {
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
    left: 50%;
    top: 25%;
    transform: translate(-50%, -50%);
    margin-bottom: 50px;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }

  .UserIDDiv {
    margin-bottom: 20px;
    text-align: center;
    font-size: 18px;
    color: #303133;
  }

  .UserIDDivDark {
    color: rgb(230, 230, 230);
  }

  .PersonalInfoFormDark {
    color: rgb(230, 230, 230);

    .FormItemDark {
      .el-form-item__label {
        color: rgb(230, 230, 230);
      }
    }
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
