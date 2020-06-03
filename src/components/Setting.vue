<template>
  <el-container>
    <el-aside class="MiddleAside" :class="{MiddleAsideDark: IsDarkMode}" width="280px">
      <button
        class="LogoutButton"
        @click="LogoutButtonClicked()"
        :class="{LogoutButtonDark: IsDarkMode}"
      >退出登录</button>
      <el-menu class="MiddleAsideMenu" :class="{MiddleAsideMenuDark: IsDarkMode}">
        <el-menu-item
          index="ViewPersonalInfoComponent"
          class="MenuItem"
          @click="SetDisplayMark('ViewPersonalInfoComponent')"
          :class="{MenuItemDark: IsDarkMode}"
        >个人信息</el-menu-item>
        <el-menu-item
          index="SetPasswordComponent"
          class="MenuItem"
          @click="SetDisplayMark('SetPasswordComponent')"
          :class="{MenuItemDark: IsDarkMode}"
        >帐号密码</el-menu-item>
        <el-menu-item
          index="SetThemeModeComponent"
          class="MenuItem"
          @click="SetDisplayMark('SetThemeModeComponent')"
          :class="{MenuItemDark: IsDarkMode}"
        >设置主题</el-menu-item>
      </el-menu>
    </el-aside>
    <component
      :is="RightSideDisplayMark"
      @SetDisplayMark="SetDisplayMark"
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
import DefultComponent from "./setting/DefultComponent.vue";
import ViewPersonalInfoComponent from "./setting/ViewPersonalInfoComponent.vue";
import SetPersonalInfoComponent from "./setting/SetPersonalInfoComponent.vue";
import SetPasswordComponent from "./setting/SetPasswordComponent.vue";
import SetLogoComponent from "./setting/SetLogoComponent.vue";
import SetThemeModeComponent from "./setting/SetThemeModeComponent.vue";
import { getCookie, DeleteCookie, setCookie } from "./cookieUtil";

const GetPersonalInfoURL = "api/setting/GetPersonalInfo";
const GetPersonalLogoURL = "api/setting/GetPersonalLogo";
const LogoutURL = "api/setting/Logout";
const UserIDCookieKey = "user_account";
const UserLogoPathCookieKey = "UserLogoPath";
const UserNameCookieKey = "UserName";
const UserIntroductionCookieKey = "UserIntroduction";

export default {
  data() {
    return {
      RightSideDisplayMark: "DefultComponent",
      UserID: getCookie(UserIDCookieKey),
      UserName: getCookie(UserNameCookieKey),
      UserIntroduction: getCookie(UserIntroductionCookieKey),
      UserLogoPath: getCookie(UserLogoPathCookieKey)
    };
  },
  methods: {
    SetDisplayMark(val) {
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
      var SendObj = this.qs.stringify({
        UserID: this.UserID
      });

      this.axios.post(LogoutURL, SendObj).then(response => {
        if (!response.data.Status) {
          this.$message({
            showClose: true,
            message: "登出失败，请重试！",
            type: "error"
          });

          return;
        }

        DeleteCookie(UserIDCookieKey);
        window.location.href = "login.html";
      });
    }
  },
  components: {
    DefultComponent,
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

  // Light
  .MiddleAside {
    text-align: center;
    background-color: var(--mid-bg-color);

    .LogoutButton {
      width: 220px;
      height: 34px;
      line-height: 34px;
      margin: 50px auto;
      outline: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      color: var(--menu-font-color);
      background-color: var(--mid-clicked-color);
    }

    .LogoutButton:hover {
      color: white;
      background-color: var(--special-color);
    }

    .MiddleAsideMenu {
      border: none;
      background-color: var(--mid-bg-color);

      .MenuItem {
        height: 75px;
        line-height: 75px;
        color: var(--menu-font-color);
      }

      .MenuItem:hover {
        background-color: var(--mid-hover-color);
      }

      .MenuItem.is-active {
        background-color: var(--mid-clicked-color);
      }
    }
  }

  // Dark
  .MiddleAsideDark {
    background-color: var(--mid-bg-color-dark);

    .LogoutButtonDark {
      color: var(--menu-font-color-dark);
      background-color: var(--mid-clicked-color-dark);
    }

    .MiddleAsideMenuDark {
      background-color: var(--mid-bg-color-dark);

      .MenuItemDark {
        color: var(--menu-font-color-dark);
      }

      .MenuItemDark:hover {
        background-color: var(--mid-hover-color-dark);
      }

      .MenuItemDark.is-active {
        background-color: var(--mid-clicked-color-dark);
      }
    }
  }
}
</style>
