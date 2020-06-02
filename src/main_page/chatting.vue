<template>
  <el-container class="container" :class="{'container-dark': IsDarkMode}">
    <el-aside class="MiddleAside" :class="{MiddleAsideDark: IsDarkMode}" width="280px">
      <!--Search area  -->
      <div class="search_area">
        <input
          class="search_key"
          :class="{dark_search: IsDarkMode}"
          placeholder="搜索最近联系人"
          v-model="search_name"
        />
      </div>

      <!-- Chatting list area -->
      <div class="recent_contacts">
        <ul
          v-for="(people,index) in filter_recent_contacts"
          v-bind:key="index"
          :class="{contact_dark: IsDarkMode, addclassdark: contact_account === people.contact&&IsDarkMode,addclass: contact_account === people.contact}"
          v-on:click="select_contact(people.name,people.contact,people.img_path)"
        >
          <!-- Avatar and nickname -->
          <div class="main_info">
            <img :src="people.img_path" class="contact_avatar" />
            <span class="contact_name">{{people.name}}</span>
          </div>

          <!-- Hints of user online/offline and message read/unread -->
          <div class="additions">
            <img
              src="images/point.png"
              class="msg_unread_notice"
              v-if="unread_contacts.indexOf(people.contact) !== -1 && contact_account !== people.contact"
            />
            <i v-if="people.online_status === 0" class="online_or_not el-icon-circle-close"></i>
            <i v-if="people.online_status === 1" class="online_or_not el-icon-circle-check"></i>
          </div>
        </ul>
      </div>
    </el-aside>

    <!-- Right part -->
    <div class="chat_area" v-if="isShow" :class="{chat_area_dark: IsDarkMode}">
      <div class="friend_name" :class="{friend_name_dark: IsDarkMode}">{{contacts}}</div>
      <!--eslint-disable-next-line-->
      <div class="message_show" v-if="!history_show">
        <div class="message_box" v-for="(message, index) in messages" :key="index">
          <div v-if="message.to === contact_account && message.from === account">
            <div class="btalk">
              <div class="avatar_box">
                <img :src="img_path" class="contactor_avatar" />
              </div>
              <span class="message" v-if="message.type === 0">{{message.content}}</span>
              <span class="message" v-if="message.type === 1">
                <a class="file_name">{{message.content}}</a>
                <img class="file_icon" src="icons/download.svg" v-on:click="download(message)" />
              </span>
              <br />
              <br />
              <br />
              <br />
            </div>
          </div>
          <div v-if="message.from === contact_account && message.to === account">
            <div class="atalk">
              <div class="avatar_box">
                <img :src="contact_img" class="contactor_avatar" />
              </div>
              <span class="message" v-if="message.type === 0">{{message.content}}</span>
              <span class="message" v-if="message.type === 1">
                <img class="file_icon" src="icons/download.svg" v-on:click="download(message)" />
                <a class="file_name">{{message.content}}</a>
              </span>
              <br />
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
      <component
        :is="chat_history_show"
        :IsDarkMode="IsDarkMode"
        :contact="contact_account"
        :img_path="contact_img"
        :account="account"
        @UpdateFlag="UpdateFlag"
      ></component>
      <div class="input_message">
        <div class="function_area" style>
          <img
            class="icon"
            src="icons/emoji.svg"
            v-on:click="emoji_picker_isShow = !emoji_picker_isShow"
          />
          <img
            class="icon"
            src="icons/upload.svg"
            onclick="document.getElementById('upload_clicked').click();"
          />
          <img class="icon" src="icons/history.svg" v-on:click="show_history()" />
          <img class="icon word_cloud" src="icons/cloud.svg" v-on:click="show_word_cloud()" />
          <input type="file" class="upload" id="upload_clicked" v-show="false" @change="uploadFile" />
          <emoji_picker @emoji_clicked="emoji_clicked" :inputData="emoji_picker_isShow"></emoji_picker>
        </div>
        <div class="input_area">
          <textarea class="content" :class="{content_dark: IsDarkMode}" id="message" type="text" />
        </div>
        <div class="send_area">
          <el-button
            type="primary"
            v-on:click="send_message()"
            style="background: rgb(80,80,160);border:rgb(80,80,160)"
          >
            发送
            <i class="el-icon-s-promotion el-icon--right"></i>
          </el-button>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import { getCookie } from "../components/cookieUtil";
import emoji_picker from "../components/EmojiPicker";
import word_cloud from "./WordCloud";
import FileSaver from "file-saver";
import chat_history from "./chat_history.vue";

export default {
  components: {
    word_cloud,
    emoji_picker,
    chat_history
  },
  data() {
    return {
      account: "",
      img_path: "",
      contacts: "",
      contact_account: "",
      isShow: false,
      contact_img: "",
      emoji_picker_isShow: false,
      file_selector_isShow: false,
      cur_file: "",
      fileData: "",
      search_name: "",
      history_show: false,
      chat_history_show: ""
    };
  },
  props: {
    IsDarkMode: {
      type: Boolean
    },
    selected_contact: {
      type: String
    },
    messages: {
      type: Array
    },
    unread_contacts: {
      type: Array
    },
    recent_contacts_list: {
      type: Array
    },
    forbidden_word: {
      type: Array
    }
  },
  created() {
    this.account = getCookie("user_account");
    if (this.selected_contact) this.Select_contact();
  },
  mounted() {
    this.sockets.subscribe("getFile", data => {
      var blob = new Blob([data.arraybuffer], {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(blob, data.file_name);
      // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
      // FileSaver.saveAs(blob, "hello world.txt");
    });
    this.sockets.subscribe("FileExpired", data => {
      this.$message({
        showClose: true,
        message: data.file_name + "已失效",
        type: "error"
      });
    });
    this.sockets.subscribe("login", data => {
      console.log(data);
    });
  },
  methods: {
    select_contact(name, account, img_path) {
      this.chat_history_show = "";
      this.history_show = false;
      this.img_path = getCookie("UserLogoPath");
      this.contacts = name;
      this.contact_account = account;
      this.isShow = true;
      this.contact_img = img_path;
      this.unread_contacts.splice(this.unread_contacts.indexOf(account), 1);
      this.$emit("UpdateUnread", { contact: this.contact_account });
    },
    send_message() {
      var message = document.getElementById("message").value;
      for (let i in this.forbidden_word) {
        let reg = new RegExp(this.forbidden_word[i], "g");
        //判断内容中是否包括敏感词
        if (message.indexOf(this.forbidden_word[i]) != -1) {
          let result = message.replace(reg, "**");
          message = result;
          this.$notify({
            title: "警告",
            message: "包含敏感词汇,已被替换,请注意!",
            type: "warning"
          });
        }
      }
      this.$socket.emit("sendMessage", {
        to: this.contact_account,
        message: message
      });
      this.messages.push({
        from: getCookie("user_account"),
        to: this.contact_account,
        type: 0,
        content: message
      });
      this.$emit("UpdateMessage", { messages: this.messages });
      document.getElementById("message").value = "";
    },
    emoji_clicked(emoji) {
      this.emoji_picker_isShow = false;
      document.getElementById("message").value += emoji;
    },
    uploadFile(e) {
      this.cur_file = e.target.files[0];
      if (this.cur_file === undefined) return;
      const isLt1M = this.cur_file.size < 100 * 1024 * 1024;
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 100MB!");
        return;
      }
      var self = this;
      let reader = new FileReader();
      reader.onload = function() {
        var arraybuffer = this.result;
        self.$socket.emit("sendFile", {
          to: self.contact_account,
          file_name: self.cur_file.name,
          lastmodfiyTimeDate: self.cur_file.lastmodfiyTimeDate,
          arraybuffer: arraybuffer
        });
        self.messages.push({
          from: getCookie("user_account"),
          to: self.contact_account,
          type: 1,
          content: self.cur_file.name
        });
      };
      reader.readAsArrayBuffer(this.cur_file);
    },
    download(message) {
      this.$socket.emit("getFile", {
        from: message.from,
        to: message.to,
        file_name: message.content
      });
    },
    show_history() {
      if (this.history_show) {
        this.chat_history_show = "";
        this.chat_history_show = "chat_history";
      } else {
        this.chat_history_show = "chat_history";
      }
      this.history_show = true;
    },
    show_word_cloud() {
      if (this.history_show) {
        this.chat_history_show = "";
        this.chat_history_show = "word_cloud";
      } else {
        this.chat_history_show = "word_cloud";
      }
      this.history_show = true;
    },
    UpdateFlag(val) {
      this.chat_history_show = "";
      this.history_show = val.Flag;
    },
    Select_contact() {
      if (this.selected_contact) {
        let t;
        for (t in this.recent_contacts_list) {
          if (this.selected_contact === this.recent_contacts_list[t].contact) {
            this.img_path = getCookie("UserLogoPath");
            this.contacts = this.recent_contacts_list[t].name;
            this.contact_account = this.selected_contact;
            this.isShow = true;
            this.contact_img = this.recent_contacts_list[t].img_path;
            this.unread_contacts.splice(
              this.unread_contacts.indexOf(this.selected_contact),
              1
            );
            break;
          }
        }
      }
    }
  },
  computed: {
    filter_recent_contacts: function() {
      var _this = this;
      var new_items = [];
      this.recent_contacts_list.map(function(item) {
        if (
          _this.search_name === "" ||
          item.name.search(_this.search_name) !== -1
        )
          new_items.push(item);
      });
      return new_items;
    }
  }
};
</script>

<style  lang="less" scoped>
// prevent default style of ul, which appears at contact list and apply list
ul {
  padding: 0;
  margin: 0;
}

// Middle part of layout
.MiddleAside {
  background-color: var(--mid-bg-color);

  .search_area {
    height: 134px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    .search_key {
      width: 220px;
      height: 34px;
      border: none;
      padding-left: 10px;
      border-radius: 5px;
    }

    .search_key:focus {
      outline: none;
    }

    .search_key::placeholder {
      color: var(--placeholder-color);
    }
  }

  .recent_contacts {
    overflow: auto;
    overflow-x: hidden;

    ul {
      height: 75px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 25px;
      padding-right: 25px;
      color: var(--menu-font-color);
      cursor: pointer;

      .main_info {
        display: flex;
        align-items: center;

        .contact_avatar {
          width: 55px;
          height: 55px;
          border-radius: 50%;
        }

        .contact_name {
          margin-left: 15px;
        }
      }

      .additions {
        display: flex;
        align-items: center;

        .msg_unread_notice {
          width: 10px;
          height: 10px;
          margin-right: 10px;
        }
      }
    }
  }
}

.MiddleAsideDark {
  background-color: var(--mid-bg-color-dark);
}

// Right part of layout
.chat_area {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 50px auto 220px;
  grid-template-columns: auto;
  grid-template-areas:
    "top"
    "middle"
    "bottom";
}

// Top part of chat area
.friend_name {
  grid-area: top;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: var(--splitter-color) 1px solid;
}

// Middle part of chat area
.message_show {
  grid-area: middle;
}

// Bottom part of chat area
.input_message {
  grid-area: bottom;

  .function_area {
    height: 35px;
    padding-left: 10px;
    padding-top: 5px;
    border-top: var(--splitter-color) 1px solid;

    .icon {
      height: 25px;
      margin: 5px;
      cursor: pointer;
    }

    .word_cloud {
      height: 30px;
      margin: 2.5px 5px;
    }
  }

  .input_area {
    margin-top: 2px;
    margin-bottom: 2px;
    width: 100%;
    height: 120px;

    .content {
      width: 100%;
      height: 100%;
      padding: 5px;
      padding-left: 15px;
      box-sizing: border-box;
      line-height: 20px;
      font-size: 16px;
      border: none;
      resize: none;
      cursor: text;
      color: var(--info-font-color);
    }

    .content:focus {
      outline: none;
    }
  }

  .send_area {
    position: relative;

    button {
      position: absolute;
      right: 20px;
    }
  }
}

.container-dark {
  background-color: var(--mid-bg-color-dark);
}

.chat_area_dark {
  background-color: var(--right-bg-color-dark);
}

.friend_name_dark {
  color: var(--info-font-color-dark);
}

.content_dark {
  background-color: #1a1a1a;
  color: rgb(240, 240, 240);
}

.contact_dark {
  background-color: rgb(24, 24, 24);
  color: rgb(220, 220, 220);
}

.upload {
  opacity: 0;
}
p {
  margin-top: -8px;
  margin-left: 30px;
}
.addclass {
  background-color: white;
}
.addclassdark {
  background-color: #1a1a1a;
  color: rgb(240, 240, 240);
}
.message_box {
  margin-top: 2px;
}

.atalk {
  overflow: hidden;
  float: none;
  margin-right: 50%;
  width: 50%;
  text-align: left;
}
.atalk .message {
  float: left;
  padding: 5px 0px 5px 10px;
  margin-left: 5%;
  width: 50%;
  display: inline-block;
  *display: inline;
  *zoom: 1;
  text-align: justify;
  text-justify: newspaper;
  word-break: break-all;
  background: #f8f6f8;
  color: #000000;
  border-radius: 10px;
}
.atalk .file {
  float: left;
  padding: 5px 10px 5px 0px;
  margin-right: 5%;
  width: 50%;
  display: inline-block;
  *display: inline;
  *zoom: 1;
  text-align: right;
  text-justify: newspaper;
  word-break: break-all;
  background: #50519f;
  color: #ffffff;
  border-radius: 10px;
}
.atalk .file_icon {
  float: left;
  margin-right: 10px;
  width: 50px;
  height: 50px;
}
.atalk .avatar_box {
  float: left;
  margin-left: 5%;
  width: 40px;
  height: 40px;
}
.atalk .contactor_avatar {
  float: left;
  width: 40px;
  height: 40px;
}
.atalk .file_name {
  position: relative;
  float: left;
  top: 10px;
}
.btalk {
  overflow: hidden;
  float: none;
  margin-left: 50%;
  width: 50%;
  text-align: right;
}
.btalk .message {
  float: right;
  padding: 5px 10px 5px 0px;
  margin-right: 5%;
  width: 50%;
  display: inline-block;
  *display: inline;
  *zoom: 1;
  text-align: right;
  text-justify: newspaper;
  word-break: break-all;
  background: #50519f;
  color: #ffffff;
  border-radius: 10px;
}

.btalk .file_icon {
  float: right;
  margin-right: 10px;
  width: 40px;
  height: 40px;
}
.btalk .file_name {
  position: relative;
  float: right;
  top: 10px;
}
.btalk .avatar_box {
  float: right;
  margin-right: 5%;
  width: 40px;
  height: 40px;
}
.btalk .contactor_avatar {
  float: right;
  width: 40px;
  height: 40px;
}
</style>
