<template>
  <el-container>
    <div class="ViewPersonalInfoDiv">
      <div class="PersonalInfoLogoDiv">
        <img src="../assets/logo2.png" alt />
      </div>
      <div class="InfoDiv">
        <div class="UserIDDiv">帐号：{{ UserID }}</div>
        <div class="UserNameDiv">昵称：{{ UserName }}</div>
      </div>
      <el-form :label-position="'right'" label-width="80px">
        <el-form-item class="SubmitButtonFormItem" label-width="0">
          <el-button type="primary" class="SubmitButton" @click="SubmitButtonClicked()">点击修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      UserID: "abcd123",
      UserName: "abcd"
    };
  },
  methods: {
    SubmitButtonClicked() {
      this.$emit('SetDisplayMark', 'SetPersonalInfoComponent')
    }
  },
  props: {

  }
};
</script>

<style  lang="less" scoped>
.el-container {
  height: 100%;
  margin: 0;
}

.ViewPersonalInfoDiv {
  //background-color: red;
  height: 400px;
  width: 300px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .PersonalInfoLogoDiv {
    //background-color: blue;
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
    font-size: 16px;
    color: #303133;

    .UserIDDiv {
      margin-bottom: 10px;
    }
  }
}

.SubmitButtonFormItem {
  margin: 0;

  .SubmitButton {
    background-color: rgb(78, 81, 158);
    position: relative;
    left: 50%;
    transform: translate(-50%);
    border: none;
  }
}
</style>
