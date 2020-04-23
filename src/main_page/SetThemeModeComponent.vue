<template>
  <el-container :class="{BGCDark: IsDarkModeProp}">
    <div class="SetThemeModeDiv" :class="{BGCDark: IsDarkModeProp}">
      <el-container
        direction="horizontal"
        class="ModeButtonsContainer"
        :class="{BGCDark: IsDarkModeProp}"
      >
        <el-button
          class="ModeButton"
          :class="{ButtonDark: IsDarkModeProp}"
          @click="ModeButtonClicked(false)"
        >
          <img src="../assets/img/DayMode.svg" />
        </el-button>
        <el-button
          class="ModeButton"
          @click="ModeButtonClicked(true)"
          :class="{ButtonDark: IsDarkModeProp}"
        >
          <img src="../assets/img/DarkMode.svg" />
        </el-button>
      </el-container>
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
  margin: 0;
}

.SetThemeModeDiv {
  height: 400px;
  width: 600px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .ModeButton {
    height: 150px;
    width: 150px;
    margin-left: 100px;
    background-color: #fff;
    border: none;
    border-radius: 25px;

    img {
      height: 100%;
      width: 100%;
    }
  }

  .ButtonDark {
    background-color: #2c3e50;
  }

  .ModeButton:hover,
  .ModeButton:active,
  .ModeButton:focus {
    background-color: rgba(78, 81, 158, 100%);
  }
}

.BGCDark {
  background-color: rgb(0, 0, 0);
}
</style>
