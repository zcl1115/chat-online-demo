<template>
  <div class="sign_up_border">
    <img :src="logoURL">
    <div>
      <el-form>
        <el-form-item label="头像:">
          <el-select v-model="image_url" placeholder="请选择头像">
            <el-option
                    v-for="avatar in avatars"
                    :key="avatar.src"
                    :label="avatar.src"
                    :value="avatar.src"
            >
              <img class="avatar" :src="avatar.src" style="height:36px">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-input placeholder="请输入账号(6到20位的字母数字组合)" v-model="account" clearable class="sign_up_input_style"></el-input>
      <span v-if="error.account" class="err-msg">{{error.account}}</span>
    </div>
    <div>
      <el-input placeholder="请输入昵称(20位以内,非空)" v-model="name" clearable class="sign_up_input_style"></el-input>
      <span v-if="error.name" class="err-msg">{{error.name}}</span>
    </div>
    <div>
      <el-input placeholder="请输入密码(8到12位的字母数字组合)" v-model="pwd" show-password class="sign_up_input_style"></el-input>
      <span v-if="error.pwd" class="err-msg">{{error.pwd}}</span>
    </div>
    <div>
      <el-input placeholder="请再次确认密码" v-model="again_pwd" show-password class="sign_up_input_style"></el-input>
      <span v-if="error.again_pwd" class="err-msg">{{error.again_pwd}}</span>
    </div>
    <div>
      <el-button type="primary" @click="sign_up" class="logon_style">注册</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Logon",
    data(){
      return {
        account: '',
        name: '',
        pwd : '',
        again_pwd: '',
        error : {
          account: '',
          name: '',
          pwd : '',
          again_pwd: ' '
        },
        logoURL:require("../assets/logo.png"),
        image_url:"/src_img/test01.jpg",
        avatars: [
          {
            src:"/src_img/test01.jpg",
          },
          {
            src:"/src_img/test02.jpg",
          },
          {
            src:"/src_img/test03.jpg",
          },
          {
            src:"/src_img/test04.jpg",
          },
          {
            src:"/src_img/test05.jpg",
          },
        ]
      }
    },
    methods:{
      sign_up(){
        this.axios.post("api/sign_up",this.qs.stringify({
          account: this.account,
          pass: this.pwd,
          name: this.name,
          img_url: this.image_url
        })).then((response)=>{
          let res=response.data;
          if(res.status==='0'){
            alert("注册成功!");
            window.location.href="chat.html";
          }else if (res.status==='1'){
            this.error.account="账号已存在";
          }
        })
      }
    }
  }
</script>

<style>
  .sign_up_border{
    width: 280px;
    text-align: center;
    margin-top: 250px;
    margin-left: 35vw;
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
