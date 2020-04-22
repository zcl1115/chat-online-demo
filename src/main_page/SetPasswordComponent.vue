<template>
  <el-container>
    <div class="SetPasswordDiv">
      <div class="PersonalInfoLogoDiv">
        <img src="../assets/logo2.png" alt />
      </div>
      <el-form :label-position="labelPosition" label-width="80px" :model="SetPasswordForm">
        <el-form-item label="原密码：">
          <el-input v-model="SetPasswordForm.OldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码：">
          <el-input v-model="SetPasswordForm.NewPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认：">
          <el-input v-model="SetPasswordForm.ConfirmedPassword"></el-input>
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
      SetPasswordForm: {
        OldPassword: "",
        NewPassword: "",
        ConfirmedPassword: ""
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

.SetPasswordDiv {
  //background-color: red;
  height: 400px;
  width: 400px;
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
