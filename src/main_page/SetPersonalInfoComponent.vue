<template>
  <el-container>
    <div class="PersonalInfoDiv">
      <div class="PersonalInfoLogoDiv">
        <img src="../assets/logo2.png" alt />
      </div>
      <el-form :label-position="labelPosition" label-width="80px" :model="PersonlInfoForm">
        <el-form-item label="昵称：">
          <el-input v-model="PersonlInfoForm.NewName"></el-input>
        </el-form-item>
        <el-form-item label="简介：">
          <el-input v-model="PersonlInfoForm.NewInstroduction"></el-input>
        </el-form-item>
        <el-form-item class="SubmitButtonFormItem" label-width="0">
          <el-button type="primary" class="SubmitButton">提交修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-container>
</template>

<script>
export default {
  name: "main",
  data() {
    return {
      labelPosition: "right",
      PersonlInfoForm: {
        NewName: "",
        NewInstroduction: ""
      }
    };
  },
  methods: {}
};
</script>

<style  lang="less" scoped>
.el-container {
  height: 100%;
  margin: 0;
}

.PersonalInfoDiv {
  //background-color: red;
  height: 400px;
  width: 500px;
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
