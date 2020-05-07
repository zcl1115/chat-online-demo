<template>
  <el-container >
    <el-aside class="MiddleAside" width="300px">
      <div class="search_area">
        <el-input class="search_key"
                  placeholder="搜索联系人"
                  suffix-icon="el-icon-search"
                 >
        </el-input>
        <el-input
                class="search_key"
                  placeholder="添加好友"
                  suffix-icon=""
               >
        </el-input>
      </div>
     <div class="contact_list">
       <ul v-for="item in get_contacts" v-on:click="Select_friend(item.name,item.account,item.img_path,item.personal_profile)" class="contact">
         <img :src="item.img_path" class="round_icon">
         <a class="contact_name">{{item.name}}</a>
       </ul>
     </div>
    </el-aside>

    <div class="ViewPersonalInfoDiv" :class="{BGCDark: IsDarkModeProp}" v-if="isShow_personal">
      <div class="PersonalInfoLogoDiv">
        <img :src="search_img_path" />
      </div>
      <div class="InfoDiv" :class="{InfoDivDark: IsDarkModeProp}">
        <div class="UserIDDiv">帐号：{{search_account}}</div>
        <div class="UserNameDiv">昵称：{{search_name}}</div>
        <div class="UserIntroductionDiv">简介：{{ search_personal_profile }}</div>
      </div>
      <el-form label-position="right" label-width="80px">
        <el-form-item class="SubmitButtonFormItem" label-width="0">
          <el-button type="primary" class="SubmitButton" @click="Show_send_message()">发送信息</el-button>
        </el-form-item>
      </el-form>
    </div>



  </el-container>
</template>

<script>
  import moment from 'moment';

  import {getCookie} from "../components/cookieUtil";
  export default {
    name: "main",
    data(){
      return {
        logoURL:require("../assets/logo.png"),
        search_account:'',
        search_name:'',
        search_img_path:'',
        search_personal_profile:'',
        account:'',
        get_contacts:[],
        isShow_personal:false,


      }
    },
 created(){
   this.account = getCookie("user_account");
   this.init_contacts();

 },
    // },
      methods:{


        init_contacts(){
          var id=this.account;
          this.axios.post("api/friend/get_contacts", this.qs.stringify({
            account: id
          })).then((response) => {
            this.get_contacts=response.data;

          });

        },
        Select_friend(name,account,img_path,personal_profile){
        this.search_account=account;
        this.search_name=name;
        this.search_img_path=img_path;
        this.search_personal_profile=personal_profile;
        this.isShow_personal=true;
        },
        Show_send_message(){

          var time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
          var user_account=this.account;
          var contact_account=this.search_account;
          this.axios.post("api/friend/update_recent_contacts", this.qs.stringify({
            user_account:user_account,time:time,contact_account:contact_account
          })).then((response) => {
          });


        },


  },


  }
</script>
<style>
  .dark_search .el-input__inner {
    background-color: rgb(0, 0, 0);
    color: rgb(240, 240, 240);
  }
</style>

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
  .contact_list{
    width: 100%;
    height: 83%;
    overflow: auto;
    overflow-x: hidden;
  }
  .round_icon{
    width: 40px;
    height: 40px;
    display: flex;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    float: left;
    margin-left: -30px;
  }
  .contact_name{
    float: left;
    width: 100px;
    text-align: left;
    margin-top: 12px;
    margin-left: 20px;
  }
  .ViewPersonalInfoDiv {
    height: 400px;
    width: 300px;
    position: relative;
    left: 35%;
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
    left: 50%;
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


  .contact{
    width: 100%;
    height: 60px;
  }
</style>
