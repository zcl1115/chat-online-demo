<template>
  <el-container :class="{BGCDark: IsDarkModeProp}"></el-container>
</template>

<script>
export default {
  props: ["IsDarkModeProp"]
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  width: 100%;
}
</style>