<template>
    <div class="chat-frame">
        <div class="aside">
            <div class="title">
                <svg class="icon-qa-3" aria-hidden="true">
                    <use xlink:href="#icon-tupian"></use>
                </svg>
                <h2>IMG AI</h2>
            </div>
            <div class="tab">
                <el-menu
                    background-color="rgb(21, 24, 21)"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                >
                    <el-menu-item :index=data.index v-for="(data,index) in imgList" :key="index" @click="jump(data.id)">
                        <i class="el-icon-delete delete" @click="removeTab(data.id)"></i>
                        <span slot="title" class="cache-title">{{ data.title }}</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </div>
        <div class="main">
            <div class="content">
                <template v-if="show">
                    <div v-for="(data1, index1) in imgList" :key="index1+1">
                        <h2 class="answer-title" :id=data1.id>
                            <svg class="icon-qa" aria-hidden="true">
                                <use xlink:href="#icon-changjianwenti"></use>
                            </svg>
                             {{ data1.title }}
                        </h2>
                        <div class="answer-loop" :load="true">
                            <el-tooltip class="item" effect="light" content="鼠标选中图片右键点击下载图片" placement="right" transition="el-fade-in-linear">
                                <el-image :src="data1.answer" class="img" @click="download(data1.answer)"></el-image>
                            </el-tooltip>
                        </div>
                    </div>
                </template>
            </div>
            <div class="scoll">
                <el-button icon="el-icon-bottom" circle small @click="footer()"></el-button>
            </div>
            <el-divider></el-divider>
            <div class="footer">
                <el-input clearable v-model="chatContent" placeholder="请输入你想要的图片" @keyup.enter.native="wsInit()">
                    <el-button slot="append" icon="el-icon-position" @click="wsInit()"></el-button>
                </el-input>
            </div>
            <div class="notice">
                <p>*仅供学习, 无任何商业用途*</p>
            </div>
        </div>
    </div>
    
</template>

<script>
import { Message, Loading } from 'element-ui'
import { mapState } from 'vuex'
import store from '../../store/index'




export default {
    name: "img.vue",
    data()  {
        return {
            chatContent: "",
            contents: [],
            socket: "",
            chatLoad: true,
            show: false,
            id: 0,
            wsUrl: "",
            editableTabsValue: '',
            editableTabs: [],
            loadOpt: {
                lock: true,
                text: '正在拼命生成图片...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            },
            ls: "",
        }
    },
    computed: {
        ...mapState({
            'imgList': state => state.imgCache.imgList,
        })
    },
    components: {
        // HighCode
    },
    methods: {
        wsInit () {
            this.ls = Loading.service(this.loadOpt);
            let id = (100000000 - 1) * Math.random() + 1;
            let index = Math.random().toString(36).slice(-8);
            this.show = true;
            let data = {
                title: this.chatContent,
                answer: "",
                id: Math.floor(id),
                name: this.id++,
                index: index,
            };
            this.editableTabsValue = data.id;
            this.imgList.push(data);
            store.commit("ADD_IMG_CACHE", this.imgList);

            if (typeof(WebSocket) === "undefined") {
                Message.error("您的浏览器不支持socket")
            } else {
                // this.addTab(this.chatContent, data.id);
                // 实例化socket
                this.wsUrl = `ws://${baseUrl.replace(/http:\/\//, '')}/ws/chat/lxb/`
                this.socket = new WebSocket(this.wsUrl);
                // 监听socket连接
                this.socket.onopen = this.open;
                // 监听socket错误信息
                console.log("this.socket.onerror>>>", this.socket.onerror);
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
            for (let i = 0; i < this.imgList.length; i++) {
                if (this.imgList[i].id == this.editableTabsValue) {
                    this.imgList[i].answer= jd;
                } 
            }
            window.scrollTo(0, document.body.scrollHeight);
        },
        send () {
            this.socket.send(this.chatContent);
        },
        close () {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                this.ls.close();
            });
            for (let i = 0; i < this.imgList.length; i++) {
                if (this.imgList[i].id == this.editableTabsValue) {
                    let data = {id: this.imgList[i].id, answer: this.imgList[i].answer}
                    store.commit("SAVE_IMG_CACHE", data);
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
            let tabs = this.imgList;
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
            store.commit("REMOVE_IMG_CACHE", newChat);
        },
        jump(id) {
            console.log(id);
            location.hash = "#" + id;
            document.getElementById(id).setAttribute("style", "color: #9fbb91;");
        },
        download(url) {
            window.open(url);
        },
    },
    mounted() {
        // console.log(document.body.scrollWidth);
        if (sessionStorage.getItem("imgList")) {
            this.show = true;
            store.commit("ADD_IMG_CACHE", JSON.parse(sessionStorage.getItem("imgList")));
        }
        
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
    overflow-y: hidden;
}
.tab::-webkit-scrollbar {
    display: none;
}
.title h2 {
    display: inline-block;
    text-align: left;
    padding-left: 17px;
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
    width: 400px;
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
    // text-align: justify;
    font-size: 1rem;
    overflow: auto;
    padding: 18px;
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
.code {
    white-space: pre-wrap;
    display: block;
    margin: 0 auto;
    width: 658px;
    position: relative;
    bottom: 49px;
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
    top: 18px;
    height: 2em;
    fill: currentColor;
    overflow: hidden;
    
}
.notice {
    margin-top: 40px;
    font-size: .75rem;
    color: rgba(0,0,0,.5);
}
.img {
    cursor: pointer;
}
// element-ui css修改
:deep .el-tabs__item {
    display: block;
    color: #fff;
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
    height: 50px;
    line-height: 50px;
}
</style>