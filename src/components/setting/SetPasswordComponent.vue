<template>
  <el-container class="container" :class="{'container-dark': IsDarkModeProp}">
    <div class="set-user-password">
      <div class="avatar">
        <img :src="UserLogoPathProp" />
      </div>
      <div>
        <el-form
          label-width="70px"
          :model="SetPasswordForm"
          :rules="SetPasswordFormRules"
          ref="SetPasswordFromRef"
          class="form-div"
        >
          <el-form-item
            label="原密码"
            prop="OldPassword"
            class="form-item-update"
            :class="{'form-item-update-dark': IsDarkModeProp}"
          >
            <el-input v-model="SetPasswordForm.OldPassword" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="NewPassword"
            class="form-item-update"
            :class="{'form-item-update-dark': IsDarkModeProp}"
          >
            <el-input v-model="SetPasswordForm.NewPassword" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item
            label="确认"
            prop="CheckPassword"
            class="form-item-update"
            :class="{'form-item-update-dark': IsDarkModeProp}"
          >
            <el-input v-model="SetPasswordForm.CheckPassword" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item class="button-div" label-width="0">
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
        callback(new Error("密码必须为8到12以内的字母或数字或下划线组合！"));
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

.set-user-password {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .avatar {
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
