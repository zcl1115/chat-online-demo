<template>
  <el-container class="container" :class="{'container-dark': IsDarkModeProp}">
    <div class="view-user-info">
      <div class="info-div">
        <div class="info-avatar">
          <img :src="UserLogoPathProp" />
        </div>
        <div class="info-account">帐号：{{ UserIDProp }}</div>
        <div class="info-nickname">昵称：{{ UserNameProp }}</div>
        <div class="info-introduction">简介：{{ UserIntroductionProp }}</div>
      </div>
      <div class="button-div">
        <el-button type="primary" @click="SubmitButtonClicked()">修改信息</el-button>
        <el-button type="primary" @click="SetLogoButtonClicked()">修改头像</el-button>
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    SubmitButtonClicked() {
      this.$emit("SetDisplayMark", "SetPersonalInfoComponent");
    },
    SetLogoButtonClicked() {
      this.$emit("SetDisplayMark", "SetLogoComponent");
    }
  },
  props: [
    "UserIDProp",
    "UserNameProp",
    "UserIntroductionProp",
    "UserLogoPathProp",
    "IsDarkModeProp"
  ],

  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--info-font-color);
  background-color: var(--right-bg-color);
}

.container-dark {
  color: var(--info-font-color-dark);
  background-color: var(--right-bg-color-dark);
}

.view-user-info {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .info-div {
    margin-bottom: 20px;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .info-avatar {
      img {
        height: 150px;
        width: 150px;
        border-radius: 50%;
      }
    }

    .info-avatar,
    .info-account,
    .info-nickname,
    .info-introduction {
      margin: 10px 0;
      display: flex;
      justify-content: center;
    }
  }

  .button-div {
    width: 100%;
    display: flex;
    justify-content: space-around;

    button {
      background-color: var(--special-color);
      border: none;
      color: white;
    }

    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
</style>
