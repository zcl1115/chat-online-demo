<template>
    <el-container>
      <el-aside class="MiddleAside" :class="{MiddleAsideDark: IsDarkMode}" width="300px">
        <el-menu class="MiddleAsideMenu" :class="{MiddleAsideMenuDark: IsDarkMode}">
          <el-menu-item
            index="2-1"
            class="LogoutButton"
            @click="LogoutButtonClicked()"
            :class="{MenuItem2Dark: IsDarkMode}"
          >退出登录</el-menu-item>
          <el-menu-item
            index="2-2"
            class="OtherSettingButtons"
            @click="RightSideDisplayMark = 'ViewPersonalInfoComponent'"
            :class="{MenuItemDark: IsDarkMode}"
          >个人信息</el-menu-item>
          <el-menu-item
            index="2-3"
            class="OtherSettingButtons"
            @click="RightSideDisplayMark = 'SetPasswordComponent'"
            :class="{MenuItemDark: IsDarkMode}"
          >帐号密码</el-menu-item>
          <el-menu-item
            index="2-4"
            class="OtherSettingButtons"
            @click="RightSideDisplayMark = 'SetThemeModeComponent'"
            :class="{MenuItemDark: this.IsDarkMode}"
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
import ViewPersonalInfoComponent from "./ViewPersonalInfoComponent.vue";
import SetPersonalInfoComponent from "./SetPersonalInfoComponent.vue";
import SetPasswordComponent from "./SetPasswordComponent.vue";
import SetLogoComponent from "./SetLogoComponent.vue";
import SetThemeModeComponent from "./SetThemeModeComponent.vue";
import { getCookie, DeleteCookie } from "../components/cookieUtil";

const UserDefaultLogoPath = getCookie('user_img_path');
const GetPersonalInfoURL = "api/setting/GetPersonalInfo";
const GetPersonalLogoURL = "api/setting/GetPersonalLogo";
const SetLoginStatusURL = "api/setting/SetLoginStatus"
const UserIDCookie = "user_account";
const LoginMark = true;
const LogoutMark = false;

export default {
  data() {
    return {
      RightSideDisplayMark: "ViewPersonalInfoComponent",

      UserID: "",
      UserName: "",
      UserIntroduction: "",
      UserLogoPath: UserDefaultLogoPath,
    };
  },
  props:{
    IsDarkMode: {
      type: Boolean,
    }
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
        console.log("response.data:", response.data);
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

        console.log("UserLogoURL:", UserLogoURL);
      });
    },
    UpdatePersonalInfoInVue(val) {
      if (val.NewName) {
        this.UserName = val.NewName;
      }
      if (val.NewIntroduction) {
        this.UserIntroduction = val.NewIntroduction;
      }
      if (val.UserLogoPath) {
        this.UserLogoPath = val.UserLogoPath;
      }
      if (val.IsDarkMode !== undefined) {
        var mode=val.IsDarkMode;
        this.$emit("UpdateModle", { mode });
      }
    },
    LogoutButtonClicked() {
      this.SetLoginStatus(LogoutMark);
      DeleteCookie(UserIDCookie);

      window.location.href = "login.html";
    },
    SetLoginStatus(val) {
      var SendObj = this.qs.stringify({
        UserID: this.UserID,
        LoginStatus: val
      });
      console.log("SendObj: ", SendObj);

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

  beforeCreate() {},
  created() {
    this.UserID = getCookie(UserIDCookie);

    this.SetLoginStatus(LoginMark);
    this.GetPersonalInfo();
    this.GetPersonalLogo();
  },
  beforeMount() {},
  mounted() {}
};
</script>

<style  lang="less" scoped>

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
      background-color: rgb(0, 0, 0);
      color: rgb(220, 220, 220);
    }

    .MenuItem2Dark:hover {
      background-color: rgb(0, 0, 0);
      color: rgb(240, 240, 240);
    }

    .MenuItem2Dark.is-active {
      background-color: #1A1A1A;
      color: rgb(250, 250, 250);
    }
  }

  .MiddleAsideMenuDark {
    background-color: rgb(0, 0, 0);
  }

  .MenuItemDark {
    color: rgb(210, 210, 210);
  }

  .MenuItemDark:hover {
    background-color: rgb(0, 0, 0);
    color: rgb(220, 220, 220);
  }

  .MenuItemDark.is-active {
    background-color: #1A1A1A;
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
  background-color: rgb(0, 0, 0);
}
</style>
