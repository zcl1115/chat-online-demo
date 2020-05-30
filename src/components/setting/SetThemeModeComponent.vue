<template>
  <el-container :class="{BGCDark: IsDarkModeProp}">
    <div class="SetThemeModeDiv" :class="{BGCDark: IsDarkModeProp}">
      <el-button class="ModeButton" @click="ModeButtonClicked(false)">
        <img class="icon" :class="{show: !IsDarkModeProp}" src="icons/check.svg" />
        <img class="theme" src="images/light-theme.png" />
      </el-button>
      <el-button class="ModeButton" @click="ModeButtonClicked(true)">
        <img class="icon" :class="{show: IsDarkModeProp}" src="icons/check.svg" />
        <img class="theme" src="images/dark-theme.png" />
      </el-button>
    </div>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    ModeButtonClicked(val) {
      this.$emit("UpdatePersonalInfoInVue", { IsDarkMode: val });
    }
  },
  props: ["IsDarkModeProp"]
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  width: 100%;
}

.SetThemeModeDiv {
  width: 600px;
  height: 200px;
  margin: 200px auto;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .ModeButton {
    position: relative;
    height: 180px;
    width: 180px;
    padding: 0;
    border: none;

    .icon {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
    }

    .show {
      opacity: 1;
    }

    .theme {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
