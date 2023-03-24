<template>
    <div class="chat-frame">
        <div class="aside">
            <div class="title">
                <svg class="icon-qa-3" aria-hidden="true">
                    <use xlink:href="#icon-daima"></use>
                </svg>
                <h2>DaVinci AI</h2>
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
                                <el-tooltip class="item" effect="light" content="复制" placement="right" transition="el-fade-in-linear">
                                    <transition name="el-zoom-in-center">
                                        <svg class="icon-qa-copy" aria-hidden="true" @click="copy(data1.answer.join(''))" v-show="show2">
                                            <use :xlink:href="icon">copy</use>
                                        </svg>
                                    </transition>
                                </el-tooltip>
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
                <el-input clearable v-model="chatContent" placeholder="请输入你想了解的领域" @keyup.enter.native="wsInit()" :disabled="finished">
                    <el-button slot="append" icon="el-icon-position" @click="wsInit()" :loading="finished"></el-button>
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
import baseUrl from "../../utils/baseUrl";
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
            contents: [],
            socket: "",
            chatLoad: true,
            show: false,
            id: 0,
            wsUrl: "",
            editableTabsValue: '',
            editableTabs: [],
            finished: false,
            icon: "#icon-fuzhi2",
            code:"",
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
            this.chatCache.push(data);
            store.commit("ADD_CHAT_CACHE", this.chatCache);

            if (typeof(WebSocket) === "undefined") {
                Message.error("您的浏览器不支持socket")
            } else {
                // 实例化socket
                this.wsUrl = `ws://${baseUrl.replace(/http:\/\//, '')}/ws/chat/lxb/`
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
            // this.$message.success('websocket连接成功')
            this.send()
        },
        error () {
            Message.error("websocket连接失败")
        },
        getMessage (msg) {
            let jd = JSON.parse(msg.data);
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].id == this.editableTabsValue) {
                    // if(jd == "\n") {
                    //     jd = jd.replace(/\n/g,'<br>')
                    // }
                    this.chatCache[i].answer.push(jd);
                    window.scrollTo(0, document.body.scrollHeight);
                } 
            }
            
        },
        send () {
            this.socket.send(this.chatContent);
        },
        close () {
            this.finished = false;
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].id == this.editableTabsValue) {
                    let data = {id: this.chatCache[i].id, answer: this.chatCache[i].answer}
                    store.commit("SAVE_CHAT_CACHE_ANSWER", data);
                    break
                } 
            }
            this.$nextTick(() => {
                let blocks = document.querySelectorAll('.answer-loop p');
                // let blocks = document.querySelectorAll('pre code');
                blocks.forEach((block) => {
                    hljs.highlightBlock(block);
                });
            });
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
            console.log(id);
            location.hash = "#" + id;
            document.getElementById(id).setAttribute("style", "color: #9fbb91;");
        }
    },
    mounted() {
        if (sessionStorage.getItem("chatCache")) {
            this.show = true;
            store.commit("ADD_CHAT_CACHE", JSON.parse(sessionStorage.getItem("chatCache")));
        }
        this.$nextTick(() => {
            let blocks = document.querySelectorAll('.answer-loop p');
            // let blocks = document.querySelectorAll('pre code');
            blocks.forEach((block) => {
                hljs.highlightBlock(block);
            });
        });
    },
    created () {
        // this.wsInit();
    }
}
</script>

<style lang="scss" scoped>
.chat-frame {
    height: 100%;
}
.title {
    padding: 16px 0;
}
.tab {
    height: 73%;
    overflow-y: auto;
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
    height: 80px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 3px;
    line-height: 80px;
    font-size: 1rem;
}
.answer-loop {
    text-align: justify;
    font-size: 1rem;
    overflow: auto;
    // padding: 18px;
    background-color: #f7fbff;
    border-top: 1px solid #dee2de;
    border-bottom: 1px solid #dee2de;
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
    border-radius: 5px;
    padding: 0 11px 5px 11px;
    font-size: 14px;
    font-style: oblique;
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
    color: rgba(0,0,0,.5);
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
}
</style>