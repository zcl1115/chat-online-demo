<template>
  <div class="Body">
    <el-container>
      <el-aside class="LeftAside" :class="{LeftAsideDark: IsDarkMode}" width="90px">
        <el-menu class="LeftAsideMenu" :class="{LeftAsideMenuDark: IsDarkMode}" active-text-color="#4e519e">
          <div class="UserLogoDiv" :class="{UserLogoDivDark: IsDarkMode}">
            <img :src="UserLogoPath" />
          </div>
          <el-menu-item
            id="chat"
            index="1-1"
            @click="showpage('chatting')"
            :class="{MenuItemDark: IsDarkMode}"
          >
            <i v-if="unread===0" class="el-icon-chat-round"></i>
            <el-badge v-if="unread!==0" :value="unread" :max="99" class="item">
              <i class="el-icon-chat-round"></i>
            </el-badge>
          </el-menu-item>
          <el-menu-item
            index="1-2"
            @click="show_page = 'contacts'"
            :class="{MenuItemDark: IsDarkMode}"
          >
            <i class="el-icon-user"></i>
          </el-menu-item>
          <el-menu-item
            index="1-3"
            @click="show_page = 'setting'"
            :class="{MenuItemDark: IsDarkMode}"
          >
            <i class="el-icon-setting"></i>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <component
        :is="show_page"
        :IsDarkMode="IsDarkMode"
        :selected_contact="selected_contact"
        :messages = "messages"
        :unread_contacts = "unread_contacts"
        :recent_contacts_list = "recent_contacts_list"
        :forbidden_word = "forbidden_word"
        @UpdateModle="UpdateModle"
        @SetDisplayPage="SetDisplayPage"
        @UpdateDataInVue="UpdateDataInVue"
        @skip_chatting="skip_chatting"
        @UpdateMessage="UpdateMessage"
        @UpdateUnread="UpdateUnread"
      ></component>
    </el-container>
  </div>
</template>

<script>
import chatting from "./chatting.vue";
import setting from "./setting.vue";
import contacts from "./contacts.vue";
import { getCookie, setCookie } from "../components/cookieUtil";

const UserDefaultLogoPath = "images/blank.png";
const GetPersonalInfoURL = "api/setting/GetPersonalInfo";
const GetPersonalLogoURL = "api/setting/GetPersonalLogo";
const UserIDCookieKey = "user_account";
const UserLogoPathCookieKey = "UserLogoPath";
const UserNameCookieKey = "UserName";
const UserIntroductionCookieKey = "UserIntroduction";

export default {
  data() {
    return {
      UserID: "",
      UserLogoPath: UserDefaultLogoPath,
      IsDarkMode: false,
      selected_contact: "",
      show_page: "chatting",
      unread: 0,
      messages: [],
      unread_contacts: [],
      recent_contacts_list: [],
      unread_message: [],
      forbidden_word: [],
      now_contact: ""
    };
  },
  mounted() {
    this.sockets.subscribe("message", data => {
      this.messages.push(data);
      if (this.now_contact !== data.from){
        if (this.unread_contacts.indexOf(data.from) !== -1){
          var j = 0;
          for (; j < this.unread_message.length; j++) {
            if (this.unread_message[j].contact === data.from) {
              this.unread_message[j].nums +=1;
              break;
            }
          }
        }else{
          let obj= {
            contact: data.from,
            nums: 1,
          };
          this.unread_message.push(obj);
        }
        this.unread += 1;
      }
      this.unread_contacts.push(data.from);
      var i = this.get_index(data.from);
      let temp = this.recent_contacts_list[i];
      temp.chat_time = data.time;
      this.$set(this.recent_contacts_list, i, temp);
      this.recent_contacts_list.sort((a, b) => {
        let atime = a.chat_time;
        let btime = b.chat_time;
        atime = atime.replace(/-/g, "/");
        btime = btime.replace(/-/g, "/");
        let a1 = new Date(atime).getTime();
        let b1 = new Date(btime).getTime();
        return b1 - a1;
      });
    });

  },
  methods: {
    SetDisplayPage(val) {
      this.show_page = val;
    },
    UpdateModle(val) {
      this.IsDarkMode = val.mode;
    },
    get_index(account) {
      var i = 0;
      for (; i < this.recent_contacts_list.length; i++) {
        if (this.recent_contacts_list[i].contact === account) {
          return i;
        }
      }
      return -1;
    },
    GetPersonalLogo() {
      var SendObj = this.qs.stringify({
        UserID: this.UserID
      });

      this.axios.post(GetPersonalLogoURL, SendObj).then(response => {
        if (!response.data.Status) {
          this.$message({
            showClose: true,
            message: "没有头像！",
            type: "error"
          });
          return;
        }

        var FileLength = response.data.UserLogoFile.data.length;
        var Array1 = new ArrayBuffer(FileLength);
        var Array2 = new Uint8Array(Array1);

        for (var i = 0; i < FileLength; i++) {
          Array2[i] = response.data.UserLogoFile.data[i];
        }

        var FileBlob = new Blob([Array2], { type: "" });
        var UserLogoURL = URL.createObjectURL(FileBlob);
        this.UserLogoPath = UserLogoURL;

        setCookie(UserLogoPathCookieKey, UserLogoURL);
      });
    },
    GetPersonalInfo() {
      var SendObj = this.qs.stringify({
        UserID: this.UserID
      });

      this.axios.post(GetPersonalInfoURL, SendObj).then(response => {
        if (!response.data.Status) {
          this.$message({
            showClose: true,
            message: "errer GetPersonalInfo()",
            type: "error"
          });

          return;
        }

        setCookie(UserNameCookieKey, response.data.UserName);
        setCookie(UserIntroductionCookieKey, response.data.UserIntroduction);
      });
    },
    GetForbiddenWord(){
      this.axios
              .post(
                      "api/chat/get_forbidden_word",
              )
              .then(response => {
                this.forbidden_word = response.data.forbidden_words;
                console.log(this.forbidden_word);
              });
    },
    UpdateDataInVue(val) {
      if (val.NewUserLogoPath != undefined) {
        this.UserLogoPath = val.NewUserLogoPath;
      }
      if (val.IsDarkMode != undefined) {
        this.IsDarkMode = val.IsDarkMode;
      }
    },
    skip_chatting(val){
      this.selected_contact=val.contact;
      this.init_recent_contacts();
      document.getElementById("chat").click();
    },
    UpdateMessage(data){
      this.messages = data.messages;
    },
    UpdateUnread(data){
      this.now_contact = data.contact;
      var j = 0;
      var i = 0;
      for (; j < this.unread_message.length; j++) {
        if (this.unread_message[j].contact === data.contact) {
          this.unread -= this.unread_message[j].nums;
          i=j;
          break;
        }
      }
      this.unread_message.splice(i, 1);
      this.unread_contacts.splice(this.unread_contacts.indexOf(data.contact),1);
    },
    init_recent_contacts() {
      var temp = getCookie("user_account");
      this.axios
              .post(
                      "api/chat/get_recent_list",
                      this.qs.stringify({
                        account: temp
                      })
              )
              .then(response => {
                this.recent_contacts_list = response.data;
                let i;
                for (i in this.recent_contacts_list) {
                  var FileLength = this.recent_contacts_list[i].img_path.data.length;
                  var Array1 = new ArrayBuffer(FileLength);
                  var Array2 = new Uint8Array(Array1);

                  for (var j = 0; j < FileLength; j++) {
                    Array2[j] = this.recent_contacts_list[i].img_path.data[j];
                  }

                  var FileBlob = new Blob([Array2], { type: "" });
                  var UserLogoURL = URL.createObjectURL(FileBlob);
                  this.recent_contacts_list[i].img_path = UserLogoURL;
                }

                this.recent_contacts_list.sort((a, b) => {
                  let atime = a.chat_time;
                  let btime = b.chat_time;
                  atime = atime.replace(/-/g, "/");
                  btime = btime.replace(/-/g, "/");
                  let a1 = new Date(atime).getTime();
                  let b1 = new Date(btime).getTime();
                  return b1 - a1;
                });
              });
    },

    showpage(str){
        this.init_recent_contacts();
        this.show_page = str;
    },
  },
  sockets: {
    //不能改,建立连接自动调用connect
    connect: function() {
      //与socket.io连接后回调
      console.log("socket connected");
      this.$socket.emit("register", { account: getCookie("user_account") });
    },
    //服务端向客户端发送login事件
    login: function(value) {
      //监听login(后端向前端emit  login的回调)
      console.log(value);
    }
  },
  components: {
    chatting,
    setting,
    contacts
  },

  created() {
    this.UserID = getCookie(UserIDCookieKey);
    setCookie(UserLogoPathCookieKey, UserDefaultLogoPath);
    this.init_recent_contacts();
    this.GetPersonalLogo();
    this.GetPersonalInfo();
    this.GetForbiddenWord();
  }
};
</script>

<style lang="less" scoped>
.Body {
  height: 100%;
  margin: 0;
  padding: 0;
}

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

  .el-menu-item:hover {
    background-color: rgb(250, 250, 250);
  }
}

.LeftAside {
  background-color: rgb(242, 242, 242);
  text-align: center;

  .LeftAsideMenu {
    background-color: rgb(242, 242, 242);
    border: none;
  }

  .LeftAsideMenuDark {
    background-color: #0B0B0B;
  }

  .MenuItemDark:hover {
    background-color: rgb(24, 24, 24);
    color: rgb(220, 220, 220);
  }

  .MenuItemDark.is-active {
    background-color: #1A1A1A;
    color: rgb(240, 240, 240);
  }
}

.LeftAsideDark {
  background-color: #0B0B0B;
}

.UserLogoDiv {
  height: 134px;
  background-color: rgb(242, 242, 242);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
  }
}

.UserLogoDivDark {
  background-color: #0B0B0B;
}
</style>
