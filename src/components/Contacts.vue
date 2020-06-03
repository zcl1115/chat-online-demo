<template>
  <el-container :IsDarkMode="IsDarkMode">
    <el-aside class="middle-part" :class="{'middle-part-dark': IsDarkMode}" width="280px">
      <!--Search area  -->
      <div class="search-area">
        <input
          class="search-key"
          :class="{'search-key-dark': IsDarkMode}"
          placeholder="搜索联系人"
          v-model="search_str"
          @keyup.enter="Search_contact()"
        />
        <input
          class="search-key"
          :class="{'search-key-dark': IsDarkMode}"
          placeholder="添加好友"
          v-model="add_str"
          @keyup.enter="Search_user()"
        />
      </div>

      <!-- New friend notification area -->
      <div
        v-on:click="Show_new_friend()"
        class="new-friend"
        :class="{'new-friend-dark': IsDarkMode}"
      >好友申请 ></div>

      <!-- Contact list area -->
      <div class="contact-list" :class="{'contact-list-dark': IsDarkMode}">
        <ul
          v-for="item in get_contacts"
          v-bind:key="item.account"
          v-on:click="Select_friend(item.f_name,item.u_name,item.account,item.img_path,item.personal_profile)"
          :class="{'current-clicked': item.account === search_account && !IsDarkMode, 
                   'current-clicked-dark': item.account === search_account && IsDarkMode}"
        >
          <img :src="item.img_path" class="contact-avatar" />
          <span class="contact-name">{{item.f_name}}</span>
        </ul>
      </div>
    </el-aside>

    <div class="right-part" :class="{'right-part-dark': IsDarkMode}">
      <!-- When right part is to show user info -->
      <div
        class="view-user-info"
        :class="{'view-user-info-dark': IsDarkMode}"
        v-if="isShow_personal"
      >
        <div class="info-div">
          <div class="info-avatar">
            <img :src="search_img_path" />
          </div>
          <div class="info-account">帐号：{{search_account}}</div>
          <div class="info-nickname">昵称：{{search_name}}</div>
          <div class="info-remarkname" v-if="!change_remark&&!isShow_add_user&&isShow_personal">
            备注：{{search_f_name}}
            <img
              class="edit-icon"
              src="icons/edit.svg"
              @click="Change_remark_status()"
            />
          </div>
          <div class="info-remarkname" v-if="change_remark&&!isShow_add_user&&isShow_personal">
            <input
              type="text"
              class="line-input"
              v-model="search_f_name"
              @keyup.enter="Change_remark()"
            />
            <img class="enter-icon" src="icons/enter.svg" @click="Change_remark()" />
          </div>
          <div class="info-introduction">简介：{{ search_personal_profile }}</div>
        </div>
        <div class="button-div">
          <el-button @click="Show_send_message()" v-if="!isShow_add_user&&isShow_personal">发送信息</el-button>
          <el-button @click="Show_send_application()" v-if="isShow_add_user&&isShow_personal">添加好友</el-button>
          <el-button @click="Del_contact()" v-if="!isShow_add_user&&isShow_personal">删除好友</el-button>
        </div>
      </div>

      <!-- When right part is to send friend request -->
      <div
        class="send-application"
        :class="{'send-application-dark': IsDarkMode}"
        v-if="isShow_application && !isShow_personal"
      >
        <h2>验证信息</h2>
        <textarea id="request-message">
           Hello!
         </textarea>
        <el-button v-on:click="Send_application()" class="submit">发送申请</el-button>
      </div>
      <div v-if="isShow_ok" class="show-ok">
        <span>发送成功</span>
      </div>

      <!-- When right part is to show apply list info -->
      <div
        class="application-list"
        :class="{'application-list-dark': IsDarkMode}"
        v-if="isShow_new_friend_list"
      >
        <ul
          v-for="(item,index) in new_friend"
          v-bind:key="index"
          v-on:click="Select_new_friend(item.name,item.account,item.img_path,item.content,item.personal_profile,item.id,index)"
        >
          <img :src="item.img_path" />
          <p>
            <span class="application-name">{{item.name}}</span>
            请求添加您为好友
            <span class="application-status">{{item.status}}</span>
          </p>
        </ul>
      </div>

      <!-- When right part is to view friend request -->
      <div
        class="view-application"
        :class="{'view-application-dark': IsDarkMode}"
        v-if="isShow_new_application"
      >
        <h2>好友申请</h2>
        <div class="applicant-info">
          <img :src="search_img_path" />
          <span class="a-name">{{search_name}}</span>
        </div>
        <p class="a-msg">{{search_content}}</p>
        <div>
          <div v-if="isShow_application_button" class="operations">
            <el-button v-on:click="Add_friend()" class="agree-btn">同意</el-button>
            <el-button v-on:click="Refuse_friend()" class="refuse-btn">拒绝</el-button>
          </div>
          <p v-else class="status">{{this.request_status}}</p>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import moment from "moment";

import { getCookie } from "../components/cookieUtil";

export default {
  data() {
    return {
      search_account: "",
      search_name: "",
      search_img_path: "",
      search_personal_profile: "",
      request_id: "",
      request_status: "",
      account: "",
      name: "",
      get_contacts: [],
      isShow_personal: false,
      add_str: "",
      isShow_application: false,
      isShow_ok: false,
      isShow_add_user: false,
      isShow_new_friend_list: false,
      application_msg: [],
      new_friend: [],
      isShow_new_application: false,
      isShow_application_button: false,
      Index: 0,
      search_f_name: "",
      search_str: "",
      change_remark: false
    };
  },
  props: {
    IsDarkMode: {
      type: Boolean
    },
    selected_contact: {
      type: String
    }
  },
  created() {
    this.account = getCookie("user_account");
    this.init_contacts();
    this.init_name();
  },
  mounted() {},
  methods: {
    init_name() {
      this.axios
        .post(
          "api/friend/get_user",
          this.qs.stringify({
            account: this.account
          })
        )
        .then(response => {
          var temp = response.data;
          this.name = temp[0].u_name;
        });
    },

    init_contacts() {
      this.axios
        .post(
          "api/friend/get_contacts",
          this.qs.stringify({
            account: this.account
          })
        )
        .then(response => {
          console.log(response.data);
          this.get_contacts = response.data;
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

    Select_friend(f_name, u_name, account, img_path, personal_profile) {
      this.search_account = account;
      this.search_name = u_name;
      this.search_img_path = img_path;
      this.search_personal_profile = personal_profile;
      this.isShow_personal = true;
      this.isShow_new_application = false;
      this.isShow_ok = false;
      this.isShow_new_friend_list = false;
      this.search_f_name = f_name;
      this.change_remark = false;
    },

    Show_send_message() {
      var time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      var user_account = this.account;
      var contact_account = this.search_account;
      this.axios
        .post(
          "api/friend/update_recent_contacts",
          this.qs.stringify({
            user_account: user_account,
            time: time,
            contact_account: contact_account
          })
        )
        .then(response => {
          console.log(response);
          this.$emit("skip_chatting", { contact: this.search_account });
        });
      this.isShow_ok = false;
    },

    Search_user() {
      // this.search_account = this.add_str;
      var id = this.add_str;
      this.axios
        .post(
          "api/friend/get_user",
          this.qs.stringify({
            account: id
          })
        )
        .then(response => {
          console.log(response.data);
          this.get_contacts = response.data;
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
      this.axios
        .post(
          "api/friend/is_contact",
          this.qs.stringify({
            user_account: this.account,
            contact_account: id
          })
        )
        .then(response => {
          this.isShow_add_user = response.data.IsContact;
        });
      this.isShow_personal = false;
      this.isShow_application = false;
      this.isShow_ok = false;
      this.isShow_new_friend_list = false;
      this.isShow_new_application = false;
    },

    Show_send_application() {
      this.isShow_personal = false;
      this.isShow_application = true;
      this.isShow_ok = false;
      this.isShow_new_friend_list = false;
      this.isShow_new_application = false;
    },

    Send_application() {
      var message = document.getElementById("request-message").value;
      this.$socket.emit("sendApplication", {
        to: this.search_account,
        message: message
      });
      this.isShow_personal = false;
      this.isShow_application = false;
      this.isShow_ok = true;
      this.isShow_new_friend_list = false;
      this.isShow_new_application = false;
    },
    init_applicationlist() {
      this.axios
        .post(
          "api/friend/get_app",
          this.qs.stringify({
            account: this.account
          })
        )
        .then(response => {
          this.new_friend = [];
          console.log(response.data);
          var nf = response.data;
          for (var i = 0; i < nf.length; i++) {
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
    },

    Show_new_friend() {
      this.init_applicationlist();
      this.search_account = null;
      this.isShow_personal = false;
      this.isShow_application = false;
      this.isShow_ok = false;
      this.isShow_new_friend_list = true;
      this.isShow_new_application = false;
    },

    Del_contact() {
      this.axios
        .post(
          "api/friend/del_contact",
          this.qs.stringify({
            account: this.account,
            contact_account: this.search_account
          })
        )
        .then(() => {
          this.init_contacts();
          this.isShow_personal = false;
          this.isShow_application = false;
          this.isShow_ok = true;
          this.isShow_new_friend_list = false;
          this.isShow_new_application = false;
        });
      this.axios
        .post(
          "api/friend/del_History",
          this.qs.stringify({
            account: this.account,
            contact_account: this.search_account
          })
        )
        .then(() => {});
    },

    Select_new_friend(
      name,
      account,
      img_path,
      content,
      personal_profile,
      id,
      index
    ) {
      var status = "";
      this.axios
        .post(
          "api/friend/get_status",
          this.qs.stringify({
            id: id
          })
        )
        .then(response => {
          console.log(response.data);
          var re = response.data;
          status = re[0].status;
          console.log(status);
          if (status == "添加成功") {
            this.isShow_new_application = false;
            this.isShow_personal = false;
            this.isShow_application = false;
            this.isShow_ok = false;
            this.isShow_new_friend_list = false;
            this.isShow_add_user = false;
            this.Select_friend(name, name, account, img_path, personal_profile);
          } else if (status == "待处理") {
            this.Index = index;
            this.search_account = account;
            this.search_name = name;
            this.request_id = id;
            this.request_status = status;
            this.search_img_path = img_path;
            this.search_content = content;
            this.isShow_application_button = true;
            this.isShow_new_application = true;
            this.isShow_personal = false;
            this.isShow_application = false;
            this.isShow_ok = false;
            this.isShow_new_friend_list = false;
            this.isShow_add_user = false;
          } else {
            this.Index = index;
            this.search_account = account;
            this.search_name = name;
            this.request_id = id;
            this.request_status = status;
            this.search_img_path = img_path;
            this.search_content = content;
            this.isShow_application_button = false;
            this.isShow_new_application = true;
            this.isShow_personal = false;
            this.isShow_application = false;
            this.isShow_ok = false;
            this.isShow_new_friend_list = false;
            this.isShow_add_user = false;
          }
        });
    },

    Add_friend() {
      this.isShow_personal = false;
      this.isShow_application = false;
      this.isShow_ok = true;
      this.isShow_new_friend_list = false;
      this.isShow_new_application = false;
      this.axios
        .post(
          "api/friend/change_status",
          this.qs.stringify({
            user_account: this.account,
            contact_account: this.search_account,
            status: 1
          })
        )
        .then(response => {
          // Just to prevent eslint error
          console.log(response);
        });
      this.axios
        .post(
          "api/friend/change_status",
          this.qs.stringify({
            contact_account: this.account,
            user_account: this.search_account,
            status: 1
          })
        )
        .then(response => {
          // Just to prevent eslint error
          console.log(response);
        });
      this.axios
        .post(
          "api/friend/add_contact",
          this.qs.stringify({
            user_account: this.account,
            contact_account: this.search_account,
            name: this.search_name
          })
        )
        .then(response => {
          // Just to prevent eslint error
          console.log(response);
        });
      this.axios
        .post(
          "api/friend/add_contact",
          this.qs.stringify({
            user_account: this.search_account,
            contact_account: this.account,
            name: this.name
          })
        )
        .then(response => {
          // Just to prevent eslint error
          console.log(response);
        });

      this.init_contacts();
    },

    Refuse_friend() {
      this.isShow_personal = false;
      this.isShow_application = false;
      this.isShow_ok = true;
      this.isShow_new_friend_list = false;
      this.isShow_new_application = false;
      this.axios
        .post(
          "api/friend/change_refuse_status",
          this.qs.stringify({
            request_id: this.request_id
          })
        )
        .then(() => {});
    },

    Search_contact() {
      this.axios
        .post(
          "api/friend/get_contact",
          this.qs.stringify({
            user_account: this.account,
            str: this.search_str
          })
        )
        .then(response => {
          console.log(response.data);
          this.get_contacts = response.data;
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

    Change_remark_status() {
      this.change_remark = true;
    },

    Change_remark() {
      this.axios
        .post(
          "api/friend/change_remark",
          this.qs.stringify({
            account: this.account,
            contact_account: this.search_account,
            str: this.search_f_name
          })
        )
        .then(() => {
          this.change_remark = false;
          this.init_contacts();
        });
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
.middle-part {
  background-color: var(--mid-bg-color);

  // Top buttons part of middle nav
  .search-area {
    height: 134px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    .search-key {
      width: 220px;
      height: 34px;
      border: none;
      padding-left: 10px;
      border-radius: 5px;
    }

    .search-key:focus {
      outline: none;
    }

    .search-key::placeholder {
      color: var(--placeholder-color);
    }
  }

  // New friend requests part of middle nav
  .new-friend {
    height: 40px;
    background-color: var(--left-bg-color);
    color: #9d97a4;
    padding: 0 25px;
    line-height: 40px;
    cursor: pointer;
  }

  // Contact list part of middle nav
  .contact-list {
    ul {
      height: 75px;
      display: flex;
      align-items: center;
      padding-left: 25px;
      color: var(--menu-font-color);
      cursor: pointer;

      .contact-avatar {
        width: 55px;
        height: 55px;
        border-radius: 50%;
      }

      .contact-name {
        margin-left: 15px;
        margin-right: 15px;
      }
    }
  }

  // contact style when clicked
  .current-clicked {
    background: var(--mid-clicked-color);
  }
}

.middle-part-dark {
  background-color: var(--mid-bg-color-dark);

  .search-area {
    .search-key-dark {
      color: var(--menu-font-color-dark);
      background-color: var(--mid-clicked-color-dark);
    }

    .search-key-dark::placeholder {
      color: var(--placeholder-color-dark);
    }
  }

  .new-friend-dark {
    color: #88858c;
    background-color: var(--left-bg-color-dark);
  }

  .contact-list-dark {
    ul {
      color: var(--menu-font-color-dark);
    }
  }

  .current-clicked-dark {
    background: var(--mid-clicked-color-dark);
  }
}

// Right part of layout
.right-part {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--info-font-color);
  background-color: var(--right-bg-color);
}

.right-part-dark {
  color: var(--info-font-color-dark);
  background-color: var(--right-bg-color-dark);
}

// When right part is to show user info
.view-user-info {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .info-div {
    margin-bottom: 20px;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .info-avatar {
      img {
        height: 150px;
        width: 150px;
        border-radius: 50%;
      }
    }

    .info-avatar,
    .info-account,
    .info-nickname,
    .info-remarkname,
    .info-introduction {
      margin: 10px 0;
      display: flex;
      justify-content: center;
    }

    .edit-icon {
      margin-left: 5px;
      width: 23px;
      height: 23px;
      cursor: pointer;
    }

    .line-input {
      font-size: 18px;
      text-align: center;
      padding-bottom: 7px;
      background: transparent;
      outline: none;
      border: none;
      border-bottom: 1px solid #9d97a4;
    }

    .enter-icon {
      margin-left: 5px;
      width: 20px;
      height: 23px;
      cursor: pointer;
    }
  }

  .button-div {
    width: 100%;
    display: flex;
    justify-content: space-around;

    button {
      background-color: var(--special-color);
      border: none;
      color: white;
    }

    .el-button + .el-button {
      margin-left: 0;
    }
  }
}

.view-user-info-dark {
  .info-div {
    .line-input {
      color: var(--info-font-color-dark);
    }
  }
}

// When right part is to show apply list info
.application-list {
  width: 360px;
  ul {
    border-bottom: var(--splitter-color) 1px solid;
    display: flex;
    align-items: center;
    padding: 20px 10px;
    cursor: pointer;

    img {
      width: 55px;
      height: 55px;
      border-radius: 50%;
    }

    p {
      color: var(--placeholder-color);
      display: inline-block;
    }

    .application-name {
      color: var(--info-font-color);
      font-weight: bold;
      margin: 0 10px;
    }

    .application-status {
      color: var(--info-font-color);
      margin-left: 10px;
    }
  }

  ul:first-child {
    border-top: var(--splitter-color) 1px solid;
  }
}

.application-list-dark {
  ul {
    border-bottom: var(--splitter-color-dark) 1px solid;

    p {
      color: var(--placeholder-color-dark);
      display: inline-block;
    }

    .application-name {
      color: var(--info-font-color-dark);
    }

    .application-status {
      color: var(--info-font-color-dark);
    }
  }

  ul:first-child {
    border-top: var(--splitter-color-dark) 1px solid;
  }
}

// When right part is to view friend request
.view-application {
  h2 {
    text-align: center;
  }

  .applicant-info {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  img {
    width: 55px;
    height: 55px;
    border-radius: 50%;
  }

  .a-name {
    margin-top: 10px;
  }

  .a-msg {
    width: 280px;
    height: 120px;
    margin: 25px 0;
    overflow: auto;
    padding: 10px;
    // border: #b3c0d1 1px solid;
    background-color: var(--mid-bg-color);
    border-radius: 5px;
  }

  .operations {
    display: flex;
    justify-content: space-between;
  }

  button {
    width: 96px;
    border-radius: 5px;
  }

  .agree-btn {
    background-color: var(--special-color);
    border: none;
    color: white;
  }

  .refuse-btn {
    background-color: var(--mid-bg-color);
    color: black;
    border: none;
  }

  .status {
    text-align: center;
  }
}

.view-application-dark {
  .a-msg {
    border: none;
    background-color: var(--mid-bg-color-dark);
  }

  .refuse-btn {
    color: var(--info-font-color-dark);
    background-color: var(--mid-bg-color-dark);
    border: none;
  }
}

// When right part is to send friend request
.send-application {
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    text-align: center;
  }

  textarea {
    display: block;
    width: 280px;
    height: 150px;
    margin: 25px 0;
    padding: 10px;
    outline: none;
    box-sizing: border-box;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    color: var(--info-font-color);
    background-color: var(--mid-bg-color);
  }

  .submit {
    background-color: var(--special-color);
    border: none;
    color: white;
    border-radius: 5px;
  }
}

.send-application-dark {
  textarea {
    color: var(--info-font-color-dark);
    background-color: var(--mid-bg-color-dark);
    border: none;
  }
}
</style>
>>>>>>> refactor: change style of chatting page:src/components/Contacts.vue
