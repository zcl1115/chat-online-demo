<template>
  <el-container>
    <el-aside class="MiddleAside" :class="{MiddleAsideDark: IsDarkMode}" width="300px">
      <el-menu
        class="MiddleAsideMenu"
        :class="{MiddleAsideMenuDark: IsDarkMode}"
        :default-active="ActiveButtonIndex"
      >
        <el-menu-item
          class="LogoutButton"
          @click="LogoutButtonClicked()"
          :class="{MenuItem2Dark: IsDarkMode}"
        >退出登录</el-menu-item>
        <el-menu-item
          index="ViewPersonalInfoComponent"
          class="OtherSettingButtons"
          @click="SetDisplayMark('ViewPersonalInfoComponent')"
          :class="{MenuItemDark: IsDarkMode}"
        >个人信息</el-menu-item>
        <el-menu-item
          index="SetPasswordComponent"
          class="OtherSettingButtons"
          @click="SetDisplayMark('SetPasswordComponent')"
          :class="{MenuItemDark: IsDarkMode}"
        >帐号密码</el-menu-item>
        <el-menu-item
          index="SetThemeModeComponent"
          class="OtherSettingButtons"
          @click="SetDisplayMark('SetThemeModeComponent')"
          :class="{MenuItemDark: IsDarkMode}"
        >设置主题</el-menu-item>
      </el-menu>
    </el-aside>
    <component
      :is="RightSideDisplayMark"
      @SetDisplayMark="SetDisplayMark"
      @SetDisplayMark2="SetDisplayMark2"
      @UpdatePersonalInfoInVue="UpdatePersonalInfoInVue"
      :UserIDProp="UserID"
      :UserNameProp="UserName"
      :UserIntroductionProp="UserIntroduction"
      :UserLogoPathProp="UserLogoPath"
      :IsDarkModeProp="IsDarkMode"
    ></component>
  </el-container>
</template>

<script>
import ViewPersonalInfoComponent from "./ViewPersonalInfoComponent.vue";
import SetPersonalInfoComponent from "./SetPersonalInfoComponent.vue";
import SetPasswordComponent from "./SetPasswordComponent.vue";
import SetLogoComponent from "./SetLogoComponent.vue";
import SetThemeModeComponent from "./SetThemeModeComponent.vue";
import { getCookie, DeleteCookie, setCookie } from "../components/cookieUtil";

const GetPersonalInfoURL = "api/setting/GetPersonalInfo";
const GetPersonalLogoURL = "api/setting/GetPersonalLogo";
const SetLoginStatusURL = "api/setting/SetLoginStatus";
const UserIDCookieKey = "user_account";
const UserLogoPathCookieKey = "UserLogoPath";
const UserNameCookieKey = "UserName";
const UserIntroductionCookieKey = "UserIntroduction";
const LogoutMark = false;

export default {
  data() {
    return {
      RightSideDisplayMark: "ViewPersonalInfoComponent",
      ActiveButtonIndex: "ViewPersonalInfoComponent",

      UserID: getCookie(UserIDCookieKey),
      UserName: getCookie(UserNameCookieKey),
      UserIntroduction: getCookie(UserIntroductionCookieKey),
      UserLogoPath: getCookie(UserLogoPathCookieKey)
    };
  },
  methods: {
    SetDisplayMark(val) {
      this.RightSideDisplayMark = val;
      this.ActiveButtonIndex = val;
    },
    SetDisplayMark2(val) {
      this.RightSideDisplayMark = val;
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

        this.UserName = response.data.UserName;
        this.UserIntroduction = response.data.UserIntroduction;
      });
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
      });
    },
    UpdatePersonalInfoInVue(val) {
      if (val.NewName != undefined) {
        this.UserName = val.NewName;
        setCookie(UserNameCookieKey, val.NewName);
      }
      if (val.NewIntroduction != undefined) {
        this.UserIntroduction = val.NewIntroduction;
        setCookie(UserIntroductionCookieKey, val.NewIntroduction);
      }
      if (val.UserLogoPath != undefined) {
        this.UserLogoPath = val.UserLogoPath;
        this.$emit("UpdateDataInVue", { NewUserLogoPath: val.UserLogoPath });
        setCookie(UserLogoPathCookieKey, val.UserLogoPath);
      }
      if (val.IsDarkMode != undefined) {
        this.$emit("UpdateDataInVue", { IsDarkMode: val.IsDarkMode });
      }
    },
    LogoutButtonClicked() {
      this.SetLoginStatus(LogoutMark);
      DeleteCookie(UserIDCookieKey);

      window.location.href = "login.html";
    },
    SetLoginStatus(val) {
      var SendObj = this.qs.stringify({
        UserID: this.UserID,
        LoginStatus: val
      });

      this.axios.post(SetLoginStatusURL, SendObj).then(response => {
        if (!response.data.Status) {
          this.$message({
            showClose: true,
            message: "errer SetLoginStatus()",
            type: "error"
          });

          return;
        }

        return;
      });
    }
  },
  components: {
    ViewPersonalInfoComponent,
    SetPersonalInfoComponent,
    SetLogoComponent,
    SetPasswordComponent,
    SetThemeModeComponent
  },
  props: ["IsDarkMode"],

  beforeCreate() {},
  created() {
    //this.UserID = getCookie(UserIDCookieKey);
    //this.UserName = getCookie(UserNameCookieKey);
    //this.UserIntroduction = getCookie(UserIntroductionCookieKey);
    //this.SetLoginStatus(LoginMark);
    //this.GetPersonalInfo();
    //this.GetPersonalLogo();
    //this.UserLogoPath = getCookie(UserLogoPathCookieKey);
  },
  beforeMount() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  margin: 0;
}

.el-aside {
  color: #333;
  height: 100%;

  .el-menu-item.is-active,
  .el-menu-item:focus {
    background-color: #fff;
    color: #000;
  }

  .el-menu-item:hover {
    background-color: rgb(250, 250, 250);
  }
}

.MiddleAside {
  background-color: rgb(247, 247, 247);
  text-align: center;

  .MiddleAsideMenu {
    background-color: rgb(247, 247, 247);
    border: none;

    .LogoutButton {
      margin-top: 50px;
      margin-bottom: 50px;
      margin-left: 30px;
      width: 240px;
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      border-radius: 5px;
    }

    .OtherSettingButtons {
      height: 75px;
      line-height: 75px;
      vertical-align: top;
    }

    .MenuItem2Dark {
      background-color: rgb(60, 84, 108);
      color: rgb(220, 220, 220);
    }

    .MenuItem2Dark:hover {
      background-color: rgb(68, 96, 128);
      color: rgb(240, 240, 240);
    }

    .MenuItem2Dark.is-active,
    .MenuItem2Dark:focus {
      background-color: rgb(71, 100, 129);
      color: rgb(250, 250, 250);
    }
  }

  .MiddleAsideMenuDark {
    background-color: rgb(44, 62, 80);
  }

  .MenuItemDark {
    color: rgb(210, 210, 210);
  }

  .MenuItemDark:hover {
    background-color: rgb(55, 79, 102);
    color: rgb(220, 220, 220);
  }

  .MenuItemDark.is-active,
  .MenuItemDark:focus {
    background-color: rgb(65, 91, 118);
    color: rgb(240, 240, 240);
  }
}

.UserLogoDiv {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  position: relative;
  left: 50%;
  transform: translate(-50%);
  margin-top: 40px;
  margin-bottom: 40px;
  background-color: rgb(242, 242, 242);

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
}

.MiddleAsideDark {
  background-color: rgb(44, 62, 80);
}
</style>
