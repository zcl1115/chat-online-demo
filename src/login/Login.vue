<template>
    <div class="login_border">
      <img :src="logoURL">
      <div>
        <el-input placeholder="请输入用户名" v-model="account" clearable class="input_style"></el-input>
        <span v-if="error.account" class="err-msg">{{error.account}}</span>
      </div>
      <div>
        <el-input placeholder="请输入密码" v-model="pwd" show-password class="input_style"></el-input>
        <span v-if="error.pwd" class="err-msg">{{error.pwd}}</span>
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
  import {setCookie} from "../components/cookieUtil";
  export default {
    name: "Login",
    data(){
      return {
        account: '',
        pwd : '',
        error : {
          account: '',
          pwd : ''
        },
        logoURL:require("../assets/logo.png")
      }
    },
    // sockets:{
    //   //这里是监听connect事件
    //   connect: function(){
    //     // 获取每台客服端生成的id
    //     this.websocketid = this.$socket.id;
    //     console.log('链接服务器');
    //   },
    //   // 监听断开连接，函数
    //   disconnect(){
    //     console.log('断开服务器连接');
    //   },
    //   // 服务端指定有msg监听的客服端，可接对应发来的收消息，data服务端传的消息
    //   msg(data){
    //
    //   }
    // },
    methods:{
      login(){
        this.axios.post("api/login",this.qs.stringify({
          account: this.account,
          pass: this.pwd
        })).then((response)=>{
          let res=response.data;
          if(res.status==='0'){
            setCookie('username',res.name);
            setCookie('user_account',this.account);
            window.location.href="chat.html";
          }else if (res.status==='1'){
            this.error.pwd='';
            this.error.account="账号不存在";
          }
          else{
            this.error.account='';
            this.error.pwd="密码错误";
          }
        })
      },
      sign_up(){
        this.$router.push({path:'/Sign_up'});
      }
    }
  }
</script>

<style>
  .login_border{
    width: 200px;
    margin-top: 250px;
    margin-left: 38vw;
  }
  .input_style{
    width: 200px;
    margin-bottom: 10px;
  }
  .login_style{
    margin-top: 5px;
    width: 200px;
  }
  .sign_up_style{
    margin-top: 5px;
    width: 200px;
  }
</style>
