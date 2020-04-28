<template>
  <el-container :class="{BGCDark: IsDarkModeProp}">
    <div class="SetPasswordDiv" :class="{BGCDark: IsDarkModeProp}">
      <div class="PersonalInfoLogoDiv">
        <img :src="UserLogoPathProp" />
      </div>
      <div>
        <el-form
          label-position="right"
          label-width="80px"
          :model="SetPasswordForm"
          :rules="SetPasswordFormRules"
          ref="SetPasswordFromRef"
        >
          <el-form-item label prop="OldPassword">
            <label class="FormLabel" :class="{FontDark: IsDarkModeProp}">原密码：</label>
            <el-input v-model="SetPasswordForm.OldPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label prop="NewPassword">
            <label class="FormLabel" :class="{FontDark: IsDarkModeProp}">新密码：</label>
            <el-input v-model="SetPasswordForm.NewPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label prop="CheckPassword">
            <label class="FormLabel" :class="{FontDark: IsDarkModeProp}">确认：</label>
            <el-input v-model="SetPasswordForm.CheckPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item class="SubmitButtonFormItem" label-width="0">
            <el-button type="primary" class="SubmitButton" @click="SubmitButtonClicked()">提交修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-container>
</template>

<script>
const PasswordReg = /^\w{8,12}$/;
const LoginURL = "api/login";
const SetPasswordURL = "api/setting/SetPassword";

export default {
  data() {
    var PasswordMainRule = (rule, value, callback) => {
      if (!PasswordReg.test(value)) {
        callback(new Error("密码必须为8到20以内的字母或数字或下划线组合！"));
      } else {
        callback();
      }
    };
    var NewPasswordRule = (rule, value, callback) => {
      if (value === this.SetPasswordForm.OldPassword) {
        callback(new Error("新密码不能与旧密码相同！"));
      } else {
        callback();
      }
    };
    var CheckPasswordRule = (rule, value, callback) => {
      if (value !== this.SetPasswordForm.NewPassword) {
        callback(new Error("确认密码必须与新密码相同！"));
      } else {
        callback();
      }
    };

    return {
      SetPasswordForm: {
        OldPassword: "",
        NewPassword: "",
        CheckPassword: ""
      },

      SetPasswordFormRules: {
        OldPassword: [
          { required: true, message: "旧密码必填！", trigger: "blur" },
          { validator: PasswordMainRule, trigger: "blur" }
        ],
        NewPassword: [
          { required: true, message: "新密码必填！", trigger: "blur" },
          { validator: PasswordMainRule, trigger: "blur" },
          { validator: NewPasswordRule, trigger: "blur" }
        ],
        CheckPassword: [
          { required: true, message: "确认密码必填！", trigger: "blur" },
          { validator: PasswordMainRule, trigger: "blur" },
          { validator: CheckPasswordRule, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    SubmitButtonClicked() {
      this.$refs.SetPasswordFromRef.validate(valid => {
        if (!valid) {
          this.$message({
            showClose: true,
            message: "密码信息不规范，请重新检查！",
            type: "error"
          });
          return;
        }

        var Temp1 = {
          account: this.UserIDProp,
          pass: this.SetPasswordForm.OldPassword
        };
        var SendObj1 = this.qs.stringify(Temp1);

        this.axios.post(LoginURL, SendObj1).then(response => {
          if (response.data.status !== "0") {
            this.$message({
              showClose: true,
              message: "原密码错误，请检查！",
              type: "error"
            });
            return;
          }

          var Temp2 = {
            UserID: this.UserIDProp,
            NewPassword: this.SetPasswordForm.NewPassword
          };
          var SendObj2 = this.qs.stringify(Temp2);

          this.axios.post(SetPasswordURL, SendObj2).then(response => {
            if (!response.data.Status) {
              this.$message({
                showClose: true,
                message: "更新密码失败，请重试！",
                type: "error"
              });
              return;
            }

            this.$message({
              showClose: true,
              message: "更新密码成功！",
              type: "success"
            });

            this.$refs.SetPasswordFromRef.resetFields();

            this.$emit("SetDisplayMark", "ViewPersonalInfoComponent");
          });
        });
      });
    }
  },
  props: ["UserIDProp", "UserLogoPathProp", "IsDarkModeProp"]
};
</script>

<style  lang="less" scoped>
.el-container {
  height: 100%;
  margin: 0;
}

.SetPasswordDiv {
  height: 550px;
  width: 400px;
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
    margin-bottom: 80px;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
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
}
</style>
