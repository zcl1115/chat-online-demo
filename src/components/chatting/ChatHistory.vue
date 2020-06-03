<template>
  <div class="history_show" :class="{history_show_dark: IsDarkMode}">
    <!-- Close button part -->
    <img src="icons/close.svg" style="width:30px;height:30px" id="close-btn" @click="backToLogin" />

    <!-- Messages part -->
    <div class="history_message_show">
      <div
        class="message_box"
        v-for="(message, index) in chat_history_list"
        :key="index"
        @contextmenu.prevent="mouseclick(index, message.time)"
      >
        <div v-if="message.to === contact && message.from === account">
          <div class="btalk">
            <div class="avatar_box">
              <img :src="use_img" class="contactor_avatar" />
            </div>
            <span class="message" v-if="message.type === '0'">{{message.message}}</span>
            <span class="message" v-if="message.type === '1'">
              <div class="file_msg_div">
                <a class="file_name">{{message.message}}</a>
                <img class="file_icon" src="icons/download.svg" v-on:click="download(message)" />
              </div>
            </span>
          </div>
        </div>
        <div v-if="message.from === contact && message.to === account">
          <div class="atalk">
            <div class="avatar_box">
              <img :src="img_path" class="contactor_avatar" />
            </div>
            <span class="message" v-if="message.type === '0'">{{message.message}}</span>
            <span class="message" v-if="message.type === '1'">
              <div class="file_msg_div">
                <img class="file_icon" src="icons/download.svg" v-on:click="download(message)" />
                <a class="file_name">{{message.message}}</a>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Select buttons part: general searching -->
    <div class="select_function_area" v-if="!advanced_search">
      <!-- Select date part -->
      <div class="select_date">
        <i class="el-icon-arrow-left arrow" @click="front_day"></i>
        <el-date-picker
          v-model="search_key_date"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          class="el_input_stuff"
          :class="{el_input_stuff_dark: IsDarkMode}"
          style="margin-left:5px;margin-right: 5px"
        ></el-date-picker>
        <i class="el-icon-arrow-right arrow" @click="next_day"></i>
      </div>

      <!-- Show searching progress part -->
      <span v-if="load_show && !res_not_found" class="show_searching">
        <i class="el-icon-loading"></i>
        <span>查询中</span>
      </span>

      <!-- Search icon part -->
      <el-button
        icon="el-icon-search"
        @click="search_chat_history()"
        class="el_btn_stuff"
        :class="{el_btn_stuff_dark: IsDarkMode}"
        circle
      ></el-button>

      <!-- Advanced search icon part -->
      <el-button
        icon="el-icon-search"
        round
        @click="advanced_search = !advanced_search"
        class="el_btn_stuff"
        :class="{el_btn_stuff_dark: IsDarkMode}"
      >高级搜索</el-button>
    </div>

    <!-- Select buttons part: advanced searching -->
    <div class="select_function_area" v-if="advanced_search">
      <!-- Select date part -->
      <div class="select_date">
        <el-date-picker
          v-model="start_date"
          align="right"
          type="date"
          placeholder="起始日期"
          :picker-options="start_pickerOptions"
          class="el_input_stuff"
          :class="{el_input_stuff_dark: IsDarkMode}"
        ></el-date-picker>
        <el-date-picker
          v-model="end_date"
          align="right"
          type="date"
          placeholder="终止日期"
          :picker-options="end_pickerOptions"
          class="el_input_stuff"
          :class="{el_input_stuff_dark: IsDarkMode}"
          style="margin-left: 10px"
        ></el-date-picker>
      </div>

      <!-- Search keyword part -->
      <el-input
        placeholder="请输入搜索关键字"
        prefix-icon="el-icon-search"
        v-model="search_key_word"
        class="search_key_word el_input_stuff"
        :class="{el_input_stuff_dark: IsDarkMode}"
      ></el-input>
      <span v-if="load_show && !res_not_found" class="show_searching">
        <i class="el-icon-loading"></i>
        <i>查询中</i>
      </span>

      <!-- Search icon part -->
      <el-button
        icon="el-icon-search"
        @click="search_key_history"
        circle
        class="el_btn_stuff"
        :class="{el_btn_stuff_dark: IsDarkMode}"
      ></el-button>

      <!-- Close icon part -->
      <el-button
        icon="el-icon-close"
        @click="advanced_search = !advanced_search"
        circle
        class="el_btn_stuff"
        :class="{el_btn_stuff_dark: IsDarkMode}"
      ></el-button>
    </div>
  </div>
</template>

<script>
import { getCookie } from "../cookieUtil";

export default {
  data() {
    return {
      use_img: getCookie("UserLogoPath"),
      chat_history_list: [],
      advanced_search: false,
      search_key_word: "",
      search_key_date: "",
      start_date: "",
      end_date: "",
      value2: "",
      load_show: false,
      res_not_found: false,
      pickerOptions: {
        disabledDate: time => {
          let curDate = new Date().getTime();
          let one = 30 * 24 * 3600 * 1000;
          let oneMonths = curDate - one;
          return time.getTime() > Date.now() || time.getTime() < oneMonths;
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      start_pickerOptions: {
        disabledDate: time => {
          let curDate = new Date().getTime();
          let one = 30 * 24 * 3600 * 1000;
          let oneMonths = curDate - one;
          if (this.end_date !== "") {
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.end_date ||
              time.getTime() < oneMonths
            );
          } else {
            return time.getTime() > Date.now() || time.getTime() < oneMonths;
          }
        }
      },
      end_pickerOptions: {
        disabledDate: time => {
          let curDate = new Date().getTime();
          let one = 30 * 24 * 3600 * 1000;
          let oneMonths = curDate - one;
          return (
            time.getTime() < this.start_date ||
            time.getTime() > Date.now() ||
            time.getTime() < oneMonths
          );
        }
      }
    };
  },
  props: {
    IsDarkMode: {
      type: Boolean
    },
    contact: {
      type: String
    },
    img_path: {
      type: String
    },
    account: {
      type: String
    }
  },
  mounted() {
    this.getdatatime();
  },
  methods: {
    getdatatime() {
      //默认显示今天
      this.search_key_date = new Date();
      this.end_date = new Date();
      this.start_date = new Date(new Date().getTime() - 3600 * 1000 * 24 * 29);
    },
    front_day() {
      var date_time = this.search_key_date - 3600 * 1000 * 24;
      this.search_key_date = new Date(date_time);
    },
    next_day() {
      var now_date = this.search_key_date.getTime();
      if (now_date < Date.now() - 3600 * 1000 * 24) {
        var datetime = now_date + 3600 * 1000 * 24;
        this.search_key_date = new Date(datetime);
      }
    },
    search_chat_history() {
      this.load_show = !this.load_show;
      this.res_not_found = false;
      var year = this.search_key_date.getFullYear();
      var month =
        this.search_key_date.getMonth() + 1 < 10
          ? "0" + (this.search_key_date.getMonth() + 1)
          : this.search_key_date.getMonth() + 1;
      var day =
        this.search_key_date.getDate() < 10
          ? "0" + this.search_key_date.getDate()
          : this.search_key_date.getDate();
      this.axios
        .post(
          "api/chat/search",
          this.qs.stringify({
            account: this.account,
            contact: this.contact,
            date: year + "-" + month + "-" + day
          })
        )
        .then(response => {
          let status = response.data.status;
          this.res_not_found = true;
          if (!status) {
            this.$message({
              showClose: true,
              message: "该日期没有聊天记录！",
              type: "error"
            });
            return;
          }
          this.chat_history_list = response.data.chat_history_list;
          this.load_show = !this.load_show;
        });
    },
    search_key_history() {
      if (this.search_key_word === "") {
        this.$message({
          showClose: true,
          message: "请输入查找关键字！",
          type: "error"
        });
        return;
      }
      this.load_show = !this.load_show;
      this.res_not_found = false;
      this.axios
        .post(
          "api/chat/search_key",
          this.qs.stringify({
            account: this.account,
            contact: this.contact,
            start_date: this.start_date,
            end_date: this.end_date,
            key_word: this.search_key_word
          })
        )
        .then(response => {
          let status = response.data.status;
          this.chat_history_list = response.data.chat_history_list;
          if (this.chat_history_list.length === 0) {
            this.res_not_found = true;
            this.$message({
              showClose: true,
              message: "未查询到符合条件的结果！",
              type: "error"
            });
          } else {
            if (status) {
              this.res_not_found = true;
              this.$message({
                showClose: true,
                message: "该日期段内有未聊天的时间！",
                type: "error"
              });
            }
          }
          this.load_show = !this.load_show;
        });
    },
    mouseclick(index, time) {
      this.$confirm("将删除该聊天记录, 是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post(
              "api/chat/delete",
              this.qs.stringify({
                account: this.account,
                contact: this.contact,
                date: time
              })
            )
            .then(response => {
              let status = response.data.status;
              if (!status) {
                this.$message({
                  message: "删除出现意外",
                  type: "error"
                });
                return;
              }
              this.chat_history_list.splice(index, 1);
              this.$message({
                message: "已成功删除",
                type: "success"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    download(message) {
      this.$socket.emit("getFile", {
        from: message.from,
        to: message.to,
        file_name: message.content
      });
    },
    backToLogin: function() {
      this.$emit("UpdateFlag", { Flag: false });
    }
  }
};
</script>

<style lang="less">
// To override the style of element-ui's input and button
// Light
.el_input_stuff {
  .el-input__inner {
    border: none;
    background-color: var(--mid-bg-color);
  }

  .el-input__inner::placeholder {
    color: var(--placeholder-color);
  }

  .el-input__inner:focus {
    border: none;
  }
}

.el_btn_stuff {
  border: none !important;
  color: var(--info-font-color) !important;
  background-color: var(--mid-bg-color) !important;
}

.el_btn_stuff:hover {
  color: var(--special-color) !important;
}

// Dark
.el_input_stuff_dark {
  .el-input__inner {
    color: var(--info-font-color-dark);
    background-color: var(--mid-bg-color-dark);
  }

  .el-input__inner::placeholder {
    color: var(--placeholder-color-dark);
  }
}

.el_btn_stuff_dark {
  color: var(--info-font-color-dark) !important;
  background-color: var(--mid-bg-color-dark) !important;
}
</style>

<style  lang="less" scoped>
.history_show {
  grid-area: middle;
  overflow-y: auto;
  display: grid;
  grid-template-rows: auto 55px;
  position: relative;

  #close-btn {
    right: 12px;
    position: absolute;
    cursor: pointer;
  }

  .history_message_show {
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

  .select_function_area {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-top: var(--splitter-color) 1px solid;

    .select_date {
      display: inline-block;
      margin: 0 10px;

      .arrow {
        cursor: pointer;
      }
    }

    .show_searching {
      width: 100px;
    }

    .search_key_word {
      margin: 0 10px;
      width: 220px;
    }
  }
}

.history_show_dark {
  .history_message_show {
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

  .select_function_area {
    border-top: var(--splitter-color-dark) 1px solid;

    .select_date {
      .arrow {
        color: var(--info-font-color-dark);
      }
    }

    .show_searching {
      color: var(--info-font-color-dark);
    }

    .search_key_word {
      background-color: var(--mid-bg-color-dark);
    }
  }
}
</style>
