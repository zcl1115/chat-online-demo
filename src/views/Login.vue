<template>
  <div class="main_login">
    <div class="logo_part">
      <img src="icons/dove.svg" style="width:40px;height:40px" />
      <span>咕咕报</span>
    </div>
    <div class="form_container_login">
      <el-form :model="message" :rules="LoginFormRules">
        <el-form-item prop="account" class="input_style_login">
          <el-input placeholder="请输入帐号" v-model="message.account" clearable></el-input>
        </el-form-item>
        <el-form-item prop="pwd" class="input_style_login">
          <el-input
            placeholder="请输入密码"
            v-model="message.pwd"
            @keyup.enter.native="login"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="login" class="login_style">登录</el-button>
      <el-button type="text" @click="signup" class="signup_style">注册</el-button>
    </div>
  </div>
</template>

<script>
const PasswordReg = /^\w{8,12}$/;
import { setCookie } from "../components/cookieUtil";
export default {
  name: "Login",
  data() {
    var PasswordMainRule = (rule, value, callback) => {
      if (!PasswordReg.test(value)) {
        callback(new Error("密码必须为8到20以内的字母或数字或下划线组合！"));
      } else {
        callback();
      }
    };
    return {
      message: {
        account: "",
        pwd: ""
      },
      LoginFormRules: {
        account: [
          { required: true, message: "帐号必填！", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "帐号长度必须在6到20以内！",
            trigger: "blur"
          }
        ],
        pwd: [
          { required: true, message: "密码必填！", trigger: "blur" },
          { validator: PasswordMainRule, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      if (this.message.account === "" || this.message.pwd === "") {
        this.$message({
          showClose: true,
          message: "请输入帐号密码！",
          type: "error"
        });
        return;
      }
      this.axios
        .post(
          "api/login",
          this.qs.stringify({
            account: this.message.account,
            pass: this.message.pwd
          })
        )
        .then(response => {
          let res = response.data;
          if (res.status === "0") {
            setCookie("username", res.name);
            setCookie("user_account", this.message.account);
            setCookie("user_img_path", res.img_path);
            window.location.href = "chat.html";
          } else {
            if (res.status === "1") {
              this.$message({
                showClose: true,
                message: "帐号不存在！",
                type: "error"
              });
              return;
            } else {
              this.$message({
                showClose: true,
                message: "密码错误！",
                type: "error"
              });
              return;
            }
          }
        });
    },
    signup() {
      this.$router.push({ path: "/Signup" });
    }
  }
};
</script>

<style>
@import "../assets/css/global.css";

html {
  height: 100%;
}

body {
  background-color: var(--login-signup-bg-color);
}

.main_login {
  text-align: center;
  padding-top: 150px;
}

.logo_part {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
}

img + span {
  padding-left: 8px;
}

.form_container_login {
  background-color: white;
  width: 350px;
  height: 250px;
  margin: auto;
  border-radius: 5px;
  margin-top: 10px;
  padding-top: 40px;
  box-shadow: 2px 2px rgb(233, 233, 233);
}

.input_style_login {
  width: 270px;
  margin: 10px auto;
  padding-bottom: 10px;
}

.login_style {
  width: 270px;
  margin-bottom: 10px !important;
  background-color: var(--special-color) !important;
  border: var(--special-color) !important;
}

.signup_style {
  width: 270px;
  color: #c9c5c5 !important;
  text-decoration: underline;
  text-underline-position: under;
}

.el-button + .el-button {
  margin-left: 0px !important;
}
</style>
