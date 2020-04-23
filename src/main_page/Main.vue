<template>
  <div class="Body">
    <el-container>
      <el-aside class="LeftAside" :class="{LeftAsideDark: IsDarkMode}" width="100px">
        <el-menu class="LeftAsideMenu" :class="{LeftAsideMenuDark: IsDarkMode}">
          <div class="UserLogoDiv">
            <img :src="user_img_path" alt />
          </div>
          <el-menu-item index="1-1" @click="show_page = 'chatting'" :class="{MenuItemDark: IsDarkMode}">
            <i class="el-icon-chat-round"></i>
          </el-menu-item>
          <el-menu-item index="1-2" @click="show_page = 'contacts'" :class="{MenuItemDark: IsDarkMode}">
            <i class="el-icon-user"></i>
          </el-menu-item>
          <el-menu-item index="1-3" @click="show_page = 'setting'" :class="{MenuItemDark: IsDarkMode}">
            <i class="el-icon-setting"></i>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <component :is="show_page" :IsDarkMode="IsDarkMode" @UpdateModle="UpdateModle" @SetDisplayPage="SetDisplayPage"></component>
    </el-container>
  </div>
</template>

<script>
  import chatting from "./chatting.vue";
  import setting from "./setting.vue";
  import contacts from "./contacts.vue";
  import {getCookie} from "../components/cookieUtil";
  export default {
    data(){
      return {
        logoURL:require("../assets/logo.png"),
        show_page: "chatting",
        user_img_path: getCookie('user_img_path'),
        IsDarkMode: false
      }
    },
    methods: {
      SetDisplayPage(val) {
        this.show_page = val;
      },
      UpdateModle(val){
        console.log(val);
        this.IsDarkMode=val.mode;
      }
    },
    sockets: {
      //不能改,建立连接自动调用connect
      connect: function() {
        //与socket.io连接后回调
        console.log("socket connected");
        this.$socket.emit('register',{'account':getCookie("user_account")});
      },
      //服务端向客户端发送login事件
      login: function(value) {
        //监听login(后端向前端emit  login的回调)
        console.log(value)
      },

    },
    components:{
      chatting,
      setting,
      contacts
    }
  }
</script>

<style  lang="less" scoped>
  .Body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .el-container {
    height: 100%;
    margin: 0;
  }

  .el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
    height: 100%;
    .el-menu-item.is-active {
      background-color: #fff;
      color: #000;
    }
  }

  .LeftAside {
    background-color: rgb(242, 242, 242);
    text-align: center;

    .LeftAsideMenu {
      background-color: rgb(242, 242, 242);
      border: none;
    }

    .LeftAsideMenuDark {
      background-color: rgb(0,0,0);
    }

    .MenuItemDark:hover {
      background-color: rgb(0, 0, 0);
    }

    .MenuItemDark.is-active {
      background-color: #1A1A1A;
    }
  }

  .LeftAsideDark{
    background-color: rgb(0,0,0);
  }

  .UserLogoDiv {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    position: relative;
    left: 25%;
    margin-top: 40px;
    margin-bottom: 40px;
    background-color: rgb(242, 242, 242);
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }
</style>
