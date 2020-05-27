<template>
    <div class="history_show">
        <img src="icons/close.svg" style="width:30px;height:30px" id="close-btn" @click="backToLogin" />
        <div id="mywordcloud" style="width: 100%; height: 100%;" :data="worddata"></div>
    </div>
</template>

<script>
    import echarts from "echarts";
    import "echarts-wordcloud/dist/echarts-wordcloud";
    import "echarts-wordcloud/dist/echarts-wordcloud.min";
    export default {
        data() {
            return {
                load_show: false,
                worddata: []
            };
        },
        props: {
            IsDarkMode: {
                type: Boolean
            },
            contact: {
                type: String
            },
            account: {
                type: String
            }
        },
        mounted() {
            this.initChart();
        },
        methods: {
            backToLogin: function() {
                this.$emit("UpdateFlag", { Flag: false });
            },
            initChart() {
                this.axios
                    .post(
                        "api/chat/word_cloud",
                        this.qs.stringify({
                            account: this.account,
                            contact: this.contact,
                        })
                    )
                    .then(response => {
                        this.worddata = response.data.word_data;
                        if (this.worddata.length === 0){
                            this.$message({
                                showClose: true,
                                message: "您与该用户还未有聊天记录！",
                                type: "error"
                            });
                            this.backToLogin();
                        }
                        else{
                            var color = "#fff";
                            if (this.IsDarkMode)color = "#1A1A1A";
                            this.chart = echarts.init(document.getElementById("mywordcloud"));
                            const option = {
                                title: {
                                    text: "您与该用户聊天的词云",
                                    x: "center"
                                },
                                backgroundColor: color,
                                series: [
                                    {
                                        type: "wordCloud",
                                        gridSize: 10,
                                        sizeRange: [14, 60],
                                        rotationRange: [0, 0],
                                        textStyle: {
                                            normal: {
                                                color: function() {
                                                    return (
                                                        "rgb(" +
                                                        Math.round(Math.random() * 255) +
                                                        ", " +
                                                        Math.round(Math.random() * 255) +
                                                        ", " +
                                                        Math.round(Math.random() * 255) +
                                                        ")"
                                                    );
                                                }
                                            }
                                        },

                                        left: "center",
                                        top: "center",
                                        right: null,
                                        bottom: null,
                                        width: "200%",
                                        height: "200%",
                                        data: this.worddata
                                    }
                                ]
                            };
                            this.chart.setOption(option);
                        }
                    });
            }
        }
    };
</script>

<style  lang="less" scoped>
    .history_show {
        width: 100%;
        height: 67%;
    }
    #close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    #close-btn:hover {
        cursor: pointer;
    }
</style>
