<template>
  <div class="main_signup">
    <img src="icons/close.svg" style="width:30px;height:30px" id="close-btn" @click="backToLogin" />
    <div class="logo_part">
      <img src="icons/dove.svg" style="width:40px;height:40px" />
      <span>咕咕报</span>
    </div>
    <div class="form_container_signup">
      <div class="img_container">
        <img src="images/blank.png" id="profile" @click="propagate" />
        <i class="el-icon-camera-solid upload_icon"></i>
      </div>
      <div>
        <form name="form" id="form" method="post" enctype="multipart/form-data">
          <input
            type="file"
            name="upload"
            id="upload"
            style="display: none;"
            @change="onfilechange"
            ref="img"
            multiple="multiple"
            accept="image/*"
          />
        </form>
      </div>
      <el-form :model="users" :rules="Signup_FormRules">
        <el-form-item prop="account" class="input_style_signup">
          <el-input placeholder="请输入帐号(6-20位的字母数字组合)" v-model="users.account" clearable></el-input>
        </el-form-item>
        <el-form-item prop="name" class="input_style_signup">
          <el-input placeholder="请输入昵称(20位以内)" v-model="users.name" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password" class="input_style_signup">
          <el-input placeholder="请输入密码(8-12位的字母数字组合)" v-model="users.password" show-password></el-input>
        </el-form-item>
        <el-form-item prop="passwords" class="input_style_signup">
          <el-input placeholder="请再次确认密码" v-model="users.passwords" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="signup" class="logon_style">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const PasswordReg = /^\w{8,12}$/;
import { setCookie } from "../components/cookieUtil";

export default {
  name: "signUp",
  data() {
    var PasswordMainRule = (rule, value, callback) => {
      if (!PasswordReg.test(value)) {
        this.has_error = true;
        callback(new Error("密码必须为8到20以内的字母或数字或下划线组合！"));
      } else {
        callback();
      }
    };
    var PasswordsRule = (rule, value, callback) => {
      if (value !== this.users.password) {
        this.has_error = true;
        callback(new Error("确认密码必须与新密码相同！"));
      } else {
        callback();
      }
    };
    return {
      users: {
        account: "",
        name: "",
        password: "",
        passwords: "",
        photo: null
      },
      has_error: false,
      Signup_FormRules: {
        account: [
          { required: true, message: "帐号必填！", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "帐号长度必须在6到20以内！",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "昵称必填！", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "昵称长度必须在20以内！",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码必填！", trigger: "blur" },
          { validator: PasswordMainRule, trigger: "blur" }
        ],
        passwords: [
          { required: true, message: "确认密码必填！", trigger: "blur" },
          { validator: PasswordMainRule, trigger: "blur" },
          { validator: PasswordsRule, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    signup: function() {
      if (this.has_error) {
        return;
      }
      if (
        this.users.photo === null ||
        this.users.account === "" ||
        this.users.name === "" ||
        this.users.password === "" ||
        this.users.passwords === ""
      ) {
        this.$message({
          showClose: true,
          message: "请填写完整信息！",
          type: "error"
        });
        return;
      }
      var format = new FormData();
      for (var key in this.users) {
        //读取data中所要上传的内容循环append到fordata中
        if (key) {
          format.append(key, this.users[key]);
        }
      }
      this.axios
        .post("api/signup", format, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          let res = response.data;
          if (res.status === "0") {
            this.$message({
              showClose: true,
              message: "注册成功！",
              type: "success"
            });
            setCookie("username", this.users.name);
            setCookie("user_account", this.users.account);
            window.location.href = "chat.html";
          } else if (res.status === "1") {
            this.$message({
              showClose: true,
              message: "该帐号已存在！",
              type: "error"
            });
          }
        });
    },
    onfilechange: function(e) {
      //获取到图片文件
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.users.photo = files[0];
      var file = this.$refs.img;
      var reader = new FileReader();
      reader.readAsDataURL(file.files[0]);
      reader.onload = function() {
        document.querySelector("#profile").src = this.result;
      };
    },
    propagate: function() {
      document.getElementById("upload").click();
    },
    backToLogin: function() {
      window.location.href = "";
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

.main_signup {
  text-align: center;
  padding-top: 90px;
}

.form_container_signup {
  background-color: white;
  width: 350px;
  height: 430px;
  margin: auto;
  border-radius: 5px;
  margin-top: 10px;
  padding-top: 20px;
  box-shadow: 2px 2px rgb(233, 233, 233);
}

.img_container {
  position: relative;
}

.upload_icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: var(--special-color);
  font-size: 1.5em;
  opacity: 0;
}

#profile {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
}

#profile:hover {
  opacity: 0.4;
  cursor: pointer;
}

#profile:hover + .upload_icon {
  opacity: 1;
}

.input_style_signup {
  width: 270px !important;
  margin: 10px auto;
  padding-bottom: 5px;
}

.logon_style {
  width: 270px;
  background-color: var(--special-color) !important;
  border: var(--special-color) !important;
}

#close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

#close-btn:hover {
  cursor: pointer;
}
</style>
