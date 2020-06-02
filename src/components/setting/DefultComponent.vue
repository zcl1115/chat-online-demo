<template>
  <el-container class="container" :class="{'container-dark': IsDarkModeProp}"></el-container>
</template>

<script>
export default {
  props: ["IsDarkModeProp"]
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: var(--right-bg-color);
}

.container-dark {
  background-color: var(--right-bg-color-dark);
}
</style>