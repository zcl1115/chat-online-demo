<template>
  <el-container>
    <el-aside class="MiddleAside" width="300px">
      <div class="search_area">
        <el-input class = "search_key"
                  placeholder="搜索最近联系人"
                  suffix-icon="el-icon-search">
        </el-input>
        <el-input class = "search_key"
                  placeholder="添加好友"
                  suffix-icon="">
        </el-input>
      </div>
    </el-aside>

  </el-container>
</template>

<script>
  export default {
    name: "main",
    data(){
      return {
        logoURL:require("../assets/logo.png"),
      }
    },
    // },
    methods:{

    },
  }
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
  }

  .search_area{
    text-align: center;
    width: 100%;
    height: 15%;
    line-height: 6;
  }
  .search_key{
    float: right;
    height: 40px;
  }

</style>
