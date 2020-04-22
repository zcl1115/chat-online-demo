<template>
  <el-container>
    <el-aside class="MiddleAside" width="300px">
      <el-menu>
        <el-menu-item index="2-1" class="LogoutButton">退出登录</el-menu-item>
        <el-menu-item
          index="2-2"
          class="OtherSettingButtons"
          @click="RightSideDisplayMark = 'ViewPersonalInfoComponent'"
        >个人信息</el-menu-item>
        <el-menu-item
          index="2-3"
          class="OtherSettingButtons"
          @click="RightSideDisplayMark = 'SetPasswordComponent'"
        >帐号密码</el-menu-item>
        <el-menu-item
          index="2-4"
          class="OtherSettingButtons"
          @click="RightSideDisplayMark = 'SetThemeComponent'"
        >设置主题</el-menu-item>
      </el-menu>
    </el-aside>
    <component :is="RightSideDisplayMark" @SetDisplayMark="SetDisplayMark"></component>
  </el-container>
</template>

<script>
import ViewPersonalInfoComponent from "./ViewPersonalInfoComponent.vue";
import SetPersonalInfoComponent from "./SetPersonalInfoComponent.vue";
import SetPasswordComponent from "./SetPasswordComponent.vue";

export default {
  name: "main",
  data() {
    return {
      logoURL: require("../assets/logo.png"),
      RightSideDisplayMark: "ViewPersonalInfoComponent",

      labelPosition: "right",
      PersonlInfoForm: {
        NewName: "",
        NewInstroduction: ""
      }
    };
  },
  // },
  methods: {
    SetDisplayMark(val) {
      this.RightSideDisplayMark = val
    }
  },
  components: {
    ViewPersonalInfoComponent,
    SetPersonalInfoComponent,
    SetPasswordComponent
  }
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
}

.MiddleAside {
  background-color: rgb(247, 247, 247);
  text-align: center;

  .el-menu {
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
  }
}
</style>
