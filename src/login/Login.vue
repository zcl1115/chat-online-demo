<template>
  <div class="login_border">
    <img :src="logoURL" />
    <div>
      <el-form :model="message" :rules="LoginFormRules">
        <el-form-item prop="account">
          <el-input placeholder="请输入账号" v-model="message.account" clearable class="input_style"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input placeholder="请输入密码" v-model="message.pwd" show-password class="input_style"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="primary" @click="login()" class="login_style">登录</el-button>
    </div>
    <div>
      <el-button type="text" @click="sign_up" class="sign_up_style">没有账号？马上注册</el-button>
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
      logoURL: require("../assets/logo.png"),
      message: {
        account: "",
        pwd: ""
      },
      LoginFormRules: {
        account: [{ required: true, message: "账号必填！", trigger: "blur" }],
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
          message: "请输入账号密码！",
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
                message: "账号不存在！",
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
    sign_up() {
      this.$router.push({ path: "/Sign_up" });
    }
  }
};
</script>

<style>
.login_border {
  width: 200px;
  margin-top: 250px;
  margin-left: 38vw;
}
.input_style {
  width: 200px;
  margin-bottom: 10px;
}
.login_style {
  margin-top: 5px;
  width: 200px;
}
.sign_up_style {
  margin-top: 5px;
  width: 200px;
}
</style>
