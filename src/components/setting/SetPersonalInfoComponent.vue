<template>
  <el-container class="container" :class="{'container-dark': IsDarkModeProp}">
    <div class="set-user-info">
      <div class="info-avatar">
        <img :src="UserLogoPathProp" />
      </div>
      <el-form
        label-width="60px"
        :model="PersonlInfoForm"
        :rules="PersonlInfoFormRules"
        ref="PersonlInfoFormRef"
        class="form-div"
      >
        <el-form-item
          label="昵称"
          prop="NewName"
          class="form-item-update"
          :class="{'form-item-update-dark': IsDarkModeProp}"
        >
          <el-input v-model="PersonlInfoForm.NewName"></el-input>
        </el-form-item>
        <el-form-item
          label="简介"
          prop="NewIntroduction"
          class="form-item-update"
          :class="{'form-item-update-dark': IsDarkModeProp}"
        >
          <el-input v-model="PersonlInfoForm.NewIntroduction"></el-input>
        </el-form-item>
        <el-form-item class="button-div" label-width="0">
          <el-button type="primary" @click="SubmitButtonClicked()">提交修改</el-button>
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
        NewName: this.UserNameProp,
        NewIntroduction: this.UserIntroductionProp
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
          message: "请输入新的昵称或简介！",
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
        if (
          this.PersonlInfoForm.NewIntroduction !== this.UserIntroductionProp
        ) {
          Temp.NewIntroduction = this.PersonlInfoForm.NewIntroduction;
        }

        var SendObj = this.qs.stringify(Temp);

        this.axios.post(SetPersonalInfoURL, SendObj).then(response => {
          if (!response.data.Status) {
            this.$message({
              showClose: true,
              message: "信息修改失败，请重试！",
              type: "error"
            });
            return;
          }

          this.$message({
            showClose: true,
            message: "信息修改成功！",
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
  created() {},
  beforeMount() {},
  mounted() {}
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

.set-user-info {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .info-avatar {
    margin: 10px 0;
    display: flex;
    justify-content: center;

    img {
      height: 150px;
      width: 150px;
      border-radius: 50%;
    }
  }

  .form-div {
    margin: 10px 0;

    .button-div {
      text-align: center;

      button {
        background-color: var(--special-color);
        border: none;
        color: white;
      }
    }
  }
}
</style>
<style lang="less">
// To override style of label & input
.form-item-update {
  .el-form-item__label {
    color: var(--info-font-color);
  }

  .el-input__inner {
    border: none;
    color: var(--info-font-color);
    background-color: var(--mid-bg-color);
  }
}
.form-item-update-dark {
  .el-form-item__label {
    color: var(--info-font-color-dark);
  }

  .el-input__inner {
    border: none;
    color: var(--info-font-color-dark);
    background-color: var(--mid-bg-color-dark);
  }
}
</style>
