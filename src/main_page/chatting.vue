<template>
    <el-container :class="{el_dark: IsDarkMode}">
      <el-aside class="MiddleAside" :class="{MiddleAsideDark: IsDarkMode}" width="300px">
        <div class="search_area">
          <el-input
                  :class="{dark_search: IsDarkMode}"
                  placeholder="搜索最近联系人"
                  v-model="search_name"
                  suffix-icon="el-icon-search">
          </el-input>
        </div>
        <div class="recent_contacts" >
          <ul v-for="(people,index) in filter_recent_contacts" v-bind:key="index" class="contact" :class="{contact_dark: IsDarkMode, addclass: isactive === index}" v-on:click="select_contact(people.name,people.contact,index)">
            <img :src="people.img_path" class="round_icon">
            <a class="contact_name">{{people.name}}</a>
            <img src="../assets/point.png" class="notice" v-if="unread_contacts.indexOf(people.contact) !== -1 && isactive !== index"/>
          </ul>
        </div>
      </el-aside>
      <div class="chat_area" v-if="isShow" :class="{chat_area_dark: IsDarkMode}">
        <div class="friend_name" :class="{friend_name_dark: IsDarkMode}">
          {{contacts}}
<!--          {{contact_account}}-->
        </div>
        <!--eslint-disable-next-line-->
        <div class="message_show">
          <div class="message_box" v-for="(message, index) in messages" :key="index">
            <div v-if="message.to === contact_account && message.from === account">
              <!--            <img :src="recent_contacts_list[isactive].img_path" class="contactor_avatar">-->
              <div class="btalk">
                <div class="avatar_box">
                  <img :src="img_path" class="contactor_avatar">
                </div>
                <span class="message" v-if="message.type === 0">{{message.content}}</span>
                <span class="message" v-if="message.type === 1">
                  <a class="file_name">{{message.content}}</a>
                  <img class="file_icon" src="../assets/download.png" v-on:click="download(message)">
                </span>
                <br/>
                <br/>
                <br/>
                <br/>
              </div>
            </div>
            <div v-if="message.from === contact_account && message.to === account">
              <div class="atalk">
                <div class="avatar_box">
                  <img :src="recent_contacts_list[isactive].img_path" class="contactor_avatar">
                </div>
                <span class="message" v-if="message.type === 0">{{message.content}}</span>
                <span class="message" v-if="message.type === 1">
                  <img class="file_icon" src="../assets/download.png" v-on:click="download(message)">
                  <a class="file_name">{{message.content}}</a>
                </span>
                <br/>
                <br/>
                <br/>
                <br/>
              </div>
            </div>
          </div>
        </div>
        <div class="input_message">
          <div class="function_area" style="">
            <img class="icon" src="../assets/emoji.svg" v-on:click="emoji_picker_isShow = !emoji_picker_isShow" >
            <img class="icon" src="../assets/upload.svg" onclick="document.getElementById('upload_clicked').click();">
            <input type="file" class="upload" id="upload_clicked" v-show="false" @change="uploadFile">
            <emoji_picker @emoji_clicked = "emoji_clicked" :inputData="emoji_picker_isShow"></emoji_picker>
          </div>
          <div class="input_area">
            <textarea class="content" :class="{content_dark: IsDarkMode}" id="message" type="text"/>
          </div>
          <div class="send_area">
            <el-button type="primary" v-on:click="send_message()" style="background: rgb(80,80,160);border:rgb(80,80,160)">发送<i class="el-icon-s-promotion el-icon--right" ></i></el-button>
          </div>
        </div>
      </div>
    </el-container>
</template>

<script>
  import {getCookie} from "../components/cookieUtil";
  import emoji_picker from "../components/emoji_picker";
  import FileSaver from 'file-saver';

  export default {
    components:{
      emoji_picker,
    },
    data(){
      return {
        account:'',
        img_path:getCookie('user_img_path'),
        logoURL:require("../assets/logo.png"),
        contacts:'',
        contact_account:'',
        recent_contacts_list:[],
        isShow:false,
        isactive:-1,
        messages:[],
        unread_contacts:[],
        emoji_picker_isShow:false,
        file_selector_isShow:false,
        cur_file:"",
        fileData:"",
        search_name:'',
      }
    },
    props:{
      IsDarkMode: {
        type: Boolean,
      }
    },
    created(){
      this.account = getCookie("user_account");
      this.init_recent_contacts();
    },
    mounted(){
      this.sockets.subscribe('message', (data) => {
        this.messages.push(data);
        this.unread_contacts.push(data.from);

        var i=this.get_index(data.from);
        let temp=this.recent_contacts_list[i];
        temp.chat_time=data.time;
        this.$set(this.recent_contacts_list,i,temp);
        this.recent_contacts_list.sort((a,b) => {
          let atime=a.chat_time;
          let btime=b.chat_time;
          atime=atime.replace(/-/g,'/');
          btime=btime.replace(/-/g,'/');
          let a1=new Date(atime).getTime();
          let b1=new Date(btime).getTime();
          return b1-a1;
        });
      });
      this.sockets.subscribe('getFile', (data) => {
        console.log("receive file");
        var blob = new Blob([data.arraybuffer], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, data.file_name);
        // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
        // FileSaver.saveAs(blob, "hello world.txt");
      });
      this.sockets.subscribe('login', (data) => {
        console.log("login");
        console.log(data);
        console.log(this.img_path);
      });

    },
    methods: {
      select_contact(name, account, index) {
        this.contacts = name;
        this.contact_account = account;
        this.isShow = true;
        this.isactive = index;
        this.unread_contacts.splice(this.unread_contacts.indexOf(account),1);
      },
      init_recent_contacts() {
        var temp = getCookie("user_account");
        this.axios.post("api/chat/get_recent_list", this.qs.stringify({
          account: temp
        })).then((response) => {
          this.recent_contacts_list = response.data;
          this.recent_contacts_list.sort((a,b) => {
            let atime=a.chat_time;
            let btime=b.chat_time;
            atime=atime.replace(/-/g,'/');
            btime=btime.replace(/-/g,'/');
            let a1=new Date(atime).getTime();
            let b1=new Date(btime).getTime();
            return b1-a1;
          });
          // console.log(this.recent_contacts_list);
        });
      },
      send_message() {
        // console.log("send called");
        var message = document.getElementById("message").value;
        this.$socket.emit('sendMessage', {'to': this.contact_account, 'message': message});
        this.messages.push({'from': getCookie("user_account"), 'to': this.contact_account, 'type': 0,'content': message});
        document.getElementById("message").value = "";
        // console.log(this.messages);
      },
      get_index(account){
        var i=0;
        for (;i<this.recent_contacts_list.length;i++){
          if (this.recent_contacts_list[i].contact===account){
            return i;
          }
        }
        return -1;
      },
      emoji_clicked(emoji){
        this.emoji_picker_isShow = false;
        document.getElementById("message").value += emoji;
      },
      uploadFile(e){
        this.cur_file = e.target.files[0];
        if(this.cur_file === undefined) return;
        const isLt1M = this.cur_file.size < 100 * 1024 * 1024;
        if (!isLt1M) {
          this.$message.error('上传文件大小不能超过 100MB!');
          return;
        }
        var self = this;
        let reader = new FileReader();
        console.log(this.cur_file);
        reader.onload = function(){
          var arraybuffer = this.result;
          self.$socket.emit('sendFile', {'to':self.contact_account, 'file_name':self.cur_file.name, 'lastmodfiyTimeDate':self.cur_file.lastmodfiyTimeDate, 'arraybuffer':arraybuffer});
          self.messages.push({'from': getCookie("user_account"), 'to': self.contact_account, 'type': 1, 'content': self.cur_file.name});
        };
        reader.readAsArrayBuffer(this.cur_file);
      },
      download(message){
        console.log("download request called");
        this.$socket.emit('getFile',{'from':message.from, 'to':message.to, 'file_name': message.content});
      }
    },
    computed: {
      filter_recent_contacts: function () {
        var _this=this;
        var new_items=[];
        this.recent_contacts_list.map(function (item) {
          if (_this.search_name===''  || item.name.search(_this.search_name)!==-1)
            new_items.push(item);
        });
        return new_items;
      }
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
  .el_dark{
    background-color: rgb(0, 0, 0);
  }
  .MiddleAside {
    background-color: rgb(247, 247, 247);
    text-align: center;
  }

  .MiddleAsideDark {
    background-color: rgb(0, 0, 0);
  }

  .search_area{
    text-align: center;
    width: 100%;
    height: 15%;
    line-height: 6;
  }
  .recent_contacts{
    width: 100%;
    height: 83%;
    overflow: auto;
    overflow-x: hidden;
  }
  /*.recent_contacts_dark{*/

  /*}*/
  .chat_area{
    width: 75%;
    height: 100%;
    float: left;
  }
  .char_area_dark{
    background-color: rgb(0, 0, 0);
  }

  .friend_name{
    text-align: center;
    width: 100%;
    height: 6%;
    box-shadow: 0px 2px 0px 0px #F2F2F2;
  }
  .friend_name_dark{
    color: rgb(240, 240, 240);
  }
  .message_show{
    width: 100%;
    height: 67%;
    overflow: auto;
    overflow-x: hidden;
  }
  .input_message{
    width: 100%;
    height: 27%;
    box-shadow: 0px -2px 0px 0px #F2F2F2;
  }
  .function_area{
    width: 100%;
    height: 15%;
  }
  .input_area{
    margin-top: 2px;
    margin-bottom: 2px;
    width: 100%;
    height: 50%;
  }
  .content{
    border: none;
    resize:none;
    cursor: pointer;
    padding-top: 5px;
    font-family:"SimSun","Times New Roman",Georgia,Serif,serif;
    width: 100%;
    height: 100%;
    line-height:10px;
    font-size: 20px;
  }
  .content_dark{
    background-color: rgb(0, 0, 0);
    color: rgb(240, 240, 240);
  }
  .content:focus{
    outline: none;
  }
  .send_area{
    margin-top: 8px;
    text-align: right;
    float: right;
    width: 100%;
    height: 23%;
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
  .notice{
    float: left;
    margin-top: 18px;
    width: 10px;
    height: 10px;
  }

  .contact{
    width: 100%;
    height: 60px;
  }

  .contact_dark{
    color: rgb(240, 240, 240);
  }

  .icon{
    margin-left: 5px;
    width: 25px;
    height: 25px
  }
  .inline-block {
    display: inline-block;
  }
  .upload{
    opacity: 0;
  }
  p{
    margin-top: -8px;
    margin-left: 30px;
  }
  .addclass{
    background-color: #1A1A1A;
    color: rgb(250, 250, 250);
  }
  .message_box{
    /*width: 50%;*/
  }

  .atalk{
    overflow: hidden;
    float: none;
    margin-right: 50%;
    width: 50%;
    text-align:left;
  }
  .atalk .message{
    float: left;
    padding:5px 0px 5px 10px;
    margin-left: 5%;
    width: 50%;
    display:inline-block;
    *display:inline;
    *zoom:1;
    text-align: justify;
    text-justify: newspaper;
    word-break: break-all;
    background:#F8F6F8;
    color: #000000;
    border-radius:10px;
  }
  .atalk .file{
    float: left;
    padding:5px 10px 5px 0px;
    margin-right: 5%;
    width: 50%;
    display:inline-block;
    *display:inline;
    *zoom:1;
    text-align: right;
    text-justify: newspaper;
    word-break: break-all;
    background:#50519F;
    color: #FFFFFF;
    border-radius:10px;
  }
  .atalk .file_icon{
    float: left;
    margin-right: 10px;
    width: 50px;
    height: 50px;
  }
  .atalk .avatar_box{
    float: left;
    margin-left: 5%;
    width: 40px;
    height: 40px;
  }
  .atalk .contactor_avatar{
    float: left;
    width: 40px;
    height: 40px;
  }
  .atalk .file_name{
    position: relative;
    float: left;
    top: 10px;
  }
  .btalk{
    overflow: hidden;
    float: none;
    margin-left: 50%;
    width: 50%;
    text-align:right;
  }
  .btalk .message{
    float: right;
    padding:5px 10px 5px 0px;
    margin-right: 5%;
    width: 50%;
    display:inline-block;
    *display:inline;
    *zoom:1;
    text-align: right;
    text-justify: newspaper;
    word-break: break-all;
    background:#50519F;
    color: #FFFFFF;
    border-radius:10px;
  }

  .btalk .file_icon{
    float: right;
    margin-right: 10px;
    width: 40px;
    height: 40px;
  }
  .btalk .file_name{
    position: relative;
    float: right;
    top: 10px;
  }
  .btalk .avatar_box{
    float: right;
    margin-right: 5%;
    width: 40px;
    height: 40px;
  }
  .btalk .contactor_avatar{
    float: right;
    width: 40px;
    height: 40px;
  }

</style>
