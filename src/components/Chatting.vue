<template>
  <el-container class="container" :class="{container_dark: IsDarkMode}">
    <el-aside class="MiddleAside" :class="{MiddleAsideDark: IsDarkMode}" width="280px">
      <!--Search area  -->
      <div class="search_area">
        <input
          class="search_key"
          :class="{search_key_dark: IsDarkMode}"
          placeholder="搜索最近联系人"
          v-model="search_name"
        />
      </div>

      <!-- Chatting list area -->
      <div class="recent_contacts" :class="{recent_contacts_dark: IsDarkMode}">
        <ul
          v-for="(people,index) in filter_recent_contacts"
          v-bind:key="index"
          :class="{addclass: contact_account === people.contact, addclassdark: contact_account === people.contact&&IsDarkMode}"
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
      <div class="friend_name">{{contacts}}</div>
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
                <div class="file_msg_div">
                  <a class="file_name">{{message.content}}</a>
                  <img class="file_icon" src="icons/download.svg" v-on:click="download(message)" />
                </div>
              </span>
            </div>
          </div>
          <div v-if="message.from === contact_account && message.to === account">
            <div class="atalk">
              <div class="avatar_box">
                <img :src="contact_img" class="contactor_avatar" />
              </div>
              <span class="message" v-if="message.type === 0">{{message.content}}</span>
              <span class="message" v-if="message.type === 1">
                <div class="file_msg_div">
                  <img class="file_icon" src="icons/download.svg" v-on:click="download(message)" />
                  <a class="file_name">{{message.content}}</a>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <component
        :is="right_mid_display_mark"
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
          <emoji_picker
            @emoji_clicked="emoji_clicked"
            :inputData="emoji_picker_isShow"
            :isDarkMode="emoji_picker_isDark"
          ></emoji_picker>
        </div>
        <div class="input_area">
          <textarea class="content" :class="{content_dark: IsDarkMode}" id="message" type="text" />
        </div>
        <div class="send_area">
          <el-button type="primary" v-on:click="send_message()">
            发送
            <i class="el-icon-s-promotion el-icon--right"></i>
          </el-button>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import { getCookie } from "./cookieUtil";
import emoji_picker from "./chatting/EmojiPicker";
import word_cloud from "./chatting/WordCloud";
import chat_history from "./chatting/ChatHistory";
import FileSaver from "file-saver";

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
      right_mid_display_mark: ""
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
      this.right_mid_display_mark = "";
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
        this.right_mid_display_mark = "";
        this.right_mid_display_mark = "chat_history";
      } else {
        this.right_mid_display_mark = "chat_history";
      }
      this.history_show = true;
    },
    show_word_cloud() {
      if (this.history_show) {
        this.right_mid_display_mark = "";
        this.right_mid_display_mark = "word_cloud";
      } else {
        this.right_mid_display_mark = "word_cloud";
      }
      this.history_show = true;
    },
    UpdateFlag(val) {
      this.right_mid_display_mark = "";
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
    emoji_picker_isDark: function() {
      return this.IsDarkMode;
    },

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

.container {
  background-color: var(--right-bg-color);

  // Scroll bar style
  /* width */
  ::-webkit-scrollbar {
    width: 12px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: rgb(233, 233, 233);
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgb(201, 201, 201);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(180, 180, 180);
  }
}

.container_dark {
  background-color: var(--right-bg-color-dark);

  // Scroll bar style
  /* Track */
  ::-webkit-scrollbar-track {
    background: rgb(14, 14, 14);
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(43, 43, 43);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(53, 53, 53);
  }
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
    overflow-y: auto;

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

    .addclass {
      background-color: var(--mid-clicked-color);
    }
  }
}

.MiddleAsideDark {
  background-color: var(--mid-bg-color-dark);

  .search_area {
    .search_key_dark {
      color: var(--menu-font-color-dark);
      background-color: var(--mid-clicked-color-dark);
    }

    .search_key_dark::placeholder {
      color: var(--placeholder-color-dark);
    }
  }

  .recent_contacts_dark {
    ul {
      color: var(--menu-font-color-dark);
    }

    .addclass {
      background-color: var(--mid-clicked-color-dark);
    }
  }
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
  background-color: var(--right-bg-color);

  // Top part of chat area
  .friend_name {
    grid-area: top;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--info-font-color);
    border-bottom: var(--splitter-color) 1px solid;
  }

  // Middle part of chat area
  .message_show {
    grid-area: middle;
    overflow-y: auto;

    .message_box {
      padding-top: 10px;
      padding-bottom: 10px;

      .atalk {
        overflow: hidden;
        margin-right: 50%;
        width: 50%;
        text-align: left;

        .avatar_box {
          float: left;
          margin-left: 5%;
          width: 40px;
          height: 40px;

          .contactor_avatar {
            width: 40px;
            height: 40px;
          }
        }

        .message {
          padding: 10px;
          margin-left: 5%;
          max-width: 50%;
          display: inline-block;
          text-align: justify;
          text-justify: inter-word;
          background: var(--mid-bg-color);
          color: var(--info-font-color);
          border-radius: 5px;

          .file_msg_div {
            display: flex;
            align-items: center;

            .file_icon {
              width: 25px;
              height: 25px;
              margin-right: 10px;
              cursor: pointer;
            }
          }
        }
      }

      .btalk {
        overflow: hidden;
        margin-left: 50%;
        width: 50%;
        text-align: right;

        .avatar_box {
          float: right;
          margin-right: 5%;
          width: 40px;
          height: 40px;

          .contactor_avatar {
            width: 40px;
            height: 40px;
          }
        }

        .message {
          padding: 10px;
          margin-right: 5%;
          max-width: 50%;
          display: inline-block;
          text-align: justify;
          text-justify: inter-word;
          background: var(--special-color);
          color: white;
          border-radius: 5px;

          .file_msg_div {
            display: flex;
            align-items: center;

            .file_icon {
              width: 25px;
              height: 25px;
              margin-left: 10px;
              cursor: pointer;
            }
          }
        }
      }
    }
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
        line-height: 25px;
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
        color: white;
        background-color: var(--special-color);
        border: none;
        position: absolute;
        right: 20px;
      }
    }
  }
}

.chat_area_dark {
  background-color: var(--right-bg-color-dark);

  // Top part of chat area
  .friend_name {
    color: var(--info-font-color-dark);
    border-bottom: var(--splitter-color-dark) 1px solid;
  }

  // Middle part of chat area
  .message_show {
    .message_box {
      .atalk {
        .message {
          background: var(--mid-bg-color-dark);
          color: var(--info-font-color-dark);
        }
      }

      .btalk {
        .message {
          color: rgb(231, 231, 231);
        }
      }
    }
  }

  // Bottom part of chat area
  .input_message {
    .function_area {
      border-top: var(--splitter-color-dark) 1px solid;
    }

    .input_area {
      .content {
        color: var(--info-font-color-dark);
        background-color: var(--right-bg-color-dark);
      }
    }
  }
}
</style>
