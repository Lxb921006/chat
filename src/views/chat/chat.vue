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
            <transition name="el-zoom-in-top">
                <div class="collapse-aside" v-show="mh">
                    <svg class="icon ss-aside" aria-hidden="true" @click="showAside()">
                        <use xlink:href="#icon-wmf-common43"></use>
                    </svg>
                </div>
            </transition>
            <!-- Ai回复内容 -->
            <div class="content" ref="wrapper">
                <transition name="el-zoom-in-top">
                    <div class="reach" v-show="showhi">
                        <svg class="icon-qa-3" aria-hidden="true"><use xlink:href="#icon-tishi1"></use></svg> <span>顶部</span>
                        <p>
                            <span>模型: 【{{ selectedModel }}】; </span>
                            <span v-if="contextSwitch">上下文: 【开启】</span>
                            <span v-else>上下文: 【关闭】</span>
                        </p>
                    </div>
                </transition>
                <transition-group name="el-zoom-in-center">
                <template v-if="show">
                    <div v-for="(data1, index1) in chatCache" :key="index1+1" class="z-content">
                        <transition name="el-zoom-in-top">
                            <div class="platform" @click="chatGptUrl(data1.model)" v-if="data1.answer.length > 0">
                                <p>
                                    <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data1.icon"></use></svg> <span>{{ data1.model }}</span>
                                </p>
                            </div>
                        </transition>
                        <h2 class="answer-title" :id=data1.id>
                            <p class="question" ref="title">
                                <svg class="icon-qa" aria-hidden="true">
                                    <use xlink:href="#icon-changjianwenti"></use>
                                </svg>
                                {{ data1.title }}  <span class="iconfont icon-fuzhi copy-title" @click="copyAll(data1.title)"></span>
                                <!-- <markdown-title :code="data1.title" :cursor="data1.cursor"></markdown-title> -->
                            </p>
                        </h2>
                        <div class="answer-loop">
                            <div class="answer-icon">
                                <svg class="icon-qa-2" aria-hidden="true">
                                    <use xlink:href="#icon-cankaodaan"></use>
                                </svg>
                            </div>
                            <!-- 自定义的代码语言自动识别以及高亮显示组件 -->
                            <markdown-code-block :code="data1.answer.join('')" :cursor="data1.cursor" v-if="data1.answer.length > 0"></markdown-code-block>
                            <!-- 光标 -->
                            <span class="cursor" v-else></span>
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
            </transition-group>
                <transition name="el-zoom-in-top">
                    <div class="reach" v-show="showhi">
                        <svg class="icon-qa-3" aria-hidden="true"><use xlink:href="#icon-tishi1"></use></svg> <span>底部</span>
                        <p>
                            <span>模型: 【{{ selectedModel }}】; </span>
                            <span v-if="contextSwitch">上下文: 【开启】</span>
                            <span v-else>上下文: 【关闭】</span>
                        </p>
                    </div>
                </transition>
            </div>
            <div class="stop">
                <transition name="el-zoom-in-top">
                    <div class="jump-top">
                        <el-button v-show="showhi" circle mini @click="juamTop()"><span class="iconfont icon-cs-dw-xs-1"></span></el-button>
                    </div>
                </transition>
                <transition name="el-zoom-in-center">
                    <el-button :style="{ visibility: stopResp ? 'visible' : 'hidden' }" round class="stop-b" @click="stopChat()" ><span class="iconfont icon-lujing"></span> 停止</el-button>
                </transition>
                <transition name="el-zoom-in-top">
                    <div class="jump-bottom">
                        <el-button v-show="showhi" circle mini @click="jumpFooter()"><span class="iconfont icon-cs-dw-xx-1"></span></el-button>
                    </div>
                </transition>
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
                            <el-col :span="1" class="context-switch col-font">是否开启上下文: </el-col>
                            <el-col :span="1" class="z-col-2">
                                <el-switch
                                    @change="isOpenContext()"
                                    v-model="contextSwitch"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </el-col>
                            <el-col :span="1" class="z-col-3 col-font">是否开启白天模式: </el-col>
                            <el-col :span="1" class="z-col-4">
                                <el-switch
                                    @change="isOpenDay()"
                                    v-model="dnSwitch"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </el-col>
                            <el-col :span="1" class="z-col-5 col-font">模型选择: </el-col>
                            <el-col :span="1" class="z-col-6">
                                <el-select v-model="selectedModel" placeholder="请选择" class="c-select" @change="modelSwitch()">
                                    <el-option
                                    v-for="item in modelAll"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled"
                                    >
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-button slot="reference">
                            <svg class="icon sessing-svg" aria-hidden="true">
                                <use xlink:href="#icon-shezhi3"></use>
                            </svg>
                        </el-button>
                    </el-popover>
                </div>
                <!-- 回收站 -->
                <div class="rb">
                    <el-popover
                        placement="right"
                        width="400"
                        trigger="click">
                        <div class="z-rb-title">
                            <h2>回收站</h2>
                        </div>
                        <el-row :gutter="20" class="z-rb-search">
                            <el-col :span=10>
                                <el-input v-model="rbData" size="mini" clearable @keyup.enter.native="getSearchRbData()" @clear="getAllRbData()"></el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" class="z-rb-clear">
                            <el-col :span=10>
                                <el-button type="danger" icon="el-icon-delete-solid" round size="mini" @click="clearRbData()">清空回收站</el-button>
                            </el-col>
                        </el-row>
                        <el-table :data="chatRecycle" stripe height="249">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column width="150" property="title" show-overflow-tooltip label="title"></el-table-column>
                            <el-table-column width="150" property="answer" show-overflow-tooltip label="答案">
                                <template slot-scope="scope">
                                    <el-link :underline="false">{{ scope.row.answer.join('') }}</el-link>
                                </template>
                            </el-table-column>
                            <el-table-column property="model" label="模型"></el-table-column>
                            <el-table-column prop="operate" label="操作" width="200">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="restoreChat(scope.row)" type="primary">
                                        <svg class="icon z-rb-restore-icon" aria-hidden="true">
                                            <use xlink:href="#icon-huifu2"></use>
                                        </svg>恢复
                                    </el-button>
                                    <el-button size="mini" @click="removeRbData(scope.row)" type="danger">
                                        <svg class="icon z-rb-restore-icon" aria-hidden="true">
                                            <use xlink:href="#icon-shanchu2"></use>
                                        </svg>删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button slot="reference">
                            <svg class="icon z-rb-icon" aria-hidden="true">
                                <use xlink:href="#icon-huishouzhan1"></use>
                            </svg>
                        </el-button>
                    </el-popover>
                </div>
                <!-- 用户管理 -->
                <div class="user rb">
                    <el-popover
                        placement="right"
                        width="400"
                        trigger="click">
                        <div class="z-rb-title">
                            <h2>用户管理</h2>
                        </div>
                        <el-row :gutter="20">
                            <el-col :span=10>
                                <el-input v-model="rbData" size="mini" clearable></el-input>
                            </el-col>
                        </el-row>
                        <el-table :data="userData" stripe height="249">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column width="150" property="user" show-overflow-tooltip label="用户"></el-table-column>
                            <el-table-column width="150" property="answer" show-overflow-tooltip label="密码"></el-table-column>
                            <el-table-column prop="operate" label="操作">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="restoreChat(scope.row.id)" type="primary">更新</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button slot="reference">
                            <svg class="icon z-rb-icon" aria-hidden="true">
                                <use xlink:href="#icon-yonghubangzhu"></use>
                            </svg>
                        </el-button>
                    </el-popover>
                </div>
                <div class="send-question">
                    <div class="send-input">
                        <!-- <el-input clearable  v-model="chatContent" @keyup.enter.native="wsInit()" :disabled="finished" @click.native="showModels()">
                            <el-button class="data-load" slot="append" icon="el-icon-position" @click="wsInit()" :loading="finished"></el-button>
                        </el-input>
                         -->
                         <el-input
                            type="textarea"
                            :rows="6"
                            :autosize="{ minRows: 2, maxRows: 6 }"
                            placeholder="请输入对话内容"
                            v-model="chatContent"
                            @keyup.enter.native="wsInit()"
                            :disabled="finished"
                            resize="none"
                            >
                        </el-input>
                        <el-button slot="reference" @click="wsInit()">
                            <svg class="icon z-send-button" aria-hidden="true">
                                <use xlink:href="#icon-send-01"></use>
                            </svg>
                        </el-button>
                    </div>
                </div>
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
import MarkdownCodeBlock from './markdownBlock';
import MarkdownTitle from './markdownCodeBlock';

// 所有对话数据都存储在浏览器本地，如果浏览器没有做相应的保存设置将无法保存对话记录(如需保存对话可在谷歌浏览器里边找到，设置->启动时->继续浏览上次打开的网页，即可)
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
            showhi: false,
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
            findChatData: "",
            rbData: "",
            dnSwitch: false,
            showAsideView: false,
            userData: [],
            id: 0,
            wsUrl: "",
            editableTabsValue: '',
            editableTabs: [],
            editableTabsZ: [],
            finished: false,
            icon: "#icon-fuzhi2",
            but1Icon: "el-icon-arrow-right",
            code:"",
            value: "text-davinci-003",
            cc: "<span class='cursor' v-show='this.cursor'>|</span>",
            selectedModel: "",
            claudeIcon: "#icon-Claude2",
            defaultIcon: "#icon-a-5_moxingtongbu",
            chatGptIcon: "#icon-a-Chatgpt35",
            modelAll: [
                {
                    value: 'claude-2',
                    label: 'claude-2',
                },
                {
                    value: 'chatGPT',
                    label: 'chatGPT'
                },
                {
                    value: 'claude-instant-100k',
                    label: 'claude-instant-100k',
                    disabled: true,
                },
                {
                    value: 'GPT-4',
                    label: 'GPT-4',
                    disabled: true,
                },
            ],
        }
    },
    watch: {
        input: function(newVal, oldVal) {
            if (newVal === "") {
                this.getAllChatData();
            }
            this.getSearchData();
        },
        rbData: function(newVal, oldVal) {
            if (newVal === "") {
                this.getAllRbData();
            }
            this.getSearchRbData();
        },
    },
    computed: {
        ...mapState({
            'chatCache': state => state.chatCache.editableTabs,
            'chatRecycle': state => state.chatRecycle.editableTabsZ
        }),
    },
    components: {
        MarkdownCodeBlock,
        // MarkdownTitle,
    },
    methods: {
        // 清空回收站
        clearRbData() {
            store.commit("Z_CLEAR_CHAT_CACHE", 'clear');
        },
        // 回收站恢复数据
        restoreChat(data) {
            let chatRecycleData = JSON.parse(sessionStorage.getItem("chatRecycle"));
            for (let i = 0; i < chatRecycleData.length; i++) {
                if (chatRecycleData[i].id == data.id) {
                    store.commit("ADD_CHAT_CACHE", chatRecycleData[i]);
                    this.removeRbData(data);
                    break;
                }
            }
            this.getContentLen();
            Message.success(`【${data.title}】已从回收站恢复`);
        },
        // 删除回收站的数据
        removeRbData(data) {
            this.getAllRbData();
            let tabs = this.chatRecycle;
            let rbChat = tabs.filter(tab => tab.id != data.id);
            store.commit("Z_REMOVE_CHAT_CACHE", rbChat);
            this.getContentLen();
        },
        // 回收站的所有数据
        getAllRbData() {
            if (sessionStorage.getItem("chatRecycle")) {
                store.commit("Z_CLEAR_CHAT_CACHE");
                let chatRecycleData = JSON.parse(sessionStorage.getItem("chatRecycle"));
                for (let i = 0; i < chatRecycleData.length; i++) {
                    store.commit("Z_ADD_CHAT_CACHE", chatRecycleData[i]);
                }
            }
        },
        // 回收站搜索数据
        getSearchRbData() {
            if (this.chatRecycle.length != 0) {
                store.commit("Z_GET_CHAT_CACHE", this.rbData);
            } else {
                console.log("还没有回收站数据哟");
            }
        },
        checkModel() {
            let model = window.sessionStorage.getItem('modelSelect');
            switch (model) {
                case '1':
                    this.selectedModel = 'claude-2';
                    break
                case '2':
                    this.selectedModel = 'chatGPT';
                    break;
                default:
                    this.selectedModel = 'claude-2';
                    break;
            }
        },
        modelSwitch() {
            switch (this.selectedModel) {
                case 'claude-2':
                    window.sessionStorage.setItem('modelSelect', 1);
                    break
                case 'chatGPT':
                    window.sessionStorage.setItem('modelSelect', 2);
                    break
            }
        },
        getContentLen() {
            if (this.chatCache.length > 0) {
                this.showhi = true;
            } else {
                this.showhi = false;
            }
        },
        chatGptUrl(model) {
            switch (model) {
                case 'claude-2':
                    window.open('https://claude.ai/');
                    break;
                case 'chatGPT':
                    window.open('https://openai.com/');
                    break;
            }   
        },
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
        // 查找聊天记录
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
        // 搜索聊天记录
        getSearchData() {
            if (this.chatCache.length != 0) {
                store.commit("GET_CHAT_CACHE", this.input);
            } else {
                console.log("还没有聊天数据哟");
            }
            this.getContentLen();
        },
        showAside() {
            const asideEl = document.querySelector('.aside');
            const asideSt = getComputedStyle(asideEl);
            if (asideSt.display == 'none') {
                document.querySelector(".aside").setAttribute("style", "display:block");
                if (this.dnSwitch) {
                    document.querySelector(".main").setAttribute("style", "width: calc(100% - 200px);background-color: #e5e5e5");
                } else {
                    document.querySelector(".main").setAttribute("style", "width: calc(100% - 200px);background-color: #262626");
                }
                // this.but1Icon = "el-icon-arrow-right";
            } else {
                document.querySelector(".aside").setAttribute("style", "display:none");
                if (this.dnSwitch) {
                    document.querySelector(".main").setAttribute("style", "width:100%;;background-color: #e5e5e5");
                } else {
                    document.querySelector(".main").setAttribute("style", "width:100%;background-color: #262626");
                }
                
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
        // 复制
        copyAll (text) {
            this.$copyText(text).then(() => {
                Message.info("已复制到粘贴板");
            }, () => {
                Message.error('复制失败');
            })
        },
        // websocket前后端交互
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
            let modelIcon= "";
            switch (this.selectedModel) {
            case 'claude-2':
                modelIcon = this.claudeIcon;
                break;
            case 'chatGPT':
                modelIcon = this.chatGptIcon;
                break;
            default:
                modelIcon = this.defaultIcon;
                break;
            }
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
                icon: modelIcon,
                model: this.selectedModel,
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
            console.log('-----------websocket连接成功------------')
            this.stopResp = true;
            this.send()
        },
        error () {
            Message.error("websocket连接失败")
        },
        // 发送数据
        send () {
            switch (this.selectedModel) {
                case 'claude-2':
                    this.sendClaude();
                    break
                case 'chatGPT':
                    this.sendChatGpt();
                    break
            }
        },
        // 后端发来的数据
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
            this.getContentLen();
        },
        // 关闭websocket连接后需要保存下ai的回复
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

            this.chatContent = "";
            this.timeShow = true;
            this.stopResp = false;
            clearInterval(this.clearS);
        },
        // 选择claude
        sendClaude() {
            let sendData = {};
            // let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            if (this.contextSwitch) {
                //发送的信息关联上下文
                sendData = {cid: "claude", pid: "", data: this.chatContent, model: this.selectedModel};
            } else {
                sendData = {cid: "", pid: "", data: this.chatContent, model: this.selectedModel};
            }

            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // 选择选择chatgpt
        sendChatGpt() {
            let sendData = {};
            let lastData = [];
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            let gptData =  cacheData.filter(cd => cd.model == 'chatGPT');
            if (this.contextSwitch) {
                if (gptData.length > 1) {
                    //发送的信息关联上下文
                    lastData = gptData[gptData.length - 2];
                    if (lastData.model == 'chatGPT') {
                        sendData = {cid: lastData.cid, pid: lastData.pid, data: this.chatContent, model: this.selectedModel};
                    } else {
                        sendData = {cid: "", pid: "", data: this.chatContent, model: this.selectedModel};
                    }
                } else {
                    sendData = {cid: "", pid: "", data: this.chatContent, model: this.selectedModel};
                }
            } else {
                sendData = {cid: "", pid: "", data: this.chatContent, model: this.selectedModel};
            }
            
            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // 上下文开关
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
        checkDn() {
            const main = document.querySelector(".main");
            let dn = JSON.parse(sessionStorage.getItem('day'));
            if (dn) {
                if (dn.status == 1) {
                    this.dnSwitch = true;
                    main.style.backgroundColor = dn.color;
                } else if (dn.status == 2) {
                    this.dnSwitch = false;
                    main.style.backgroundColor = dn.color;
                } else {
                    this.dnSwitch = false;
                }
            }
        },
        isOpenDay() {
            const main = document.querySelector(".main");
            if (this.dnSwitch) {
                main.style.backgroundColor = "#e5e5e5";
                let data = {status: 1, color: "#e5e5e5"}
                sessionStorage.setItem("day", JSON.stringify(data));
            } else {
                main.style.backgroundColor = "#262626";
                let data = {status: 2, color: "#262626"}
                sessionStorage.setItem("day", JSON.stringify(data));
            }
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
        // 删除对话记录, 会现在回收站保存
        removeChat(targetName) {
            this.getAllChatData();
            let tabs = this.chatCache;
            let rbChat = tabs.filter(tab => tab.id == targetName);
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
            this.getContentLen();

            if (this.rbData) {
                this.rbData = "";
                this.getAllRbData();
            }

            store.commit("Z_ADD_CHAT_CACHE", rbChat[0]);
            this.getContentLen();

            Message.success(`【${rbChat[0].title}】已删除, 可在回收站恢复`);
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
        this.checkDn();
        this.getContentLen();
        this.getAllRbData();
        this.checkModel();
    },
    created () {
    }
}
</script>

<style lang="scss" scoped>
    @import '../../../public/style/chat-style.css';
</style>