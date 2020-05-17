<template>
    <div class="history_show">
        <div class="history_message_show">
            <div class="message_box" v-for="(message, index) in chat_history_list" :key="index" @contextmenu.prevent="mouseclick(index, message.time)">
                <div v-if="message.to === contact && message.from === account">
                    <div class="btalk">
                        <div class="avatar_box">
                            <img :src="use_img" class="contactor_avatar" />
                        </div>
                        <span class="message" v-if="message.type === '0'">{{message.content}}</span>
                        <span class="message" v-if="message.type === '1'">
                            <a class="file_name">{{message.content}}</a>
                            <img class="file_icon" src="icons/download.svg" v-on:click="download(message)" />
                        </span>
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
                <div v-if="message.from === contact && message.to === account">
                    <div class="atalk">
                        <div class="avatar_box">
                            <img :src="img_path" class="contactor_avatar" />
                        </div>
                        <span class="message" v-if="message.type === '0'">{{message.content}}</span>
                        <span class="message" v-if="message.type === '1'">
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
        <div class="select_function_area" v-if="!advanced_search">
            <i class="el-icon-arrow-left" :class="{friend_name_dark: IsDarkMode}" @click="front_day"></i>
            <el-date-picker
                    style="margin-left:5px;margin-right: 5px"
                    v-model="search_key_date"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    >
            </el-date-picker>
            <i class="el-icon-arrow-right" :class="{friend_name_dark: IsDarkMode}" @click="next_day"></i>
            <span style="width:100px">
                <i class="el-icon-loading" v-if="load_show"></i><i v-if="load_show">查询中</i>
            </span>
            <el-button :class="{dark_button: IsDarkMode}" icon="el-icon-search" style="margin-left:5px" @click="search_chat_history()" circle></el-button>
            <el-button :class="{dark_button: IsDarkMode}" icon="el-icon-search" style="margin-left:5px" round @click="advanced_search = !advanced_search">高级搜索</el-button>
        </div>
        <div class="select_function_area" v-if="advanced_search">
            <el-date-picker
                    v-model="start_date"
                    align="right"
                    type="date"
                    placeholder="起始日期"
                    :picker-options="start_pickerOptions">
            </el-date-picker>
            <el-date-picker
                    style="margin-left:5px"
                    v-model="end_date"
                    align="right"
                    type="date"
                    placeholder="终止日期"
                    :picker-options="end_pickerOptions">
            </el-date-picker>
            <el-input
                    :class="{dark_search: IsDarkMode}"
                    style="margin-left:5px"
                    placeholder="请输入搜索关键字"
                    prefix-icon="el-icon-search"
                    v-model="search_key_word"
                    class="search_key_word">
            </el-input>
            <span style="width:100px">
                <i class="el-icon-loading" v-if="load_show"></i><i v-if="load_show">查询中</i>
            </span>
            <el-button :class="{dark_button: IsDarkMode}" style="margin-left:5px" icon="el-icon-search" @click="search_key_history" circle></el-button>
            <el-button :class="{dark_button: IsDarkMode}" style="float: right" icon="el-icon-close" circle @click="advanced_search = !advanced_search"></el-button>
        </div>
    </div>
</template>

<script>
    import {getCookie} from "../components/cookieUtil";

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
                pickerOptions: {
                    disabledDate: (time) => {
                        let curDate = (new Date()).getTime();
                        let one = 30 * 24 * 3600 * 1000;
                        let oneMonths = curDate - one;
                        return time.getTime() > Date.now()|| time.getTime() < oneMonths ;
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                start_pickerOptions: {
                    disabledDate: (time) => {
                        let curDate = (new Date()).getTime();
                        let one = 30 * 24 * 3600 * 1000;
                        let oneMonths = curDate - one;
                        if (this.end_date !== "") {
                            return time.getTime() > Date.now() || time.getTime() > this.end_date || time.getTime() < oneMonths;
                        } else {
                            return time.getTime() > Date.now() || time.getTime() < oneMonths;
                        }
                    }
                },
                end_pickerOptions: {
                    disabledDate: (time) => {
                        let curDate = (new Date()).getTime();
                        let one = 30 * 24 * 3600 * 1000;
                        let oneMonths = curDate - one;
                        return time.getTime() < this.start_date || time.getTime() > Date.now() || time.getTime() < oneMonths;
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
            getdatatime(){//默认显示今天
                this.search_key_date = new Date();
                this.end_date = new Date();
                this.start_date = new Date(new Date().getTime() - 3600 * 1000 * 24 * 29);
            },
            front_day(){
                var date_time = this.search_key_date - 3600 * 1000 * 24;
                this.search_key_date = new Date(date_time);
            },
            next_day(){
                var now_date=this.search_key_date.getTime();
                if(now_date < Date.now()-3600 * 1000 * 24)
                {
                    var datetime = now_date + 3600 * 1000 * 24;
                    this.search_key_date = new Date(datetime);
                }
            },
            search_chat_history(){
                this.load_show = !this.load_show;
                var year=this.search_key_date.getFullYear();
                var month= this.search_key_date.getMonth()+1<10 ? "0"+(this.search_key_date.getMonth()+1) : this.search_key_date.getMonth()+1;
                var day=this.search_key_date.getDate()<10 ? "0"+this.search_key_date.getDate() : this.search_key_date.getDate();
                this.axios
                    .post(
                        "api/chat/search",
                        this.qs.stringify({
                            account: this.account,
                            contact: this.contact,
                            date: year+"-"+month+"-"+day
                        })
                    )
                    .then(response => {
                        let status = response.data.status;
                        if (!status){
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
            search_key_history(){
                if (this.search_key_word === ""){
                    this.$message({
                        showClose: true,
                        message: "请输入查找关键字！",
                        type: "error"
                    });
                    return;
                }
                this.load_show = !this.load_show;
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
                        console.log(this.chat_history_list);
                        if (this.chat_history_list.length === 0){
                            this.$message({
                                showClose: true,
                                message: "未查询到符合条件的结果！",
                                type: "error"
                            });
                        }else{
                            if (status){
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
            mouseclick(index, time){
                this.$confirm('将删除该聊天记录, 是否确定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
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
                            if (!status){
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
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            download(message) {
                console.log("child's download method called");
                console.log(message);
                this.$socket.emit("getFile", {
                    from: message.from,
                    to: message.to,
                    file_name: message.content
                });
            },
        }
    };
</script>

<style  lang="less" scoped>

    .history_show {
        width: 100%;
        height: 67%;
    }
    .history_message_show {
        width: 100%;
        height: 90%;
        overflow: auto;
        overflow-x: hidden;
    }
    .select_function_area{
        width: 100%;
        height: 10%;
    }
    .search_key_word{
        width: 25%;
    }

    .message_box {
        margin-top: 2px;
    }

    .content {
        border: none;
        resize: none;
        cursor: pointer;
        padding-top: 5px;
        font-family: "SimSun", "Times New Roman", Georgia, Serif, serif;
        width: 100%;
        height: 100%;
        line-height: 10px;
        font-size: 20px;
    }
    .content_dark {
        background-color: rgb(0, 0, 0);
        color: rgb(240, 240, 240);
    }
    .content:focus {
        outline: none;
    }
    .dark_button{
        background-color: #131313;
        color: rgb(220, 220, 220);
        border-color: #131313;
    }
    .round_icon {
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
    .contact_name {
        float: left;
        width: 100px;
        text-align: left;
        margin-top: 12px;
        margin-left: 20px;
    }
    .notice {
        float: left;
        margin-top: 18px;
        width: 10px;
        height: 10px;
    }

    .contact {
        width: 100%;
        height: 60px;
    }

    .contact_dark {
        color: rgb(240, 240, 240);
    }

    .friend_name_dark{
        color: rgb(220, 220, 220);
    }

    .icon {
        margin-left: 5px;
        width: 25px;
        height: 25px;
    }
    .inline-block {
        display: inline-block;
    }
    .upload {
        opacity: 0;
    }
    p {
        margin-top: -8px;
        margin-left: 30px;
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
