<template>
  <div class="sign_up_border">
    <div>
      <img class="show_img" id="img" />
    </div>
    <div>
      <form name="form" id="form" method="post" enctype="multipart/form-data">
        <input type="file" name="upload" id="upload" style="display: none;" @change="onfilechange" ref="img"
               multiple="multiple" accept="image/*" />
        <el-input class="img_upload" type="button" value="上传头像" onclick="document.form.upload.click()"></el-input>
      </form>
    </div>
    <div>
      <el-input placeholder="请输入账号(6到20位的字母数字组合)" v-model="users.account" clearable class="sign_up_input_style"></el-input>
      <span v-if="judgeUser" class="err-msg">请输入合适的用户名</span>
    </div>
    <div>
      <el-input placeholder="请输入昵称(20位以内,非空)" v-model="users.name" clearable class="sign_up_input_style"></el-input>
      <span v-if="judgeName" class="err-msg">请输入昵称</span>
    </div>
    <div>
      <el-input placeholder="请输入密码(8到12位的字母数字组合)" v-model="users.password" show-password class="sign_up_input_style"></el-input>
      <span v-if="judgePas" class="err-msg">请输入符合规范的密码</span>
    </div>
    <div>
      <el-input placeholder="请再次确认密码" v-model="users.passwords" show-password class="sign_up_input_style"></el-input>
      <span v-if="judgePass" class="err-msg">两次输入请保持一致</span>
    </div>
    <div>
      <el-button type="primary" @click="sign_up" class="logon_style">注册</el-button>
    </div>
  </div>
</template>

<script>
  import {setCookie} from "../components/cookieUtil";

  export default{
    name:'signUp',
    data(){
      return{
        judgeUser:false,
        judgePas:false,
        judgePass:false,
        judgeName:false,
        users:{
          account:'',
          name:'',
          password:'',
          passwords:'',
          photo:null,
        }
      }
    },
    methods: {
      sign_up: function () {
        var format = new FormData();
        for (var key in this.users) {  //读取data中所要上传的内容循环append到fordata中
          if (key) {
            format.append(key, this.users[key])
          }
        }
        console.log(format);
        this.axios.post("api/sign_up",format,{
          headers:{
            'Content-Type':'multipart/form-data'
          }
        }).then((response)=>{
          let res=response.data;
          if(res.status==='0'){
            alert("注册成功!");
            setCookie('username',this.user.name);
            setCookie('user_account',this.user.account);
            window.location.href="chat.html";
          }else if (res.status==='1'){
            this.error.account="账号已存在";
          }
        })
      },
      onfilechange: function (e) { //获取到图片文件
        var files = e.target.files ||     e.dataTransfer.files;
        if (!files.length)return;
        this.users.photo = files[0];
        var file = this.$refs.img;
        var reader = new FileReader();
        reader.readAsDataURL(file.files[0]);
        reader.onload = function () {
          document.querySelector("img").src = this.result;
        }
      }
    }

  }
</script>

<style>
  .sign_up_border{
    width: 280px;
    text-align: center;
    margin-top: 200px;
    margin-left: 35vw;
  }
  .show_img{
    height: 150px;
    width: 150px;
  }
  .img_upload{
    margin-bottom: 5px;
    width: 50px;
  }
  .sign_up_input_style{
    width: 280px;
    margin-bottom: 10px;
  }
  .logon_style{
    margin-top: 5px;
    width: 200px;
  }
</style>
