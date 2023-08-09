<template>
    <div class="chat-frame">
        <div class="aside" v-show="ash">
            <div class="title">
                <svg class="icon-qa-3" aria-hidden="true">
                    <use xlink:href="#icon-daima"></use>
                </svg>
                <h2>DaVinci AI</h2>
            </div>
            <div class="search">
                <el-input
                    placeholder="请输入搜索内容"
                    v-model="input"
                    @keyup.enter.native="getSearchData()"
                    @clear="getAllChatData()"
                    clearable>
                </el-input>
            </div>
            <div class="tab">
                <el-menu
                    background-color="rgb(21, 24, 21)"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                >
                <transition-group name="zoom" tag="ul">
                    <el-menu-item :index=data.index v-for="data in chatCache" :key="data.index" @click="jump(data.id)" v-show="true">
                        <i class="el-icon-delete delete" @click="removeChat(data.id)"></i>
                        <span slot="title" class="cache-title">{{ data.title }}</span>
                    </el-menu-item>
                </transition-group>
                </el-menu>
            </div>
            <div class="logout">
                <el-button class="btu0" type="primary" round  @click="loginout()"><span class="iconfont icon-tuichu3 icon-size"></span></el-button>
            </div>
            <div class="item-url">
                <span class="iconfont icon-githubb icon-git"></span>
                <el-link type="info" class="addr-size" :underline="false" href="https://github.com/Lxb921006/chat/tree/dev">项目地址</el-link>
            </div>
        </div>
        <div class="main">
            <div class="jump-top">
                <el-button circle mini @click="juamTop()"><span class="iconfont icon-cs-dw-xs-1"></span></el-button>
            </div>
            <transition name="el-zoom-in-top">
                <div class="collapse-aside" v-show="mh">
                    <svg class="icon ss-aside" aria-hidden="true" @click="showAside()">
                        <use xlink:href="#icon-wmf-common43"></use>
                    </svg>
                </div>
            </transition>
            <div class="content" ref="wrapper">
                <template v-if="show">
                    <div v-for="(data1, index1) in chatCache" :key="index1+1">
                        <!-- <markdown-code-block :code="data1.title" :cursor="data1.cursor"></markdown-code-block> -->
                        <h2 class="answer-title" :id=data1.id>
                            <p class="question" ref="title">
                                <svg class="icon-qa" aria-hidden="true">
                                    <use xlink:href="#icon-changjianwenti"></use>
                                </svg>
                                {{ data1.title }}  <span class="iconfont icon-fuzhi copy-title" @click="copyAll(data1.title)"></span>
                            </p>
                        </h2>
                        <div class="answer-loop">
                            <div class="answer-icon">
                                <svg class="icon-qa-2" aria-hidden="true">
                                    <use xlink:href="#icon-cankaodaan"></use>
                                </svg>
                            </div>
                            <!-- 自定义的代码高亮显示组件 -->
                            <markdown-code-block :code="data1.answer.join('')" :cursor="data1.cursor"></markdown-code-block>
                            <transition name="el-zoom-in-center">
                                <div class="finished-time" v-show="data1.timeShow">
                                    <i class="el-icon-time time-2">{{ data1.time }}</i>
                                    <div class="whole-answer">
                                        <el-dropdown>
                                            <span class="el-dropdown-link">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-shenglvehao"></use>
                                                </svg>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item icon="el-icon-document-copy" @click.native="copyAll(data1.answer.join(''))">复制整个对话</el-dropdown-item>
                                                <el-dropdown-item icon="el-icon-delete" @click.native="removeChat(data1.id)">删改该对话</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                </template>
            </div>
            <div class="stop">
                <transition name="el-zoom-in-center">
                    <el-button :style="{ visibility: stopResp ? 'visible' : 'hidden' }" round class="stop-b" @click="stopChat()" ><span class="iconfont icon-lujing"></span> 停止</el-button>
                </transition>
            </div>
            <div class="jump-bottom">
                <el-button circle mini @click="jumpFooter()"><span class="iconfont icon-cs-dw-xx-1"></span></el-button>
            </div>
            <el-divider></el-divider>
            <div class="footer list-group"  id="sortable">
                <div class="setting">
                    <el-popover
                        placement="right-start"
                        title="设置"
                        width="200"
                        trigger="click"
                        >
                        <el-row :gutter="10" class="set-item set-item-1">
                            <el-col :span="1" class="context-switch">是否开启上下文: </el-col>
                            <el-col :span="1">
                                <el-switch
                                    @change="isOpenContext()"
                                    v-model="contextSwitch"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" class="set-item">
                            <el-col :span="1" class="context-switch">是否开启白天模式: </el-col>
                            <el-col :span="1">
                                <el-switch
                                    @change="isOpenDay()"
                                    v-model="dnSwitch"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </el-col>
                        </el-row>
                        <el-button slot="reference">
                            <svg class="icon sessing-svg" aria-hidden="true">
                                <use xlink:href="#icon-shezhi"></use>
                            </svg>
                        </el-button>
                    </el-popover>
                </div>
                <div class="send-question">
                    <div class="send-input">
                        <el-input clearable  v-model="chatContent" @keyup.enter.native="wsInit()" :disabled="finished" @click.native="showModels()">
                            <el-button class="data-load" slot="append" icon="el-icon-position" @click="wsInit()" :loading="finished"></el-button>
                        </el-input>
                    </div>
                </div>
            </div>
            <div class="notice">
                <p>*仅供学习, 无任何其他用途*</p>
            </div>
        </div>
        
    </div>
</template>

<script>
import { Message } from 'element-ui'
import { mapState } from 'vuex'
import store from '../../store/index'
import wssUrl from "../../utils/wssUrl";
import 'highlight.js/styles/atom-one-dark-reasonable.css'  //这里有多个样式，自己可以根据需要切换
import MarkdownCodeBlock from './markdownCodeBlock';
// import BScroll from '@better-scroll/core'

export default {
    name: "chat",
    data()  {
        return {
            text:"copy me",
            now: "",
            timeShow: false,
            show2:true,
            showCursor: true,
            show1:true,
            show3:true,
            stopResp: false,
            clearS: "",
            isDragging: false,
            chatContent: "",
            input:"",
            contents: [],
            socket: null,
            chatLoad: true,
            show: false,
            mh: true,
            ash: true,
            contextSwitch: "",
            dnSwitch: false,
            showAsideView: false,
            id: 0,
            wsUrl: "",
            editableTabsValue: '',
            editableTabs: [],
            finished: false,
            icon: "#icon-fuzhi2",
            but1Icon: "el-icon-arrow-right",
            code:"",
            value: "text-davinci-003",
            cc: "<span class='cursor' v-show='this.cursor'>|</span>",
            options: [{value: 'babbage', label: 'babbage'}, {value: 'davinci', label: 'davinci'}, {value: 'text-davinci-edit-001', label: 'text-davinci-edit-001'}, {value: 'babbage-code-search-code', label: 'babbage-code-search-code'}, {value: 'text-similarity-babbage-001', label: 'text-similarity-babbage-001'}, {value: 'code-davinci-edit-001', label: 'code-davinci-edit-001'}, {value: 'text-davinci-001', label: 'text-davinci-001'}, {value: 'ada', label: 'ada'}, {value: 'curie-instruct-beta', label: 'curie-instruct-beta'}, {value: 'babbage-code-search-text', label: 'babbage-code-search-text'}, {value: 'babbage-similarity', label: 'babbage-similarity'}, {value: 'whisper-1', label: 'whisper-1'}, {value: 'code-search-babbage-text-001', label: 'code-search-babbage-text-001'}, {value: 'text-curie-001', label: 'text-curie-001'}, {value: 'code-search-babbage-code-001', label: 'code-search-babbage-code-001'}, {value: 'text-ada-001', label: 'text-ada-001'}, {value: 'text-embedding-ada-002', label: 'text-embedding-ada-002'}, {value: 'text-similarity-ada-001', label: 'text-similarity-ada-001'}, {value: 'ada-code-search-code', label: 'ada-code-search-code'}, {value: 'ada-similarity', label: 'ada-similarity'}, {value: 'text-davinci-003', label: 'text-davinci-003'}, {value: 'code-search-ada-text-001', label: 'code-search-ada-text-001'}, {value: 'text-search-ada-query-001', label: 'text-search-ada-query-001'}, {value: 'davinci-search-document', label: 'davinci-search-document'}, {value: 'ada-code-search-text', label: 'ada-code-search-text'}, {value: 'text-search-ada-doc-001', label: 'text-search-ada-doc-001'}, {value: 'davinci-instruct-beta', label: 'davinci-instruct-beta'}, {value: 'text-similarity-curie-001', label: 'text-similarity-curie-001'}, {value: 'code-search-ada-code-001', label: 'code-search-ada-code-001'}, {value: 'ada-search-query', label: 'ada-search-query'}, {value: 'text-search-davinci-query-001', label: 'text-search-davinci-query-001'}, {value: 'curie-search-query', label: 'curie-search-query'}, {value: 'gpt-3.5-turbo-0301', label: 'gpt-3.5-turbo-0301'}, {value: 'davinci-search-query', label: 'davinci-search-query'}, {value: 'babbage-search-document', label: 'babbage-search-document'}, {value: 'ada-search-document', label: 'ada-search-document'}, {value: 'text-search-curie-query-001', label: 'text-search-curie-query-001'}, {value: 'text-search-babbage-doc-001', label: 'text-search-babbage-doc-001'}, {value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo'}, {value: 'curie-search-document', label: 'curie-search-document'}, {value: 'text-search-curie-doc-001', label: 'text-search-curie-doc-001'}, {value: 'babbage-search-query', label: 'babbage-search-query'}, {value: 'text-babbage-001', label: 'text-babbage-001'}, {value: 'text-search-davinci-doc-001', label: 'text-search-davinci-doc-001'}, {value: 'text-search-babbage-query-001', label: 'text-search-babbage-query-001'}, {value: 'curie-similarity', label: 'curie-similarity'}, {value: 'curie', label: 'curie'}, {value: 'text-similarity-davinci-001', label: 'text-similarity-davinci-001'}, {value: 'text-davinci-002', label: 'text-davinci-002'}, {value: 'davinci-similarity', label: 'davinci-similarity'}, {value: 'cushman:2020-05-03', label: 'cushman:2020-05-03'}, {value: 'ada:2020-05-03', label: 'ada:2020-05-03'}, {value: 'babbage:2020-05-03', label: 'babbage:2020-05-03'}, {value: 'curie:2020-05-03', label: 'curie:2020-05-03'}, {value: 'davinci:2020-05-03', label: 'davinci:2020-05-03'}, {value: 'if-davinci-v2', label: 'if-davinci-v2'}, {value: 'if-curie-v2', label: 'if-curie-v2'}, {value: 'if-davinci:3.0.0', label: 'if-davinci:3.0.0'}, {value: 'davinci-if:3.0.0', label: 'davinci-if:3.0.0'}, {value: 'davinci-instruct-beta:2.0.0', label: 'davinci-instruct-beta:2.0.0'}, {value: 'text-ada:001', label: 'text-ada:001'}, {value: 'text-davinci:001', label: 'text-davinci:001'}, {value: 'text-curie:001', label: 'text-curie:001'}, {value: 'text-babbage:001', label: 'text-babbage:001'}],
        }
    },
    watch: {
        input: function(newVal, oldVal) {
            if (newVal === "") {
                this.getAllChatData();
            }
            this.getSearchData();
        }
    },
    computed: {
        ...mapState({
            'chatCache': state => state.chatCache.editableTabs,
        })
    },
    components: {
        MarkdownCodeBlock
    },
    methods: {
        stopChat(){
            if (this.socket) {
                this.close();
                this.socket.close();
                this.socket = null;
            }
        },
        getDate() {
            // 获取当前时间
            let now = new Date()

            // 格式化时间为字符串
            let year = now.getFullYear();
            let month = (now.getMonth() + 1).toString().padStart(2, '0');
            let day = now.getDate().toString().padStart(2, '0');
            let hour = now.getHours().toString().padStart(2, '0');
            let minute = now.getMinutes().toString().padStart(2, '0');
            let second = now.getSeconds().toString().padStart(2, '0');

            let formattedTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            return formattedTime;
        },
        loginout() {
            sessionStorage.removeItem('user');
            this.$router.replace('/login').catch((err) => err);
        },
        addB() {
            this.clearS = setInterval(() => {
                this.showCursor = !this.showCursor;
            }, 500);
        },
        getAllChatData () {
            if (sessionStorage.getItem("chatCache")) {
                store.commit("CLEAR_CHAT_CACHE");
                this.show = true;
                let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
                for (let i = 0; i < cacheData.length; i++) {
                    store.commit("ADD_CHAT_CACHE", cacheData[i]);
                }
            }
        },
        getSearchData() {
            if (this.chatCache.length != 0) {
                store.commit("GET_CHAT_CACHE", this.input);
            } else {
                console.log("还没有聊天数据哟");
            }
        },
        showAside() {
            const asideEl = document.querySelector('.aside');
            const asideSt = getComputedStyle(asideEl);
            if (asideSt.display == 'none') {
                document.querySelector(".aside").setAttribute("style", "display:block");
                document.querySelector(".main").setAttribute("style", "width: calc(100% - 200px)");
                // this.but1Icon = "el-icon-arrow-right";
            } else {
                document.querySelector(".aside").setAttribute("style", "display:none");
                document.querySelector(".main").setAttribute("style", "width:100%");
                // this.but1Icon = "el-icon-arrow-left";
            }
        },
        defaultHideAside() {
            if (!this.showAsideView) {
                document.querySelector(".aside").setAttribute("style", "display:none");
                document.querySelector(".main").setAttribute("style", "width:100%");
            }
        },
        showModels () {
            this.mh = true;
        },
        copyAll (text) {
            this.$copyText(text).then(() => {
                Message.info("已复制");
            }, () => {
                Message.error('复制失败');
            })
        },
        wsInit () {
            if (!this.chatContent) {
                Message.error("请输入对话内容.")
                return
            }

            if (this.input) {
                this.input = "";
                this.getAllChatData();
            }

            this.finished = true;
            let id = (100000000 - 1) * Math.random() + 1;
            let index = Math.random().toString(36).slice(-8);
            this.show = true;
            let data = {
                title: this.chatContent,
                answer: new Array,
                id: Math.floor(id),
                name: this.id++,
                index: index,
                cursor: true,
                time: this.getDate(),
                timeShow: false,
                cid: "",
                pid: "",
            };

            this.clearS = setInterval(() => {
                data.cursor = !data.cursor;
            }, 500);

            this.editableTabsValue = data.id;

            store.commit("ADD_CHAT_CACHE", data);

            if (typeof(WebSocket) === "undefined") {
                Message.error("您的浏览器不支持socket")
            } else {
                // 实例化socket
                this.wsUrl = `ws://${wssUrl.replace(/http:\/\//, '')}/ws/chat/${sessionStorage.getItem("user")}/`
                this.socket = new WebSocket(this.wsUrl);
                // 监听socket连接
                this.socket.onopen = this.open;
                // 监听socket错误信息
                this.socket.onerror = this.error;
                // 监听socket消息
                this.socket.onmessage = this.getMessage;
                // 监听socket关闭消息
                this.socket.onclose = this.close;
                
            }
        },
        open () {
            this.stopResp = true;
            this.send()
        },
        error () {
            Message.error("websocket连接失败")
        },
        checkContextStatus() {
            let contextSwitch = sessionStorage.getItem('oc');
            if (contextSwitch == 1) {
                this.contextSwitch = true;
            } else if (contextSwitch == 2) {
                this.contextSwitch = false;
            } else {
                this.contextSwitch = true;
            }
        },
        isOpenContext() {
            if (this.contextSwitch) {
                Message.success('对话已启用上下文关联');
                sessionStorage.setItem("oc", 1);
            } else {
                Message.warning('对话已禁用上下文关联');
                sessionStorage.setItem("oc", 2);
            }
        },
        isOpenDay() {
            const main = document.querySelector(".main");
            const aside = document.querySelector(".ss-aside");
            const answerTitle = document.querySelectorAll(".answer-title");
            const answerLoop = document.querySelectorAll(".answer-loop");
            const code = document.querySelectorAll(".code");
            const codeP = document.querySelectorAll('code p')
            if (this.dnSwitch) {
                main.style.backgroundColor = "#fff"
                aside.style.color = "#262626"

                answerTitle.forEach(paragraph => {
                    paragraph.style.backgroundColor = "#fff";
                    paragraph.style.color = "#262626";
                });
                
                answerLoop.forEach(paragraph => {
                    paragraph.style.backgroundColor = "#fff";
                });

                code.forEach(paragraph => {
                    paragraph.style.backgroundColor = "#fff";
                });

                codeP.forEach(paragraph => {
                    paragraph.classList.add('code-day');
                });

            } else {
                main.style.backgroundColor = "#262626";
                aside.style.color = "#fff";

                answerTitle.forEach(paragraph => {
                    paragraph.style.backgroundColor = "#262626";
                    paragraph.style.color = "#fff";
                });

                answerLoop.forEach(paragraph => {
                    paragraph.style.backgroundColor = "#373737";
                });

                code.forEach(paragraph => {
                    paragraph.style.backgroundColor = "#373737";
                });

                codeP.forEach(paragraph => {
                    paragraph.classList.remove('code-day');
                });
            }
            
        },
        getMessage (msg) {
            let jd = JSON.parse(msg.data);
            let div = document.querySelector(".content")
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].id == this.editableTabsValue) {
                    this.chatCache[i].answer.push(jd.data);
                    this.chatCache[i].cid = jd.cid;
                    this.chatCache[i].pid = jd.pid;
                } 
                div.scrollTop = div.scrollHeight - div.clientHeight;
            }
        },
        send () {
            let sendData = {};
            let lastData = [];
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            if (this.contextSwitch) {
                if (cacheData.length > 1) {
                //发送的信息关联上下文
                    lastData = cacheData[cacheData.length - 2];
                    sendData = {cid: lastData.cid, pid: lastData.pid, data: this.chatContent};
                } else {
                    // lastData = cacheData[cacheData.length];
                    sendData = {cid: "", pid: "", data: this.chatContent};
                }
            } else {
                sendData = {cid: "", pid: "", data: this.chatContent};
            }
            
            this.socket.send(JSON.stringify(sendData));
        },
        close () {
            this.finished = false;
            // this.mh = false;
            let div = document.querySelector(".content");
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].id == this.editableTabsValue) {
                    let data = {
                        id: this.chatCache[i].id, 
                        answer: this.chatCache[i].answer, 
                        time: this.getDate(), 
                        timeShow: true,
                        cid: this.chatCache[i].cid,
                        pid: this.chatCache[i].pid,
                    }
                    store.commit("SAVE_CHAT_CACHE_ANSWER", data);
                    break
                } 
                div.scrollTop = div.scrollHeight - div.clientHeight;
            }

            this.timeShow = true;
            this.stopResp = false;
            clearInterval(this.clearS);
        },
        jumpFooter () {
            let tab = document.getElementsByClassName('tab')[0];
            let content = document.getElementsByClassName('content')[0];
            if(content.scrollHeight > content.clientHeight) {
                setTimeout(function(){
                    //设置滚动条到最底部
                    content.scrollTop = content.scrollHeight;
                },0);
                setTimeout(function(){
                    //设置滚动条到最底部
                    tab.scrollTop = tab.scrollHeight;
                },0);
            }
        },
        juamTop() {
            let content = document.getElementsByClassName('content')[0]
            let tab = document.getElementsByClassName('tab')[0];
            if(content.scrollHeight > content.clientHeight) {
                
                setTimeout(function(){
                    //设置滚动条到最顶部
                    content.scrollTop = 0;
                },0);
                setTimeout(function(){
                    //设置滚动条到最顶部
                    tab.scrollTop = 0;
                },0);
            }
        },
        addChat(targetName, id) {
            let newTabName = ++this.tabIndex + '';
            this.editableTabs.push({
                title: targetName,
                name: newTabName,
                id: id,
                index: "index"+id
            });
            this.editableTabsValue = newTabName;
        },
        removeChat(targetName) {
            this.getAllChatData();
            let tabs = this.chatCache;
            let activeName = this.editableTabsValue;
            if (activeName == targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.id == targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.id;
                        }
                    }
                });
            }
            
            this.editableTabsValue = activeName;
            let newChat = tabs.filter(tab => tab.id != targetName);
            store.commit("REMOVE_CHAT_CACHE", newChat);
            
        },
        jump(id) {
            location.hash = "#" + id;
            document.getElementById(id).setAttribute("style", "color: #d9d04b;");
        }
    },
    filters: {
        getCode(data) {
            const regex = /```([\s\S]*?)```/g;
            const content = data;
            let newContent = content;
            let match;
            while ((match = regex.exec(content)) !== null) {
                // 将代码块用 <pre> 和 <code> 标签包裹起来
                const code = match[1].trim();
                const formattedCode = `<pre><code class="code">${code}</code></pre>`;
                newContent = newContent.replace(match[0], formattedCode);
            }
            return newContent;
        },
    },
    mounted() {
        if (window.innerWidth < 600) {
            this.ash = false;
        }
        this.checkContextStatus();
        this.getAllChatData();
        this.defaultHideAside();
    },
    created () {
    }
}
</script>

<style lang="scss" scoped>
::v-deep .code-day {
    color: #262626
}
.set-item-1 {
    border-top: 1px solid #e5e5e5;
    padding-top: 14px;
}
.set-item {
    margin-top: 15px;
}
.ss-aside:hover {
    color: #585858;
}
.context-switch {
    width: 128px;
}
::v-deep .el-popover__reference-wrapper button {
    background-color: #262626;
    border: none;
    width: 30px;
    height: 30px;
}
.setting {
    position: relative;
    bottom: 15px;
}
.sessing-svg {
    font-size: 11px;
    animation: rotate 16s linear infinite;

}
@keyframes rotate {
    from {
    transform: rotate(0deg);
    }
    to {
    transform: rotate(360deg);
    }
}
.copy-title {
    cursor: pointer;
    position: relative;
    top: 1px;
    left: 13px;
    font-size: 10px;
}
.copy-title:hover {
    color: #999999;
}
.finished-time {
    width: 659px;
    margin: 0 auto;
    position: relative;
    margin-top: -29px;
}
.whole-answer {
    white-space: pre-wrap;
    display: inline-block;
    /* margin: 10px auto; */
    /* width: 659px; */
    /* position: relative; */
    bottom: 68px;
    color: #fff;
    /* border-bottom-left-radius: 5px; */
    /* border-bottom-right-radius: 5px; */
    padding: 0 11px 0px 11px;
    /* padding-left: 5px; */
    /* font-size: 12px; */
    cursor: pointer;
}
::v-deep .custom-code-block {
  background-color: #2e2e2e;
  padding: 10px;
  line-height: 1.5;
  margin-bottom: 10px;
  border-radius: 0 0 11px 11px;
}
::v-deep .custom-code-block-dev {
  height: 49px;
  line-height: 49px;
  background-color: #262626;
  border-radius: 11px 11px 0 0;
  display: flex;
  justify-content: space-between;
}
::v-deep  .custom-code-block-dev p {
  padding-left: 10px;
}
::v-deep .code-3 {
  white-space: pre-wrap;
}
::v-deep .copy-1 {
    background-color: #262626;
    color: #fff;
    cursor: pointer;
    border: none;
    padding-right: 10px;
    border-radius: 0 11px 0 0;
}
::v-deep .copy-1:hover span {
    // background-color: #727272;
    // border-radius: 50%;
    color: #727272;
}
.chat-frame {
    height: 100%;
}
.title {
    padding: 14px 0;
}
.tab {
    height: 64%;
    overflow-y: auto;
    border-top: 1px solid #242424;
}
.search {
    width: 158px;
    margin: 24px auto;
    // border-bottom: 1px solid #242424;
}
.tab::-webkit-scrollbar {
    display: none;
}
.title h2 {
    display: inline-block;
    text-align: left;
    padding-left: 8px;
    color: rgb(233, 236, 238);
}
.aside {
    height: 100%;
    width: 200px;
    float: left;
    background-color: rgb(21, 24, 21);
}
.main {
    float: left;
    height: 100%;
    width: calc(100% - 200px);
    background-color: #262626;
}
.content {
    // padding: 20px;
    overflow: auto;
    // width: 700px;
    height: 76%;
    margin: 0 auto;
    scrollbar-width: none;
    // margin-right: calc(100% - 5vw);
}
.content::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none; /* 确保伪元素不遮挡实际内容的点击事件 */
}
.content::-webkit-scrollbar {
  width: 1px!important; /* 设置滚动条宽度 */
}

.content::-webkit-scrollbar-track {
  background-color: #373737!important; /* 设置滚动条背景颜色 */
}

.content::-webkit-scrollbar-thumb {
  background-color: #cecece!important; /* 设置滚动条滑块颜色 */
  border-radius: 3px; /* 设置滑块的圆角 */
  cursor: pointer;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #eeeded!important; /* 设置滚动条滑块悬停时的颜色 */
}
.footer {
    position: relative;
    width: 571px;
    margin: 0 auto;
    top: 16px
}
.jump-bottom {
    float: right;
    position: relative;
    bottom: 20%;
    right: 57px;
    opacity: 0.2;
}
.jump-top {
    position: fixed;
    right: 57px;
    top: 20%;
    opacity: 0.2;
    z-index: 100000;
}
.answer-title {
    margin: 0 auto;
    border-radius: 3px;
    line-height: 78px;
    height: 78px;
    font-size: 1rem;
    font-weight: 900;
    color: #fff;
    overflow-y: auto;
    /* padding: 0 11px; */
    width: 659px;
    // background-color: #fbfbfb;
    // color: #413e3e;
}
.answer-title::-webkit-scrollbar {
    display: none;
}
.question-1 {
    text-align: center;
}
.question-2 {
    text-align: left;
}
.answer-loop {
    text-align: justify;
    font-size: 1rem;
    overflow: auto;
    // padding: 18px;
    // background-color: #f7fbff;
    border-top: 1px solid #424242;
    border-bottom: 1px solid #424242;
    background-color: #373737;
}
.cache-title {
    font-size: 1rem;
    font-style: oblique;
}
.delete {
    z-index: 100000000;
}
.delete:hover {
    color: #af6060;
}
.copy {
    position: relative;
    width: 681px;
    height: 42px;
    bottom: 32px;
    /* top: -32px; */
    border-radius: 3px;
    margin: 0px auto;
    /* z-index: 1000; */
    background-color: #313542;
}
.code {
    white-space: pre-wrap;
    display: block;
    margin: 0 auto;
    width: 659px;
    position: relative;
    bottom: 15px;
    color: #fff;
    background-color: #373737;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 0 11px 5px 11px;
    font-size: 14px;
    // font-style: oblique;
}
.time-2 {
    // white-space: pre-wrap; 
    display: inline-block;
    position: relative;
    top: -8px;
    bottom: 1px;
    /* margin: 10px auto; */
    /* width: 659px; */
    /* position: relative; */
    bottom: 76px;
    color: #fff;
    /* border-bottom-left-radius: 5px; */
    /* border-bottom-right-radius: 5px; */
    padding: 0 0 0px 0;
    /* padding-bottom: 4px; */
    font-size: 12px;
    color: #009844!important;
}
.icon-qa {
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    position: relative;
    top: 5px;
}
.icon-qa-3 {
    position: relative;
    top: 3px;
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
.icon-qa-2 {
    display: block;
    margin: 0 auto;
    width: 580px;
    position: relative;
    right: 373px;
    top: 18px;
    height: 2em;
    fill: currentColor;
    overflow: hidden;
    
}
.icon-qa-copy {
    width: 27px;
    height: 39px;
    line-height: 39px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    float: right;
    cursor: pointer;
    padding-right: 8px;
}
.icon-qa-copy-2 {
    width: 27px;
    height: 39px;
    line-height: 39px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    float: left;
    cursor: pointer;
    padding-left: 8px;
}
.notice {
    margin-top: 40px;
    font-size: .75rem;
    color: #bfbfbf;
}
/* 效果过程 */
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.5s ease;
}
.zoom-enter {
  transform: scale(0.5);
  opacity: 0;
}
.zoom-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
.data-load {
    height: 58px;
    width: 57px;
}
::v-deep .data-load i {
    position: relative;
    right: 7px;
    font-size: 2em;
}
.collapse-aside {
    position: fixed;
    // top: 11px;
    z-index: 1000;
}
.btu1 {
    cursor: pointer;
    color: #fff;
    background-color: #616463;
    border-color: #616463;
}
pre code {
  font-family: monospace;
}
.logout {
    position: fixed;
    bottom: 68px;
    width: 200px;
}
.item-url {
    position: fixed;
    bottom: 34px;
    width: 200px;
}
.btu0 {
    width: 70%;
}
.stop {
    margin-top: 7px;
    visibility: visible;
}
.stop-b {
    width: 100px;
}
.icon-git {
    position: relative;
    top: 2px;
    right: 4px;
}
.addr-size {
    font-size: 12px;
}
.icon {
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    right: 4px;
    bottom: 0px;
    // top: 5px;
    color: #fff;
}

//适应手机
@media only screen and (max-width: 500px) {
    // .aside {
    //     display: none;
    // }
    .main {
        height: 100%;
        width: 100%;
    }
    .footer {
        width: 311px;
    }
    .copy, .icon-qa-2 {
        width: 100%;
    }
    .code{
        width: 94%;
    }
    .time-2 {
        width: 94%;
    }
    .notice {
        margin-top: 20px;
    }
    .title {
        padding: 11px 0;
    }
    .tab {
        height: 61%;
    }
}
::v-deep .cursor {
  background-color: rgb(238, 234, 234);
  width: 10px;
  height: 1em;
  display: inline-block;
  margin-left: 1px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}


// element-ui的css修改
:deep .el-divider {
    background-color: #424242;
    margin: 7px 0;
}
:deep .el-tabs__nav {
    float: none;
}
:deep .el-tabs--border-card {
    background-color: #151815;
}
:deep .el-tabs--border-card {
    border: 1px solid #151815; 
}
:deep .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: 1px solid #151815;
}
:deep .el-tabs--card>.el-tabs__header .el-tabs__item {
    border: 1px solid #151815;
    text-align: left;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
:deep .el-menu {
    border-right: 1px solid #151815;
}
:deep .el-menu-item {
    text-align: left;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
:deep .el-menu-item:hover {
    background-color: #373837 !important;
    border-radius: 3px;
}
:deep .el-input-group {
    box-shadow: 0px 0px 20px 0px rgb(0 0 0 / 25%);
}
:deep .el-input__inner {
    height: 57px;
    line-height: 57px;
    background-color: #262626;
    border: 1px solid #323232;
}
:deep .el-input-group__append, .el-input-group__prepend {
    background-color: #262626;
    border: 1px solid #323232;
}
:deep .el-input.is-disabled .el-input__inner {
    background-color: #262626;
    border: 1px solid #323232;
}
</style>