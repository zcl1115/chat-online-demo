<template>
  <el-container :class="{BGCDark: IsDarkModeProp}">
    <div class="ViewPersonalInfoDiv" :class="{BGCDark: IsDarkModeProp}">
      <div class="PersonalInfoLogoDiv">
        <img :src="UserLogoPathProp" />
      </div>
      <div class="InfoDiv" :class="{InfoDivDark: IsDarkModeProp}">
        <div class="UserIDDiv">帐号：{{ UserIDProp }}</div>
        <div class="UserNameDiv">昵称：{{ UserNameProp }}</div>
        <div class="UserIntroductionDiv">简介：{{ UserIntroductionProp }}</div>
      </div>
      <el-form label-position="right" label-width="80px">
        <el-form-item class="SubmitButtonFormItem" label-width="0">
          <el-button type="primary" class="SubmitButton" @click="SubmitButtonClicked()">修改信息</el-button>
          <el-button type="primary" class="SetLogoButton" @click="SetLogoButtonClicked()">修改头像</el-button>
        </el-form-item>
      </el-form>
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

<style  lang="less" scoped>
.el-container {
  height: 100%;
  margin: 0;
}

.ViewPersonalInfoDiv {
  height: 400px;
  width: 300px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .PersonalInfoLogoDiv {
    height: 150px;
    width: 150px;
    position: relative;
    left: 50%;
    top: 25%;
    transform: translate(-50%, -50%);
    margin-bottom: 50px;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }

  .InfoDiv {
    margin: 20px 0;
    text-align: center;
    font-size: 18px;
    color: #303133;

    .UserIDDiv,
    .UserNameDiv {
      margin-bottom: 20px;
    }
  }

  .InfoDivDark {
    color: rgb(230, 230, 230);
  }
}

.SubmitButtonFormItem {
  margin: 0;

  .SubmitButton {
    background-color: rgb(78, 81, 158);
    position: absolute;
    left: 25%;
    transform: translate(-50%);
    border: none;
  }

  .SetLogoButton {
    background-color: rgb(78, 81, 158);
    position: absolute;
    left: 75%;
    transform: translate(-50%);
    border: none;
    margin: 0;
  }
}

.BGCDark {
  background-color: #3a5169;
}
</style>
