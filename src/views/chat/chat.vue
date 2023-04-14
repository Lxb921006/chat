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
                        <i class="el-icon-delete delete" @click="removeTab(data.id)"></i>
                        <span slot="title" class="cache-title">{{ data.title }}</span>
                    </el-menu-item>
                </transition-group>
                </el-menu>
            </div>
        </div>
        <div class="main">
            <transition name="el-zoom-in-top">
                <div class="models" v-show="mh">
                    <el-button class="btu1" size="mini" :icon="but1Icon" @click="showAside()"></el-button>
                </div>
            </transition>
            <div class="content">
                <template v-if="show">
                    <div v-for="(data1, index1) in chatCache" :key="index1+1">
                        <h2 class="answer-title" :id=data1.id>
                            <svg class="icon-qa" aria-hidden="true">
                                <use xlink:href="#icon-changjianwenti"></use>
                            </svg>
                             {{ data1.title }}
                        </h2>
                        <div class="answer-loop">
                            <svg class="icon-qa-2" aria-hidden="true">
                                <use xlink:href="#icon-cankaodaan"></use>
                            </svg>
                            <div class="copy">
                                <transition name="el-zoom-in-center">
                                    <svg class="icon-qa-copy" aria-hidden="true" @click="copy(data1.answer.join(''))" v-show="show2">
                                        <use :xlink:href="icon">copy</use>
                                    </svg>
                                </transition>
                            </div>
                            <!-- <pre><code class="code">{{ data1.answer.join('') }}</code></pre> -->
                            <p class="code">{{ data1.answer.join('') }}</p>
                        </div>
                    </div>
                </template>
            </div>
            <div class="scoll">
                <el-button icon="el-icon-bottom" circle small @click="footer()"></el-button>
            </div>
            <el-divider></el-divider>
            <div class="footer">
                <el-input clearable v-model="chatContent" @keyup.enter.native="wsInit()" :disabled="finished" @click.native="showModels()">
                    <el-button class="data-load" slot="append" icon="el-icon-position" @click="wsInit()" :loading="finished"></el-button>
                </el-input>
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
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.css'  //这里有多个样式，自己可以根据需要切换

export default {
    name: "chat",
    data()  {
        return {
            text:"copy me",
            show2:true,
            show1:true,
            show3:true,
            chatContent: "",
            input:"",
            contents: [],
            socket: "",
            chatLoad: true,
            show: false,
            mh: false,
            ash: true,
            id: 0,
            wsUrl: "",
            editableTabsValue: '',
            editableTabs: [],
            finished: false,
            icon: "#icon-fuzhi2",
            but1Icon: "el-icon-arrow-right",
            code:"",
            value: "text-davinci-003",
            options: [{value: 'babbage', label: 'babbage'}, {value: 'davinci', label: 'davinci'}, {value: 'text-davinci-edit-001', label: 'text-davinci-edit-001'}, {value: 'babbage-code-search-code', label: 'babbage-code-search-code'}, {value: 'text-similarity-babbage-001', label: 'text-similarity-babbage-001'}, {value: 'code-davinci-edit-001', label: 'code-davinci-edit-001'}, {value: 'text-davinci-001', label: 'text-davinci-001'}, {value: 'ada', label: 'ada'}, {value: 'curie-instruct-beta', label: 'curie-instruct-beta'}, {value: 'babbage-code-search-text', label: 'babbage-code-search-text'}, {value: 'babbage-similarity', label: 'babbage-similarity'}, {value: 'whisper-1', label: 'whisper-1'}, {value: 'code-search-babbage-text-001', label: 'code-search-babbage-text-001'}, {value: 'text-curie-001', label: 'text-curie-001'}, {value: 'code-search-babbage-code-001', label: 'code-search-babbage-code-001'}, {value: 'text-ada-001', label: 'text-ada-001'}, {value: 'text-embedding-ada-002', label: 'text-embedding-ada-002'}, {value: 'text-similarity-ada-001', label: 'text-similarity-ada-001'}, {value: 'ada-code-search-code', label: 'ada-code-search-code'}, {value: 'ada-similarity', label: 'ada-similarity'}, {value: 'text-davinci-003', label: 'text-davinci-003'}, {value: 'code-search-ada-text-001', label: 'code-search-ada-text-001'}, {value: 'text-search-ada-query-001', label: 'text-search-ada-query-001'}, {value: 'davinci-search-document', label: 'davinci-search-document'}, {value: 'ada-code-search-text', label: 'ada-code-search-text'}, {value: 'text-search-ada-doc-001', label: 'text-search-ada-doc-001'}, {value: 'davinci-instruct-beta', label: 'davinci-instruct-beta'}, {value: 'text-similarity-curie-001', label: 'text-similarity-curie-001'}, {value: 'code-search-ada-code-001', label: 'code-search-ada-code-001'}, {value: 'ada-search-query', label: 'ada-search-query'}, {value: 'text-search-davinci-query-001', label: 'text-search-davinci-query-001'}, {value: 'curie-search-query', label: 'curie-search-query'}, {value: 'gpt-3.5-turbo-0301', label: 'gpt-3.5-turbo-0301'}, {value: 'davinci-search-query', label: 'davinci-search-query'}, {value: 'babbage-search-document', label: 'babbage-search-document'}, {value: 'ada-search-document', label: 'ada-search-document'}, {value: 'text-search-curie-query-001', label: 'text-search-curie-query-001'}, {value: 'text-search-babbage-doc-001', label: 'text-search-babbage-doc-001'}, {value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo'}, {value: 'curie-search-document', label: 'curie-search-document'}, {value: 'text-search-curie-doc-001', label: 'text-search-curie-doc-001'}, {value: 'babbage-search-query', label: 'babbage-search-query'}, {value: 'text-babbage-001', label: 'text-babbage-001'}, {value: 'text-search-davinci-doc-001', label: 'text-search-davinci-doc-001'}, {value: 'text-search-babbage-query-001', label: 'text-search-babbage-query-001'}, {value: 'curie-similarity', label: 'curie-similarity'}, {value: 'curie', label: 'curie'}, {value: 'text-similarity-davinci-001', label: 'text-similarity-davinci-001'}, {value: 'text-davinci-002', label: 'text-davinci-002'}, {value: 'davinci-similarity', label: 'davinci-similarity'}, {value: 'cushman:2020-05-03', label: 'cushman:2020-05-03'}, {value: 'ada:2020-05-03', label: 'ada:2020-05-03'}, {value: 'babbage:2020-05-03', label: 'babbage:2020-05-03'}, {value: 'curie:2020-05-03', label: 'curie:2020-05-03'}, {value: 'davinci:2020-05-03', label: 'davinci:2020-05-03'}, {value: 'if-davinci-v2', label: 'if-davinci-v2'}, {value: 'if-curie-v2', label: 'if-curie-v2'}, {value: 'if-davinci:3.0.0', label: 'if-davinci:3.0.0'}, {value: 'davinci-if:3.0.0', label: 'davinci-if:3.0.0'}, {value: 'davinci-instruct-beta:2.0.0', label: 'davinci-instruct-beta:2.0.0'}, {value: 'text-ada:001', label: 'text-ada:001'}, {value: 'text-davinci:001', label: 'text-davinci:001'}, {value: 'text-curie:001', label: 'text-curie:001'}, {value: 'text-babbage:001', label: 'text-babbage:001'}],
        }
    },
    computed: {
        ...mapState({
            'chatCache': state => state.chatCache.editableTabs,
        })
    },
    components: {
        // VueCodeHighlight,
    },
    methods: {
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
                Message.info("还没有聊天数据哟")
            }
        },
        showAside() {
            const mainEl = document.querySelector('.main');
            const asideEl = document.querySelector('.aside');
            const asideSt = getComputedStyle(asideEl);
            if (asideSt.display == 'none') {
                document.querySelector(".aside").setAttribute("style", "display:block");
                document.querySelector(".main").setAttribute("style", "width: calc(100% - 200px)");
                this.but1Icon = "el-icon-arrow-right";
            } else {
                document.querySelector(".aside").setAttribute("style", "display:none");
                document.querySelector(".main").setAttribute("style", "width:100%");
                this.but1Icon = "el-icon-arrow-left";
            }
        },
        showModels () {
            this.mh = true;
        },
        copy (text) {
            this.show2 = false;
            let that = this;
            setTimeout(function(){
                that.show2 = true;
            },3000)
            this.$copyText(text).then(() => {
                Message.success("已复制");
            }, () => {
                Message.error('复制失败');
            })
        },
        wsInit () {
            if (!this.chatContent) {
                Message.error("请输出对话内容.")
                return
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
            };
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
            // Message.success('websocket连接成功')
            this.send()
        },
        error () {
            Message.error("websocket连接失败")
        },
        getMessage (msg) {
            let jd = JSON.parse(msg.data);
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].id == this.editableTabsValue) {
                    this.chatCache[i].answer.push(jd);
                    let div = document.querySelector(".content")
                    div.scrollTop = div.scrollHeight - div.clientHeight;
                } 
            }
            
        },
        send () {
            this.socket.send(this.chatContent+'|'+this.value);
        },
        close () {
            this.finished = false;
            this.mh = false;
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].id == this.editableTabsValue) {
                    let data = {id: this.chatCache[i].id, answer: this.chatCache[i].answer}
                    store.commit("SAVE_CHAT_CACHE_ANSWER", data);
                    break
                } 
            }
        },
        footer () {
            let content = document.getElementsByClassName('content')[0]
            if(content.scrollHeight > content.clientHeight) {
                setTimeout(function(){
                    //设置滚动条到最底部
                    content.scrollTop = content.scrollHeight;
                },0);
            }
        },
        addTab(targetName, id) {
            let newTabName = ++this.tabIndex + '';
            this.editableTabs.push({
                title: targetName,
                name: newTabName,
                id: id,
                index: "index"+id
            });
            this.editableTabsValue = newTabName;
        },
        removeTab(targetName) {
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
            document.getElementById(id).setAttribute("style", "color: #9fbb91;");
        }
    },
    mounted() {
        if (window.innerWidth < 600) {
            this.ash = false;
        }

        this.getAllChatData();
        // this.$nextTick(() => {
        //     let blocks = document.querySelectorAll('.answer-loop p');
        //     // let blocks = document.querySelectorAll('pre code');
        //     blocks.forEach((block) => {
        //         hljs.highlightBlock(block);
        //     });
        // });
    },
    created () {
    }
}
</script>

<style lang="scss" scoped>
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
    overflow-y: auto;
    // width: 700px;
    height: 76%;
    margin: 0 auto;
}
.footer {
    position: relative;
    width: 571px;
    margin: 0 auto;
    
}
.scoll {
    float: right;
    position: relative;
    bottom: 16px;
    right: 18px;
}
.answer-title {
    // height: 80px;
    margin: 0 auto;
    // background-color: #fff;
    border-radius: 3px;
    line-height: 80px;
    font-size: 1rem;
    color: #fff;
    overflow-y: auto;
    white-space: nowrap;
    padding: 0 11px;
}
.answer-title::-webkit-scrollbar {
    display: none;
}
.answer-loop {
    text-align: justify;
    font-size: 1rem;
    overflow: auto;
    // padding: 18px;
    // background-color: #f7fbff;
    border-top: 1px solid #424242;
    border-bottom: 1px solid #424242;
}
.cache-title {
    font-size: 1rem;
    font-style: oblique;
}
.delete {
    z-index: 100000000;
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
    margin: 13px auto;
    width: 659px;
    position: relative;
    bottom: 50px;
    color: #fff;
    background-color: #201f1f;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 0 11px 5px 11px;
    font-size: 14px;
    // font-style: oblique;
}
.icon-qa {
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
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
    top: 0;
    // bottom: 18px;
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
.models {
    position: fixed;
    top: 11px;
    z-index: 1000;
}
.btu1 {
    cursor: pointer;
    color: #fff;
    background-color: #616463;
    border-color: #616463;
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
    .code {
        width: 94%;
    }
    .notice {
        margin-top: 20px;
    }
    .title {
        padding: 11px 0;
    }
    .tab {
        height: 72%;
    }
}


// element-ui的css修改
:deep .el-divider {
    background-color: #424242;
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