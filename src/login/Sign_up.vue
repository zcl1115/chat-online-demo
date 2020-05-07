<template>
  <div class="sign_up_border">
    <div>
      <img class="show_img" id="img" />
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
        <el-input
          class="img_upload"
          type="button"
          value="上传头像"
          onclick="document.form.upload.click()"
        ></el-input>
      </form>
    </div>
    <div>
      <el-form :model="users" :rules="Sign_up_FormRules">
        <el-form-item prop="account">
          <el-input
            placeholder="请输入账号(6到20位的字母数字组合)"
            v-model="users.account"
            clearable
            class="sign_up_input_style"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input
            placeholder="请输入昵称(20位以内,非空)"
            v-model="users.name"
            clearable
            class="sign_up_input_style"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码(8到12位的字母数字组合)"
            v-model="users.password"
            show-password
            class="sign_up_input_style"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passwords">
          <el-input
            placeholder="请再次确认密码"
            v-model="users.passwords"
            show-password
            class="sign_up_input_style"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sign_up" class="logon_style">注册</el-button>
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
        this.has_error=true;
        callback(new Error("密码必须为8到20以内的字母或数字或下划线组合！"));
      } else {
        callback();
      }
    };
    var PasswordsRule = (rule, value, callback) => {
      if (value !== this.users.password) {
        this.has_error=true;
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
      Sign_up_FormRules: {
        account: [
          { required: true, message: "账号必填！", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "账号长度必须在6到20以内！",
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
    sign_up: function() {
      if (this.has_error){
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
        .post("api/sign_up", format, {
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
              message: "该账号已存在！",
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
        document.querySelector("img").src = this.result;
      };
    }
  }
};
</script>

<style>
.sign_up_border {
  width: 280px;
  text-align: center;
  margin-top: 150px;
  margin-left: 35vw;
}
.show_img {
  height: 150px;
  width: 150px;
}
.img_upload {
  margin-bottom: 5px;
  width: 50px;
}
.sign_up_input_style {
  width: 280px;
  margin-bottom: 10px;
}
.logon_style {
  margin-top: 5px;
  width: 200px;
}
</style>
