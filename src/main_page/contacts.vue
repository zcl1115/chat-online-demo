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
                   v-model="add_account"
                @keyup.enter.native="Search_user()"
               >
        </el-input>
      </div>
      <div v-on:click="Show_new_friend()" class="new_friend">好友申请</div>
     <div class="contact_list">
       <ul v-for="item in get_contacts" v-bind:key="item.account" v-on:click="Select_friend(item.name,item.account,item.img_path,item.personal_profile)" class="contact">
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
      <el-row>
        <el-form-item class="SubmitButtonFormItem" label-width="0">
          <el-button type="primary" @click="Del_contact()"v-if="!isShow_add_user&&isShow_personal">删除好友</el-button>
          <el-button type="primary" class="SubmitButton" @click="Show_send_message()"v-if="!isShow_add_user&&isShow_personal">发送信息</el-button>
          <el-button type="primary" class="SubmitButton" @click="Show_send_application()"v-if="isShow_add_user&&isShow_personal">添加好友</el-button>
        </el-form-item>
        </el-row>


      </el-form>
    </div>
 <div v-if="isShow_application" class="send_application">
      <h2>验证信息</h2>
      <textarea id="add_message">
           Hello!
         </textarea>
      <el-button v-on:click="Send_application()" class="submit">发送申请</el-button>
    </div>
    <div v-if="isShow_ok" class="show_ok">
      <label>发送成功</label>
    </div>

  <div class="application_list" v-if="isShow_new_friend_list">
    <ul v-for="(item,index) in new_friend"   v-on:click="Select_new_friend(item.name,item.account,item.img_path,item.content,item.status,item.personal_profile,item.id,index)" class="application">
      <img :src="item.img_path">
        <p><span class="application_name">{{item.name}}</span>请求添加您为好友    </p>

    </ul>
  </div>
<div class="application_area" v-if="isShow_new_application">
  <h2>好友申请</h2>
    <img :src="search_img_path">
    <p class="a_name">{{search_name}}</p>
<p class="a_msg">{{search_content}}</p>
  <el-button type="primary" v-on:click="Add_friend()" class="add_submit" v-if="isShow_application_button">同意</el-button><el-button type="primary" v-on:click="Refuse_friend()" class="refuse_submit" v-if="isShow_application_button">拒绝</el-button>
  <p v-else="isShow_application_button">{{this.request_status}}</p>
</div>


  </el-container>
</template>

<script>
  import moment from 'moment';

  import {getCookie} from "../components/cookieUtil";

  export default {
    data(){
      return {
        logoURL:require("../assets/logo.png"),
        search_account:'',
        search_name:'',
        search_img_path:'',
        search_personal_profile:'',
        request_id:'',
        request_status:'',
        account:'',
         name:'',
        get_contacts:[],
        isShow_personal:false,
         add_account:'',
        isShow_application:false,
        isShow_ok:false,
        isShow_add_user:false,
        isShow_new_friend_list:false,
        application_msg:[],
        new_friend:[],
        isShow_new_application:false,
        isShow_application_button:false,
        Index:0,

      }
    },
    props: {
      IsDarkMode: {
        type: Boolean
      },
      selected_contact: {
        type: String
      }
    },
     created(){
       this.account = getCookie("user_account");
       this.init_contacts();
       this.init_name();
     },
     mounted(){

    },
      methods:{

      init_name(){
          this.axios.post("api/friend/get_user", this.qs.stringify({
            account: this.account
          })).then((response) => {
            var temp=response.data;
            this.name=temp[0].name;
          });
        },
        init_contacts(){
          var id=this.account;
          this.axios.post("api/friend/get_contacts", this.qs.stringify({
            account: id
          })).then((response) => {
            console.log(response.data);
            this.get_contacts=response.data;
            let i;
            for (i in this.get_contacts) {
              var FileLength = this.get_contacts[i].img_path.data.length;
              var Array1 = new ArrayBuffer(FileLength);
              var Array2 = new Uint8Array(Array1);

              for (var j = 0; j < FileLength; j++) {
                Array2[j] = this.get_contacts[i].img_path.data[j];
              }
              var FileBlob = new Blob([Array2], { type: "" });
              this.get_contacts[i].img_path = URL.createObjectURL(FileBlob);
            }
          });

        },
        Select_friend(name,account,img_path,personal_profile){
          this.search_account=account;
          this.search_name=name;
          this.search_img_path=img_path;
          this.search_personal_profile=personal_profile;
          this.isShow_personal=true;
          this.isShow_new_application=false;
          this.isShow_ok=false;
        },
        Show_send_message(){

          var time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
          var user_account=this.account;
          var contact_account=this.search_account;
          this.axios.post("api/friend/update_recent_contacts", this.qs.stringify({
            user_account:user_account,time:time,contact_account:contact_account
          })).then((response) => {
            console.log(response);
            this.$emit("skip_chatting",{contact:this.search_account});
          });
          this.isShow_ok=false;

        },
         Search_user(){
          this.search_account=this.add_account;
          var id=this.search_account;
          this.axios.post("api/friend/get_user", this.qs.stringify({
            account: id
          })).then((response) => {
            console.log(response.data);
            this.get_contacts=response.data;
            let i;
            for (i in this.get_contacts) {
              var FileLength = this.get_contacts[i].img_path.data.length;
              var Array1 = new ArrayBuffer(FileLength);
              var Array2 = new Uint8Array(Array1);

              for (var j = 0; j < FileLength; j++) {
                Array2[j] = this.get_contacts[i].img_path.data[j];
              }
              var FileBlob = new Blob([Array2], { type: "" });
              this.get_contacts[i].img_path = URL.createObjectURL(FileBlob);
            }

          });
          this.axios.post("api/friend/is_contact", this.qs.stringify({
            user_account: this.account,contact_account:id
          })).then((response) => {
              this.isShow_add_user=response.data.IsContact;
          });
          this.isShow_personal=false;
          this.isShow_application=false;
          this.isShow_ok=false;
          this.isShow_new_friend_list=false;
          this.isShow_new_application=false;
        },
        Show_send_application() {
          this.isShow_personal=false;
          this.isShow_application=true;
          this.isShow_ok=false;
          this.isShow_new_friend_list=false;
          this.isShow_new_application=false;

        },
        Send_application(){
          var message = document.getElementById("add_message").value;
          this.$socket.emit('sendApplication', {'to': this.search_account, 'message': message});
          this.isShow_personal=false;
          this.isShow_application=false;
          this.isShow_ok=true;
          this.isShow_new_friend_list=false;
          this.isShow_new_application=false;
          },
        Show_new_friend(){
          var account=this.account
          this.axios.post("api/friend/get_app", this.qs.stringify({
            account: account
          })).then((response) => {
            this.new_friend=[];
            console.log(response.data);
            var nf=response.data;
            for(var i=0;i<nf.length;i++)
            {
                var FileLength = nf[i].img_path.data.length;
                var Array1 = new ArrayBuffer(FileLength);
                var Array2 = new Uint8Array(Array1);
                for (var j = 0; j < FileLength; j++) {
                   Array2[j] = nf[i].img_path.data[j];
                }
                var FileBlob = new Blob([Array2], { type: "" });
                nf[i].img_path = URL.createObjectURL(FileBlob);
                this.new_friend.push(nf[i]);
            }
          });
          this.isShow_personal=false;
          this.isShow_application=false;
          this.isShow_ok=false;
          this.isShow_new_friend_list=true;
          this.isShow_new_application=false;
        },
        Del_contact(){
          var account=this.account
          var contact_account=this.search_account
          this.axios.post("api/friend/del_contact", this.qs.stringify({
            account:account, contact_account:contact_account
          })).then((response) => {
              this.init_contacts();
              this.isShow_personal=false;
              this.isShow_application=false;
              this.isShow_ok=true;
              this.isShow_new_friend_list=false;
              this.isShow_new_application=false;
          });
          this.axios.post("api/friend/del_History", this.qs.stringify({
              account:account, contact_account:contact_account
            })).then((response) => {

            });

        },
        Select_new_friend(name,account,img_path,content,status,personal_profile,id,index){
            if(status=="添加成功"){
                this.isShow_new_application=false;
                this.isShow_personal=false;
                this.isShow_application=false;
                this.isShow_ok=false;
                this.isShow_new_friend_list=false;
                this.Select_friend(name,account,img_path,personal_profile);
            }
            else if(status=="待处理"){
                this.Index=index;
                this.search_account=account;
                this.search_name=name;
                this.request_id=id;
                this.request_status=status;
                this.search_img_path=img_path;
                this.search_content=content;
                this.isShow_application_button=true;
                this.isShow_new_application=true;
                this.isShow_personal=false;
                this.isShow_application=false;
                this.isShow_ok=false;
                this.isShow_new_friend_list=false;
            }
            else{
                this.Index=index;
                this.search_account=account;
                this.search_name=name;
                this.request_id=id;
                this.request_status=status;
                this.search_img_path=img_path;
                this.search_content=content;
                this.isShow_application_button=false;
                this.isShow_new_application=true;
                this.isShow_personal=false;
                this.isShow_application=false;
                this.isShow_ok=false;
                this.isShow_new_friend_list=false;
            }



        },
        Add_friend(){
          this.isShow_personal=false;
          this.isShow_application=false;
          this.isShow_ok=true;
          this.isShow_new_friend_list=false;
          this.isShow_new_application=false;
          this.axios.post("api/friend/change_status", this.qs.stringify({
             user_account: this.account,contact_account:this.search_account,status:1
           })).then((response) => {
           });
          this.axios.post("api/friend/add_contact", this.qs.stringify({
            user_account: this.account,contact_account:this.search_account,name:this.search_name
          })).then((response) => {
          });

          this.axios.post("api/friend/add_contact", this.qs.stringify({
            user_account: this.search_account,contact_account:this.account,name:this.name
          })).then((response) => {
          });

          this.init_contacts();
        },
        Refuse_friend(){
          this.isShow_personal=false;
          this.isShow_application=false;
          this.isShow_ok=true;
          this.isShow_new_friend_list=false;
          this.isShow_new_application=false;
          this.axios.post("api/friend/change_refuse_status", this.qs.stringify({
           request_id:this.request_id
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
  .send_application{
       position: absolute;
       left: 50%;
      top:20%;
      width:300px;

    }
    .send_application h2{
     text-align: center;
        width:100%;
    }
    .send_application textarea{
        display:inline-block;
        width:100%;
        height: 200px;
        border: black 1px solid;
        border-radius:5px;
        font-size: 20px;

    }
    .send_application .submit{
        background-color:rgb(78, 81, 158);
        position: relative;
        width:100%;

        height: 50px;
        color: white;
        border-radius:5px;
        margin-top: 20px;
    }
    .show_ok{
        position: absolute;
        left: 50%;
        top:40%;
        font-size: 16px;
    }
    .new_friend{
        width: 100%;
        height: 40px;
        margin-bottom: 5px;

        background-color: #b3c0d1 ;
      border-radius: 5px;
        text-align: center;
        position: relative;
        line-height: 40px;
        color: white;
    }
    .application_list{
        position: relative;
        overflow: auto;
        overflow-x: hidden;
    }
    .application{
        height: 50px;
        line-height: 100%;
        font-size: 16px;
        color: #b3c0d1;
        border-bottom: #b3c0d1 1px solid;
    }
    .application img{
        width: 50px;
        height: 50px;
        display: flex;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        float: left;
        margin-left: 20px;
    }
    .application .application_name{
        color: black;
        font-size: 21px;
        font-weight: bold;
        margin-left: 5px;
        margin-right: 5px;
    }
    .application p{
        display: inline-block;
        font-size: 16px;
    }
    .application_area{
        position: absolute;
        left: 50%;
        top:20%;
        width:300px;
    }
    .application_area h2{
         width: 100%;
         text-align: center;
     }
    .application_area img{
        width: 50px;
        height: 50px;
        display: flex;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        float: left;

        left:30% ;

    }
  .application_area .a_name{

      display: inline-block;
      line-height: 100%;
      font-size: 20px;
      margin-left: 10px;
  }
    .application_area .a_msg{
        width: 280px;
        border: #b3c0d1 1px solid;

        height: 120px;
        overflow: auto;
        padding: 10px;
        font-size: 16px;

    }
    .application_area button{
        width:40%;
        height:40px;
        margin-top: 10px;
        font-size: 18px;
        border-radius: 5px;
    }
    .application_area .add_submit{
        background-color:rgb(78, 81, 158);
        color: white;
        float: left;

    }
    .application_area .refuse_submit{
        background-color: white;
        color: black;
        margin-left: 20%;
        border: black 1px solid;

    }

</style>
