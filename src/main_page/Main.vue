<template>
  <div class="Body">
    <el-container>
      <el-aside class="LeftAside" :class="{LeftAsideDark: IsDarkMode}" width="100px">
        <el-menu class="LeftAsideMenu" :class="{LeftAsideMenuDark: IsDarkMode}">
          <div class="UserLogoDiv" :class="{UserLogoDivDark: IsDarkMode}">
            <img :src="UserLogoPath" />
          </div>
          <el-menu-item
            id="chat"
            index="1-1"
            @click="show_page = 'chatting'"
            :class="{MenuItemDark: IsDarkMode}"
          >
            <i class="el-icon-chat-round"></i>
          </el-menu-item>
          <el-menu-item
            index="1-2"
            @click="show_page = 'contacts'"
            :class="{MenuItemDark: IsDarkMode}"
          >
            <i class="el-icon-user"></i>
          </el-menu-item>
          <el-menu-item
            index="1-3"
            @click="show_page = 'setting'"
            :class="{MenuItemDark: IsDarkMode}"
          >
            <i class="el-icon-setting"></i>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <component
        :is="show_page"
        :IsDarkMode="IsDarkMode"
        :selected_contact="selected_contact"
        @UpdateModle="UpdateModle"
        @SetDisplayPage="SetDisplayPage"
        @UpdateDataInVue="UpdateDataInVue"
        @skip_chatting="skip_chatting"
      ></component>
    </el-container>
  </div>
</template>

<script>
import chatting from "./chatting.vue";
import setting from "./setting.vue";
import contacts from "./contacts.vue";
import { getCookie, setCookie } from "../components/cookieUtil";

const UserDefaultLogoPath = require("../assets/img/DefaultLogo.png");
const GetPersonalInfoURL = "api/setting/GetPersonalInfo";
const GetPersonalLogoURL = "api/setting/GetPersonalLogo";
const UserIDCookieKey = "user_account";
const UserLogoPathCookieKey = "UserLogoPath";
const UserNameCookieKey = "UserName";
const UserIntroductionCookieKey = "UserIntroduction";

export default {
  data() {
    return {
      UserID: "",
      UserLogoPath: UserDefaultLogoPath,
      IsDarkMode: false,
      selected_contact: "",
      show_page: "chatting"
    };
  },
  methods: {
    SetDisplayPage(val) {
      this.show_page = val;
    },
    UpdateModle(val) {
      console.log(val);
      this.IsDarkMode = val.mode;
    },

    GetPersonalLogo() {
      var SendObj = this.qs.stringify({
        UserID: this.UserID
      });

      this.axios.post(GetPersonalLogoURL, SendObj).then(response => {
        if (!response.data.Status) {
          this.$message({
            showClose: true,
            message: "没有头像！",
            type: "error"
          });
          return;
        }

        var FileLength = response.data.UserLogoFile.data.length;
        var Array1 = new ArrayBuffer(FileLength);
        var Array2 = new Uint8Array(Array1);

        for (var i = 0; i < FileLength; i++) {
          Array2[i] = response.data.UserLogoFile.data[i];
        }

        var FileBlob = new Blob([Array2], { type: "" });
        var UserLogoURL = URL.createObjectURL(FileBlob);
        this.UserLogoPath = UserLogoURL;

        setCookie(UserLogoPathCookieKey, UserLogoURL);
      });
    },
    GetPersonalInfo() {
      var SendObj = this.qs.stringify({
        UserID: this.UserID
      });

      this.axios.post(GetPersonalInfoURL, SendObj).then(response => {
        if (!response.data.Status) {
          this.$message({
            showClose: true,
            message: "errer GetPersonalInfo()",
            type: "error"
          });

          return;
        }

        setCookie(UserNameCookieKey, response.data.UserName);
        setCookie(UserIntroductionCookieKey, response.data.UserIntroduction);
      });
    },
    UpdateDataInVue(val) {
      if (val.NewUserLogoPath != undefined) {
        this.UserLogoPath = val.NewUserLogoPath;
      }
      if (val.IsDarkMode != undefined) {
        this.IsDarkMode = val.IsDarkMode;
      }
    },
    skip_chatting(val){
      this.selected_contact=val.contact;
      document.getElementById("chat").click();
    }
  },
  sockets: {
    //不能改,建立连接自动调用connect
    connect: function() {
      //与socket.io连接后回调
      console.log("socket connected");
      this.$socket.emit("register", { account: getCookie("user_account") });
    },
    //服务端向客户端发送login事件
    login: function(value) {
      //监听login(后端向前端emit  login的回调)
      console.log(value);
    }
  },
  components: {
    chatting,
    setting,
    contacts
  },

  created() {
    this.UserID = getCookie(UserIDCookieKey);
    setCookie(UserLogoPathCookieKey, UserDefaultLogoPath);
    this.GetPersonalLogo();
    this.GetPersonalInfo();
  }
};
</script>

<style lang="less" scoped>
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

  .el-menu-item:hover {
    background-color: rgb(250, 250, 250);
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
    background-color: #1d2935;
  }

  .MenuItemDark:hover {
    background-color: rgb(55, 79, 102);
    color: rgb(220, 220, 220);
  }

  .MenuItemDark.is-active {
    background-color: rgb(65, 91, 118);
    color: rgb(240, 240, 240);
  }
}

.LeftAsideDark {
  background-color: #1d2935;
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

.UserLogoDivDark {
  background-color: #1d2935;
}
</style>
