<template>
    <div class="chat-frame">
        <!-- 左侧边栏 -->
        <div class="aside" v-show="ash">
            <div class="title">
                <svg class="icon-qa-5" aria-hidden="true">
                    <use xlink:href="#icon-a-Advantagesofartificial"></use>
                </svg>
                <h2>Chat AI</h2>
            </div>
            <div class="add_new_sess">
                <el-button type="primary" size="medium" icon="el-icon-document-add" round @click="createNewPage()">新建对话</el-button>
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
            <!-- 提问标题 -->
            <div class="tab">
                <el-menu
                    background-color="#151815"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    :default-active="selectedSess"
                >
                <transition-group name="zoom" tag="ul">
                    <el-menu-item :index=data.key v-for="data in chatCache" :key="data.key" @click="jump(data)" v-show="true">
                        <el-tooltip content="删除该组的所有会话, 请谨慎操作!" placement="top" effect="light">
                            <i class="el-icon-delete delete" @click="removeChatParentConfirm(data.key)"></i>
                        </el-tooltip>
                        <!-- <el-popover
                            placement="top"
                            width="160"
                            class="delete"
                            v-model="visibleTag">
                            <div class="popover-inp">
                                <div>
                                    <el-input v-model="tagInput" placeholder="输入标签" size="mini"></el-input>
                                </div>
                            </div>
                            <div class="popover-btn" style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="visibleTag = false">取消</el-button>
                                <el-button type="primary" size="mini" @click="visibleTag = false">确定</el-button>
                            </div>
                            <i slot="reference" class="el-icon-circle-plus-outline"></i>
                        </el-popover> -->
                        <!-- <el-tooltip content="给该话题组添加标签" placement="top" effect="light">
                            <i class="el-icon-circle-plus-outline delete" @click="removeChatParentConfirm(data.key)"></i>
                        </el-tooltip> -->
                        <span slot="title" class="cache-title">
                            <span slot="title" class="cache-title title-model-icon">
                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data.icon"></use></svg>
                            </span>
                            {{ data.title }}
                        </span>
                        <p slot="title" class="topic-tag">aaa</p>
                    </el-menu-item>
                </transition-group>
                </el-menu>
            </div>
            <div class="logout">
                <el-button class="btu0" type="primary" round  @click="logout()"><span class="iconfont icon-tuichu3 icon-size"></span></el-button>
            </div>
            <div class="z-user">
                <span class="iconfont icon-yonghuguanli1 icon-git"></span>
                <span class="z-user-style">{{ currentUser }}</span>
            </div>
            <div class="item-url">
                <span class="iconfont icon-githubb icon-git"></span>
                <el-link type="info" class="addr-size" :underline="false" @click="chatGptUrl('github')">项目地址</el-link>
            </div>
        </div>
        <!-- 右侧容器 -->
        <div class="main">
            <!-- 模型选择 -->
            <div class="model-select-box">
                <div class="contain">
                    <el-radio-group v-model="modelSelected">
                        <span v-for="(data, index) in modelAll" :key="index" class="model-icon-radio">
                            <el-radio  :label="data.label" :disabled="data.disabled" @click.native="getModelLabelRdo(data)">
                                <span class="cache-title title-model-icon icon-qa-radio">
                                    <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use :xlink:href="data.icon"></use></svg>
                                </span>
                                    {{ data.label }}
                            </el-radio>
                        </span>
                    </el-radio-group>
                </div>
            </div>
            <!-- 左侧边栏的收起跟打开按钮 -->
            <!-- <transition name="el-zoom-in-top"> -->
                <div class="collapse-aside" v-show="mh">
                    <svg class="icon z-aside" aria-hidden="true" @click="showAside()">
                        <use xlink:href="#icon-wmf-common43"></use>
                    </svg>
                    <transition name="el-zoom-in-top">
                        <p v-show="loginCheckStatus" class="login-check">请稍等, 正在检测数据{{ loginCheckDots }}</p>
                    </transition>
                </div>
            <!-- </transition> -->
            
            <!-- 清空所有选中的上下文 -->
            <div>
                <transition name="el-fade-in">
                    <div class="context-close" v-show="checked">
                        <span @click="clearContext()">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-qingchu" ></use>
                            </svg>
                        </span>
                </div>
                </transition>
            </div>
            <!-- 选中的上下文列表 -->
            <div>
                <transition name="el-fade-in">
                    <div class="context-list" v-show="checked">
                        <transition-group name="el-fade-in">
                            <el-row :gutter="10" v-for="(data, index) in specifiedContextsTitle" :key="index">
                                <span>
                                    <template>
                                        <el-link :underline="false" type="primary" :href="jumpToTitle(data)">
                                            <span class="cache-title title-model-icon icon-qa-radio">
                                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use :xlink:href="getContextIcon(data)"></use></svg>
                                            </span>{{ data | getContextTitle() }}
                                        </el-link>
                                    </template>
                                    <svg class="icon context-close-2" aria-hidden="true" @click="removeContext(data)">
                                        <use xlink:href="#icon-a-icon_huaban1" ></use>
                                    </svg>
                                </span>
                                <el-divider></el-divider>
                            </el-row>
                        </transition-group>
                    </div>
                </transition>
            </div>
            <!-- 新建会话 -->
            <div class="add-new-sess" v-show="showNewPage">
                <div class="intru-content">
                    <h3 class="intru-tt">
                        <svg class="icon intru-ic" aria-hidden="true">
                            <use xlink:href="#icon-a-Advantagesofartificial"></use>
                        </svg>
                        尊贵的老板, 您好, 这里是聚合了国内外主流ai的网站
                    </h3>
                    <p class="intru-pp">可以试试如下提问:</p>
                </div>
                <el-row :gutter="20">
                    <el-col :span="6" v-for="item in questions" :key="item.id" @click.native="wsInit(item.que)">
                        <el-card>
                            {{ item.que }}
                        </el-card>
                    </el-col>
                </el-row>
                <div class="change-ques">
                    <el-button type="primary" icon="el-icon-refresh" size="mini" round @click="changeTitle()">换一批</el-button>
                    <el-button type="primary" icon="el-icon-back" size="mini" round @click="returnChat()">返回</el-button>
                </div>
            </div>
            <!-- Ai回复 -->
            <div class="content" ref="wrapper" @scroll="handleScroll" v-loading="dataLoading" v-show="show">
                <transition name="el-fade-in-linear">
                    <div class="reach" v-show="showhi">
                        <svg class="icon-qa-3" aria-hidden="true"><use xlink:href="#icon-tishi1"></use></svg> <span>顶部</span>
                    </div>
                </transition>
                <transition-group name="el-fade-in-linear">
                    <template>
                        <div v-for="(data, index) in filterChatData" :key="index+1" class="z-content" v-show="show">
                            <div  class="z-content-1">
                                <div v-for="(data1, index1) in data.child" :key=index1+1 class="z-content-2">
                                    <!-- Ai模型 -->
                                    <transition name="el-fade-in-linear">
                                        <div class="platform">
                                            <p class="model-icon-name">
                                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data1.icon"></use></svg> <span @click="chatGptUrl(data1.model)" v-if="data1.title" class="z-model-name">{{ data1.model | getModelLabel(modelAll) }}</span>
                                            </p>
                                            <!-- 勾选上下文提交给ai针对同类问题进行连续提问 -->
                                            <p class="add-context">
                                                <el-tooltip content="勾选上下文提交给ai针对同类问题进一步深度讨论, 必须是相同模型的会话" placement="top">
                                                    <el-checkbox v-model="data1.checked" size="medium" @change="addContext(data1)"  ref="checkbox"></el-checkbox>
                                                </el-tooltip>
                                            </p>
                                        </div>
                                    </transition>
                                    <!-- 标题 -->
                                    <h2 class="answer-title" :id=data1.uuid>
                                        <p class="question" ref="title">
                                            <svg class="icon-qa" aria-hidden="true">
                                                <use xlink:href="#icon-changjianwenti"></use>
                                            </svg>
                                            {{ data1.title }}  
                                            <el-image class="ai-img" v-if="data1.imageUrl" :src="data1.imageUrl"></el-image>
                                            <span class="iconfont icon-fuzhi copy-title" @click="copyAll(data1.title)"></span>
                                        </p>
                                    </h2>
                                    <!-- 回复内容 -->
                                    <div class="answer-loop">
                                        <div class="answer-icon" :style="{ visibility: data1.answer.length > 0 ? 'visible' : 'hidden' }">
                                            <svg class="icon-qa-2" aria-hidden="true">
                                                <use xlink:href="#icon-cankaodaan"></use>
                                            </svg>
                                        </div>
                                        <!-- 自定义的代码语言自动识别以及高亮显示组件 -->
                                        <markdown-code-block :code="data1.answer" :cursor="data1.cursor" v-if="data1.answer.length > 0"></markdown-code-block>
                                        <!-- 等待ai回复时的提示 -->
                                        <span class="cursor" id="loading" v-else>waiting{{ dots }}</span>
                                        <!-- 对话完成时间 -->
                                        <transition name="el-zoom-in-center">
                                            <div class="finished-time" v-show="data1.timeShow">
                                                <el-tooltip content="AI完成时间" placement="top" effect="light">
                                                    <span class="finished-time-icon"><i class="el-icon-time">{{ data1.date }}</i></span>
                                                </el-tooltip>
                                                <el-tooltip content="复制" placement="top" effect="light">
                                                    <span @click="copyAll(data1.answer)" class="finished-copy-icon"><i class="el-icon-document-copy"></i></span>
                                                </el-tooltip>
                                                <span @click="removeChatChildConfirm(data1.uuid)" class="finished-delete-icon"><i class="el-icon-delete"></i></span>
                                            </div>
                                        </transition>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </transition-group>
                <transition name="el-fade-in-linear">
                    <div class="reach" v-show="showhi">
                        <svg class="icon-qa-3" aria-hidden="true"><use xlink:href="#icon-tishi1"></use></svg> <span v-loading="scrollLoading" v-if="scrollLoading"></span>
                        <span v-else>底部</span>
                    </div>
                </transition>
            </div>
            <!-- 是否停止ai响应 -->
            <div class="stop">
                <transition name="el-fade-in-linear">
                    <div class="jump-top">
                        <el-button v-show="showhi" circle mini @click="juamTop()"><span class="iconfont icon-cs-dw-xs-1"></span></el-button>
                    </div>
                </transition>
                <!-- 是否停止ai响应 -->
                <transition name="el-fade-in-linear">
                    <el-button :style="{ visibility: stopResp ? 'visible' : 'hidden' }" round class="stop-b" @click="stopChat()" ><span class="iconfont icon-lujing"></span> 停止</el-button>
                </transition>
                <transition name="el-zoom-in-top">
                    <div class="jump-bottom">
                        <el-button v-show="showhi" circle mini @click="jumpFooter()"><span class="iconfont icon-cs-dw-xx-1"></span></el-button>
                    </div>
                </transition>
            </div>
            <el-divider></el-divider>
            <div class="wx-hide-show">

            
                    <svg class="icon" aria-hidden="true" @click="wxCodeShow()">
                        <use xlink:href="#icon-shousuo1"></use>
                    </svg>
                
            </div>
            <transition name="el-zoom-in-center">
                <div class="ai-wx" v-show="wxhideShow">
                    <p>微信小程序</p>
                    <el-image
                        style="width: 100px; height: 100px"
                        src="../img/ai-wx.jpg"
                        fit="contain">
                    </el-image>
                </div>
            </transition>
            <!-- 所有设置 -->
            <div class="footer list-group"  id="sortable">
                <!-- 对话输入 -->
                <div class="send-question"> 
                    <div class="z-model-show">
                        <span>模型: 
                            <el-popover
                            placement="right"
                            width="400"
                            trigger="click">
                                <div class="z-rb-title">
                                    <h2>模型选择</h2>
                                </div>
                                <el-row :gutter="10" class="set-item">
                                    <el-col :span="1" class="z-col-5 col-font">模型选择: </el-col>
                                    <el-col :span="1" class="z-col-6">
                                        <el-select v-model="selectedModel" placeholder="请选择" class="c-select" @change="modelSwitch()">
                                            <el-option
                                                v-for="item in modelAll"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                :disabled="item.disabled"
                                                ref="opt"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-link slot="reference" type="success" :underline="false"  class="z-model-s">
                                    <el-badge is-dot class="item-z">
                                        <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="filterModelIcon"></use></svg> 【{{ selectedModel | getModelLabel2(modelAll) }}】
                                    </el-badge>
                                </el-link>
                            </el-popover>
                        </span>
                        <span>滚动加载: 
                            <el-popover
                                placement="right"
                                width="400"
                                title="滚动加载开关"
                                trigger="click">
                                <el-row :gutter="10" class="set-item set-item-1">
                                    <el-col :span="1" class="z-col-7 col-font">是否开启滚动加载: </el-col>
                                    <el-col :span="1" class="z-col-4">
                                        <el-tooltip content="建议关闭" placement="top">
                                            <el-switch
                                                @change="saveScrollLoadDataStatus()"
                                                v-model="isScrollLoadDataStatus"
                                                active-color="#13ce66"
                                                inactive-color="#ff4949">
                                            </el-switch>
                                        </el-tooltip>
                                    </el-col>
                                </el-row>
                                <el-link slot="reference" type="success" :underline="false"  class="z-model-s">
                                    <el-badge is-dot class="item-z">
                                        <span v-if="isScrollLoadDataStatus">【<span class="z-model-s">开启</span>】</span>
                                        <span v-else>【<span class="z-model-s-c">关闭</span>】</span>
                                    </el-badge>
                                </el-link>
                            </el-popover>
                        </span>
                        <!-- <span class="generate-img">生成图片: 
                            <el-tooltip content="生成图片请先勾选这里, 发送比如: 美丽的山水风景图片, 生成过程需要时间, 您的耐心等待是值得的." placement="top" effect="light" :value="tooltipShow">
                                <el-checkbox v-model="isGenerateImg" size="mini" @click.native="switchFuncModel('qt-vl')"></el-checkbox>
                            </el-tooltip>
                        </span>
                        <span class="generate-img">生成ppt: 
                            <el-tooltip content="生成ppt请先勾选这里, 发送比如: 2089年财务工作总结, 生成过程需要时间, 您的耐心等待是值得的." placement="bottom" effect="light" :value="tooltipShow">
                                <el-checkbox v-model="isGenerateppt" size="mini" @click.native="switchFuncModel('xf')"></el-checkbox>
                            </el-tooltip>
                        </span> -->
                    </div>
                    <div class="send-input">
                        <el-input
                            type="textarea"
                            autocomplete="on"
                            show-word-limit
                            :autosize="{ minRows: 5, maxRows: 5 }"
                            placeholder="请输入对话内容, 先按住ctrl再按enter键提交, 当ai只回复一半内容就断开需要继续回复时,请发送: 继续"
                            v-model="chatContent"
                            @keyup.native="handleKeyUp"
                            :disabled="finished"
                            resize="none"
                            >
                        </el-input>
                        <el-button slot="reference" :disabled="allowSend" @click="wsInit()">
                            <svg class="icon z-send-button" aria-hidden="true">
                                <use xlink:href="#icon-send-01"></use>
                            </svg>
                        </el-button>
                        <el-tooltip class="item" effect="dark" content="刷新对话记录" placement="top-start">
                            <el-button class="z-flush-data" @click="loadLatestTenData()">
                                <svg class="icon z-send-button" aria-hidden="true">
                                    <use xlink:href="#icon-shuaxin3"></use>
                                </svg>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="清除当前所有记录" placement="top-start">
                            <el-button class="z-clear-data" @click="clearCurrData()">
                                <svg class="icon z-send-button" aria-hidden="true">
                                    <use xlink:href="#icon-qingchu"></use>
                                </svg>
                            </el-button>
                        </el-tooltip>
                        <el-upload
                            :style="{ visibility: selectedModel=='qt-file' || selectedModel=='qt-vl' ? 'visible' : 'hidden' }"
                            class="upload-demo"
                            ref="upload"
                            :action=uploadUrl()
                            :on-preview="handlePreview"
                            :before-upload="checkUploadFileType"
                            :on-success="successUpload"
                            :on-remove="handleRemove"
                            multiple
                            :limit="1"
                            :data="fileData"
                            :file-list="fileList"
                            :on-exceed="handleExceed"
                            >
                            <el-tooltip class="item" effect="dark" content="只能上传.png|.jpg|.jpeg文件;" placement="top-start">
                                <el-button size="small" type="primary">
                                    <svg class="icon z-send-button" aria-hidden="true">
                                        <use xlink:href="#icon-fujian"></use>
                                    </svg>
                                </el-button>
                            </el-tooltip>
                        </el-upload>
                        <div class="over-z-index"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="file-text">
            <el-dialog
                title="文本内容"
                :visible.sync="fileTextVisible"
                :close-on-click-modal="false"
                width="600px"
                v-loading="fileTextLoad"
                :append-to-body="true"
                :lock-scroll="false"
                center
                v-draggable
                >
                <p class="ft">{{ fileText }}</p>
                <!-- <Markdown-title :code="fileText" :cursor="true"></Markdown-title> -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="fileTextVisible = false">取 消</el-button>
                    <el-button type="primary"  @click="copyAll(fileText)">复制文本</el-button>
                </span>
            </el-dialog>
        </div>
        <transition name="el-zoom-in-center">
            <div class="notice-word" v-if="noticeVisible" v-draggable>
                <h2 class="notice-title">
                    <el-button type="info" size="mini" @click="isOpenNoticeWord()">关闭</el-button>
                </h2>
                <iframe src="https://xn--o0uq09burn.com/?tags=tool" frameborder="0"></iframe>
            </div>
        </transition>
    </div>
</template>

<script>
import { Message } from 'element-ui'
import { MessageBox } from 'element-ui';
import { mapState } from 'vuex'
import store from '../../store/index'
import { wssSinUrl, wssUsUrl, wssSinApiUrl } from "../../utils/wssUrl";
import 'highlight.js/styles/atom-one-dark-reasonable.css'  //这里有多个样式，自己可以根据需要切换
import MarkdownCodeBlock from './markdownBlock';
import baseUrl from "../../utils/baseUrl";
import { chatList, chatSave, getFileText, chatDel, chatUpdate, downloadFile } from '../../api';
import { v4 as uuidv4 } from 'uuid';

// 1 关闭 false, 2 开启 true
export default {
    name: "chat",
    // 弹窗可拖拽
    directives: {
        draggable: {
            bind(el, binding, vnode) {
                el.style.position = 'fixed';
                el.style.zIndex = 1000;

                el.dragging = false;
                el.startX = 0;
                el.startY = 0;
                el.left = 0;
                el.top = 0;

                el.addEventListener('mousedown', function (event) {
                    el.dragging = true;
                    el.startX = event.clientX;
                    el.startY = event.clientY;

                    const rect = el.getBoundingClientRect();
                    el.left = rect.left;
                    el.top = rect.top;

                    document.addEventListener('mousemove', mouseMove);
                    document.addEventListener('mouseup', mouseUp);
                });

                function mouseMove(event) {
                    if (el.dragging) {
                        const left = event.clientX - el.startX + el.left;
                        const top = event.clientY - el.startY + el.top;
                        el.style.left = `${left}px`;
                        el.style.top = `${top}px`;
                    }
                }

                function mouseUp() {
                    if (el.dragging) {
                        el.dragging = false;
                        document.removeEventListener('mousemove', mouseMove);
                        document.removeEventListener('mouseup', mouseUp);
                    }
                }
            },
        },
    },
    data()  {
        return {
            visibleTag: false,
            tagInput: "",
            tooltipShow: true,
            isGenerateppt: false,
            isGenerateImg: false,
            wxhideShow: false,
            loginCheckStatus: false,
            loginCheckTimer: null,
            loginCheckDots: "",
            checkTime: 0,
            allowSend: false,
            contextUUID: "",
            contextIcon: "",
            modelSelected: "谷歌Gemini",
            selectedModelIcon: "",
            modelSwitchNotice: "点我",
            tenDataLoading: false,
            checked: false,
            specifiedContexts: [],
            specifiedContextsTitle: [],
            isOpenNewSess: false,
            selectedSess: "",
            showNewPage: false,
            searchBk: "",
            selectPage: 1,
            totalPages: 0,
            isOpenSwitch: true,
            dataLoading: false,
            pptCreate: false,
            fileText: '',
            noticeVisible: false,
            fileTextVisible: false,
            fileTextLoad: true,
            currentUser: '',
            loadTimer: null,
            dots: '',
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
            stopCursor: false,
            chatLoad: true,
            show: false,
            mh: true,
            ash: true,
            contextSwitch: "",
            findChatData: "",
            rbData: "",
            roleResp: false,
            showAsideView: false,
            userData: [],
            id: 0,
            wsUrl: "",
            editableTabsValue: '',
            editableTabs: [],
            editableTabsZ: [],
            fileList: [],
            finished: false,
            claudeFile: "",
            icon: "#icon-fuzhi2",
            but1Icon: "el-icon-arrow-right",
            code:"",
            cc: "<span class='cursor-2'>|</span>",
            value: "text-davinci-003",
            selectedModel: "",
            claudeIcon: "#icon-Claude2",
            defaultIcon: "#icon-a-5_moxingtongbu",
            chatGptIcon: "#icon-a-Chatgpt35",
            geminiIcon: "#icon-gooIcon",
            gpt4: "#icon-a-Chatgpt4",
            assistantIcon: "#icon-a-Chatgpt35",
            xfIcon: "#icon-xunfeichatgpt",
            wxIcon: "#icon-baidu",
            qwIcon: "#icon-a-result4",
            txIcon: "#icon-chanpinguanli",
            scrollLoading: false,
            setTimer: true,
            isScrollLoadDataStatus: true,
            fileData: {},
            repeatChange: 0,
            questions: [
                {id:1, que: "我爱我的国家, 帮我翻译成俄文"},
                {id:2, que: "帮我规划下假期旅游攻略"},
                {id:3, que: "帮我写个小红书关于女生穿搭的文案"},
                {id:4, que: "帮我画一个明星美女图片"},
            ],
            all_questions: [
                [
                    {id:1, que: "我爱我的国家, 帮我翻译成俄文"},
                    {id:2, que: "帮我规划下假期旅游攻略"},
                    {id:3, que: "帮我写个小红书关于女生穿搭的文案"},
                    {id:4, que: "帮我画一个明星美女图片"},
                ],
                [
                    {id:1, que: "讲个超级冷的冷笑话",},
                    {id:2, que: "帮我写个直播带货文案"},
                    {id:3, que: "帮我写个关于啤酒的营销文案"},
                    {id:4, que: "帮我写个详细的工作周报"},
                ],
                [
                    {id:1, que: "写个脑筋急转弯并附上答案"},
                    {id:2, que: "帮我写个关于销售的工作简历"},
                    {id:3, que: "帮我写一封动人的情书"},
                    {id:4, que: "帮我起个华丽的标题,主题为：衣服"},
                ],
            ],
            modelAll: [
                {
                    value: 'Gemini',
                    label: '谷歌Gemini',
                    disabled: false,
                    icon: '#icon-gooIcon',
                },
                {
                    value: 'qt-text',
                    label: '通义千问-文本模型',
                    disabled: false,
                    icon: '#icon-a-result4',
                },
                {
                    value: 'qt-code',
                    label: '通义千问-代码模型',
                    disabled: false,
                    icon: '#icon-a-result4',
                },
                {
                    value: 'qt-file',
                    label: '通义千问-文件模型',
                    disabled: true,
                    icon: '#icon-a-result4',
                },
                {
                    value: 'qt-vl',
                    label: '通义千问-视觉模型',
                    disabled: false,
                    icon: '#icon-a-result4',
                },
            ],
            allowFile: ['.png', '.jpg', '.jpeg'],
            loadCount: 0,
            historyDataLoading: false,
            pages: {
                page: 1,
                size: 5,
                totals: 0,
            },
        }
    },
    watch: {
        input: function(newVal, oldVal) {
            if (newVal === "") {
                this.getAllChatData();
            } else {
                this.getSearchData();
            }
            this.getContentLen();
        },
        rbData: function(newVal, oldVal) {
            if (newVal === "") {
                this.getAllRbData();
            } else {
                this.getSearchRbData();
            }
            this.getContentLen();
        },
    },
    computed: {
        ...mapState({
            'chatCache': state => state.chatCache.editableTabs,
            'chatRecycle': state => state.chatRecycle.editableTabsZ
        }),
        // 只展示选中的对话内容
        filterChatData() {
            return this.filterChatDataZ();
        },
        filterModelIcon() {
            return this.filterModelIconZ()
        },
    },
    components: {
        MarkdownCodeBlock,
    },
    methods: {
        addTag() {

        },
        jumpToTitle(data) {
            let uuid = data.split("44444");
            console.log(`#${uuid}`);
            return `#${uuid[1]}`;
        },
        getModelValue(model) {
            for (let index = 0; index < this.modelAll.length; index++) {
                    const element = this.modelAll[index];
                    if (element.value == model) {
                        this.getModelLabelRdo(element);
                    }
                }
        },
        switchFuncModel(model) {
            if (model == "qt") {
                this.isGenerateppt = false; 
            } else if (model == "xf") {
                this.isGenerateImg = false; 
            }
            this.getModelValue(model);
        },
        clearCurrData() {
            let action = sessionStorage.getItem('showNewPage');
            if (action == "2") {
                Message.error("当前还没有对话, 没法删除");
                return;
            }
            let key = sessionStorage.getItem('recordSelectSessKey');
            if (!key) {
                Message.error("删除失败");
                return
            }

            MessageBox.confirm('此操作将永久删除当前对话记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.removeChatParent(key);
                }).catch(() => {
                    Message.info("已取消删除")         
            });

            // this.removeChatParent(key);
        },
        wxCodeShow() {
            this.wxhideShow = !this.wxhideShow;
        },
        loginedCheck() {
            this.loginCheckTimer = setInterval(() => {
                this.loginCheckDots += '.';
                if (this.loginCheckDots.length > 3) {
                    this.loginCheckDots = ''; 
                }
            }, 500);
        },
        filterModelIconZ () {
            let label = this.modelAll.find(item => item.value == this.selectedModel);
            // console.log(label.icon);
            return label ? label.icon : "";
        },
        filterChatDataZ() {
            this.getSelectSessKey();
            return this.chatCache.filter(d => d.key == this.selectedSess); 
        },
        // 页面重载后保持选中的上下文
        contextStatus() {
            this.$nextTick(function () {
                this.contextIcon = sessionStorage.getItem('contextIcon');
                this.specifiedContexts = JSON.parse(sessionStorage.getItem('specifiedContexts'));
                let checked = sessionStorage.getItem("checked");
                this.checked = checked == "1" ? true : false;
                if (this.specifiedContexts && this.specifiedContexts.length > 0) {
                    let cd = this.chatCache;
                    for (let i = 0; i < cd.length; i++) {
                        if(cd[i].key == this.selectedSess) {
                            let child = cd[i].child;
                            for (let t = 0; t < child.length; t++) {
                                if (this.specifiedContexts.includes(child[t].uuid)) {
                                    child[t].checked = true;
                                    this.specifiedContextsTitle.push(child[t].title+"_"+child[t].uuid+"_"+child[t].model);
                                }
                            }
                        }
                    }
                } else {
                    this.specifiedContexts = [];
                    this.specifiedContextsTitle = [];
                }

            })
        },
        clearContext() {
            this.contextIcon = "";
            this.specifiedContexts = JSON.parse(sessionStorage.getItem('specifiedContexts'));
            let cd = this.chatCache;
            for (let i = 0; i < cd.length; i++) {
                let child = cd[i].child;
                for (let t = 0; t < child.length; t++) {
                    if (this.specifiedContexts.includes(child[t].uuid)) {
                        child[t].checked = false;
                    }
                }
            }
        
            this.specifiedContexts = [];
            this.specifiedContextsTitle = [];
            this.checked = false;
      
            sessionStorage.setItem('specifiedContexts', JSON.stringify(this.specifiedContexts));
            sessionStorage.setItem('checked', this.checked ? "1" : "2");
            Message.success("勾选的上下文已取消.");
        },
        submitSpecifiedContext() {
            this.specifiedContexts = JSON.parse(sessionStorage.getItem('specifiedContexts'));
            let data = [];
            let cd = this.chatCache;
            for (let i = 0; i < cd.length; i++) {
                if(cd[i].key == this.selectedSess) {
                    let child = cd[i].child;
                    for (let t = 0; t < child.length; t++) {
                        if (this.specifiedContexts.includes(child[t].uuid)) {
                            data.push(child[t]);
                        }
                    }
                }
            }

            if (data.length > 0) {
                data.forEach(item => {
                    if (item.model != this.selectedModel) {
                        Message.error("勾选的上下文无效, 只能勾选同一个模型回复的内容");
                        return [];
                    }
                });
            }

            return data;
        },
        getContextIcon(data) {
            let all = this.modelAll;
            let modelname = data.split("44444")
            for (let i = 0;i < all.length; i++) {
                if (all[i].value == modelname[2]) {
                    return all[i].icon;
                }
            }
            return "#icon-a-result4";
        },
        addContext(data) {
            if (this.specifiedContexts.includes(data.uuid)) {
                let indexUuid = this.specifiedContexts.indexOf(data.uuid);
                let indextitle = this.specifiedContextsTitle.indexOf(data.title+"44444"+data.uuid+"44444"+data.model);
                if (indexUuid !== -1) {
                    this.specifiedContexts.splice(indexUuid, 1);
                    this.specifiedContextsTitle.splice(indextitle, 1);
                }
            } else {
                this.specifiedContexts.push(data.uuid);
                this.specifiedContextsTitle.push(data.title+"44444"+data.uuid+"44444"+data.model);
            }

            if (this.specifiedContextsTitle.length > 0 ) {
                this.checked = true;
            } else {
                data.checked != data.checked;
                this.contextIcon = "";
                this.checked = false;
            }

            sessionStorage.setItem('contextIcon', this.contextIcon);
            sessionStorage.setItem('specifiedContexts', JSON.stringify(this.specifiedContexts));
            sessionStorage.setItem('checked', this.checked ? "1" : "2");
        },
        unCheck(uuid) {
            this.specifiedContexts = JSON.parse(sessionStorage.getItem('specifiedContexts'));
            let cd = this.chatCache;
            for (let i = 0; i < cd.length; i++) {
                let child = cd[i].child;
                for (let t = 0; t < child.length; t++) {
                    if (uuid == child[t].uuid) {
                        child[t].checked = false;
                        let indexUuid = this.specifiedContexts.indexOf(child[t].uuid);
                        this.specifiedContexts.splice(indexUuid, 1);
                    }
                }
            }

            sessionStorage.setItem('specifiedContexts', JSON.stringify(this.specifiedContexts));
        },
        removeContext(params) {
            let data = {data: params.split("44444")[0], uuid: parseInt(params.split("44444")[1])};
            if (this.specifiedContextsTitle.includes(params)) {
                let indextitle = this.specifiedContextsTitle.indexOf(params);
                if (indextitle !== -1) {
                    this.specifiedContextsTitle.splice(indextitle, 1);
                }
            }
            this.unCheck(data.uuid);
            if (this.specifiedContextsTitle.length > 0 ) {
                this.checked = true;
            } else {
                this.contextIcon = "";
                this.checked = false;
            }
            
            sessionStorage.setItem('checked', this.checked ? "1" : "2");
        },
        // 登录后加载聊天记录
        async afterLoginDataOnce() {
            let fld = sessionStorage.getItem('firstLoadData');
            let loginCheckStatus = sessionStorage.getItem('loginCheckStatus');
            if (!fld) {
                this.loginCheckStatus = true;
                this.finished = true;
                const resp = await this.getChatList(200);
                if (resp.data.status && resp.data.status == 666) {
                    let chatData = resp.data.data;
                    if (chatData && chatData.length >0 ) {
                        this.checkTime = 1;
                        this.clickLoadChatData();
                    }
                }  
            }
            this.loginCheckStatus = false;
            this.finished = false;
            sessionStorage.setItem('firstLoadData', 'firstdone');
            sessionStorage.setItem('loginCheckStatus', "false");

            if (loginCheckStatus == "false") {
                this.loginCheckStatus = false;
            }
            if (this.loginCheckTimer) {
                clearInterval(this.loginCheckTimer);
            }
            
        },
        aiNewSesshow() {
            let showNewPage = sessionStorage.getItem("showNewPage");
            if (showNewPage == 1) {
                this.showNewPage = false;
                this.show = true;
                this.showhi = true;
            } else {
                this.showNewPage = true;
                this.show = false;
                this.showhi = false;
            }
        },
        changeTitle() {
            let tc = this.all_questions.length;
            if (this.repeatChange + 1 >= tc) {
                this.repeatChange = 0;
                this.questions = this.all_questions[this.repeatChange];
            } else {
                this.repeatChange += 1;
                this.questions = this.all_questions[this.repeatChange];
            }
        },
        getSelectSessKey() {
            let key = sessionStorage.getItem('recordSelectSessKey');
            if (key) {
                this.selectedSess = key;
            }
        },
        recordSelectSessKey() {
            sessionStorage.setItem('recordSelectSessKey', this.selectedSess);
        },
        recordIsOpenNewSess(data) {
            let d = sessionStorage.getItem("isOpenNewSess");
            if (d != data) {
                sessionStorage.setItem("isOpenNewSess", data);
            }
        },
        dafaultIsOpenNewSess() {
            let d = sessionStorage.getItem("isOpenNewSess");
            switch (d) {
                case '1':
                    this.isOpenNewSess = true;
                    break;
                case '2':
                    this.isOpenNewSess = false;
                    break;
                default:
                    this.isOpenNewSess = true;
                    sessionStorage.setItem("isOpenNewSess", 1);
                    break;
            }       
        },
        createNewPage() {
            if (this.showNewPage) {
                Message.info("已是最新对话");
                return;
            }

            this.checked = false;
            this.showNewPage = true;
            this.show = false;
            this.showhi = false;
            this.isOpenNewSess = true;
            sessionStorage.setItem("isOpenNewSess", 1);
            sessionStorage.setItem("showNewPage", 2);
            // sessionStorage.setItem("checked", this.checked ? 1 : 2);
        },
        handleRemove(file, fileList) {
            console.log(this.claudeFile);
            this.isOpenSwitch = true;
            this.claudeFile = "";
        },
        clearUploadFile() {
            this.$refs.upload.clearFiles();
            this.claudeFile = "";
        },
        async downloadFile() {
            let name = this.fileData.file;
            let pre = name.split(".")[0];
            let suf = name.split(".")[1];
            let file = suf == "docx" ? pre + ".pdf" : pre + ".docx";
            let url = `http://43.153.55.148:8091/chat/download/?user=${sessionStorage.getItem('user')}&file=${file}`;
            window.open(url, "_self")
            this.fileList = [];
        },
        isOpenNoticeWord() {
            this.noticeVisible = this.noticeVisible ? false : true;
        },
        async chatDel(data) {
            const resp = await chatDel({uuid: JSON.stringify(data)}, this.callMethod);
            return resp
        },
        // 滚动加载数据开关
        saveScrollLoadDataStatus() {
            this.lazyLoadData(3); // 当打开开关，防止滚动条刚好在最底部无限刷新的bug
            if (this.isScrollLoadDataStatus) {
                this.setTimer = true;
                sessionStorage.setItem("rollingLoadSwitch", 1);
                Message.success('滚动加载数据已开启');
            } else {
                this.setTimer = false;
                sessionStorage.setItem("rollingLoadSwitch", 2);
                Message.warning('滚动加载数据已关闭');
            }
        },
        // 滚动加载数据开关状态
        checkisOpenScrollLoadData() {
            let rollingLoadSwitch = sessionStorage.getItem('rollingLoadSwitch');
            switch (rollingLoadSwitch) {
                case '1':
                    this.isScrollLoadDataStatus = true;
                    this.setTimer = true;
                    break
                case '2':
                    this.isScrollLoadDataStatus = false;
                    this.setTimer = false;
                    break
                default:
                    this.isScrollLoadDataStatus = false;
                    this.setTimer = false;
                    break;
            }
            // this.saveScrollLoadDataStatus();
        },
        
        // 查看附件内容
        async getFileText(file) {
            this.fileTextVisible = true;
            const resp = await getFileText({file: file, user: this.currentUser})
            if (resp.data.status == 666) {
                this.fileText = resp.data.data;
                this.fileTextLoad = false;
            } else {
                Message.error(resp.data.msg);
            }
        },
        getCurrentUser() {
            this.currentUser = sessionStorage.getItem('user');
        },
        chatTitleFormat() {
            this.$nextTick(function() {
                const nt = this.$refs.title;
                if (nt) {
                    if (nt.length != 0) {
                        for (let i = 0; i < nt.length; i++) {
                            if (nt[i].clientHeight > 90) {
                                // console.log('nt[i].clientHeight >>> ', nt[i].clientHeight);
                                nt[i].setAttribute("style", "white-space: break-spaces;text-align: justify");
                            } else {
                                nt[i].setAttribute("style", "white-space: break-spaces;text-align: unset");
                            }
                        }
                    }
                }
            }); 
        },
        // 加载数据的时候过滤掉重复的
        mergeUniqueByUUid(arr1, arr2) {
            const idMap = new Map();
            const mergedArray = [];
            for (const item of arr1) {
                if (!idMap.has(item.key)) {
                idMap.set(item.key, true);
                mergedArray.push(item);
                }
            }
            for (const item of arr2) {
                if (!idMap.has(item.key)) {
                idMap.set(item.key, true);
                mergedArray.push(item);
                }
            }

            return mergedArray;
        },
        
        // 拉取保存在服务端的历史对话-建议关闭，如果数据过多，滚动加载会比较慢
        async getChatList(ac) {
            let page = 1;
            if (ac==100) {
                page = this.selectPage;
            } else {
                page = this.pages.page;
            }

            const resp = await chatList({page: page , size: this.pages.size, search: this.searchBk})
            if (resp.data.status != 666) {
                Message.error('加载历史对话失败');
                return;
            };

            setTimeout(() => {
                this.chatTitleFormat();
            }, 500);

            return resp;
        },
        saveChatListTotal(loadCount) {
            if (this.isScrollLoadDataStatus) {
                sessionStorage.setItem('totals', this.pages.totals);
            } else {
                sessionStorage.setItem('totals', loadCount);
            }
        },
        saveLoadingOffset() {
            sessionStorage.setItem('page', this.pages.page);
            sessionStorage.setItem('loadCount', this.loadCount);
        },
        checkLoadingOffset() {
            let td = sessionStorage.getItem('loadCount');
            let page = sessionStorage.getItem('page');
            let totals = sessionStorage.getItem('totals');
            if (!td) {
                sessionStorage.setItem('loadCount', 0);
            } else {
                this.loadCount = td;
            }

            if (!page) {
                sessionStorage.setItem('page', 0);
            } else {
                this.pages.page = page;
            }

            if (!totals) {
                sessionStorage.setItem('totals', 0);
            } else {
                this.pages.totals = totals;
            }
        },
        scrollLoadChatDataStatus() {
            if (this.isScrollLoadDataStatus) {
                let td = sessionStorage.getItem('loadCount');
                let totals = sessionStorage.getItem('totals');
                if (td == totals) {
                    this.scrollLoading = false;
                } else {
                    this.scrollLoading = true;
                }
            }
            
        },
        mountTotalPages () {
            let tp = sessionStorage.getItem('totalPages');
            if (tp) {
                this.totalPages = JSON.parse(tp);
            }
        },
        defaultSess(data) {
            this.selectedSess = data.key;
            this.recordSelectSessKey();
        },
        // 重新加载历史记录
        async loadLatestTenData() {
            this.tenDataLoading = true;
            this.recordIsOpenNewSess(2);
            this.isScrollLoadDataStatus = true;
            this.isOpenNewSess = false;
            sessionStorage.setItem("showNewPage", 1);
            sessionStorage.setItem("rollingLoadSwitch", 1);
            this.showNewPage = false;
            this.show = true;
            this.showhi = true;
            this.setTimer = false;
            this.scrollLoading = true;
            this.loginCheckStatus = true;
            this.loginedCheck();
            this.pages.page = 1;
            this.loadCount = 0;
            const resp = await this.getChatList();
            let respData = resp.data.data;
            if (resp.data.totals == 0) {
                this.scrollLoading = false;
                this.showNewPage = true;
                this.isOpenNewSess = true;
                this.show = false;
                this.showhi = false;
                sessionStorage.setItem("showNewPage", 2);
                sessionStorage.setItem("rollingLoadSwitch", 2);
                this.recordIsOpenNewSess(1);
                Message.error("还没有任何对话记录.");
                this.tenDataLoading = false;
                return;
            }

            if (respData.length == 0) {
                Message.error("没有数据可加载.");
                this.tenDataLoading = false;
                this.scrollLoading = false;
                return;
            }

            this.defaultSess(respData[0]);

            store.commit("CLEAR_CHAT_CACHE");
            let historyData = this.mergeUniqueByUUid(this.chatCache, respData);
            for (let i = 0; i < historyData.length; i++) {
                store.commit("ADD_CHAT_CACHE", historyData[i]);
            }
            
            this.loadCount += respData.length;
            this.totalPages = resp.data.total_pages;
            sessionStorage.setItem('loadCount', this.loadCount);
            sessionStorage.setItem('page', this.pages.page);
            sessionStorage.setItem('totals', resp.data.totals);
            sessionStorage.setItem('totalPages', JSON.stringify(this.totalPages));
            sessionStorage.setItem('loginCheckStatus', "false");
            
            
            // 必须等数据加载完才能让handleScroll继续监听滚动条
            this.loginCheckStatus = false;
            clearInterval(this.loginCheckTimer);
            setTimeout(() => {
                this.lazyLoadData(2);
                this.setTimer = true;
            }, 1000);
            this.scrollLoading = false;
            this.tenDataLoading = false;
            
            this.chatTitleFormat();
        },
        // 点击可选择页面加载数据
        async clickLoadChatData() {
            this.recordIsOpenNewSess(2);
            this.isScrollLoadDataStatus = true;
            this.isOpenNewSess = false;
            sessionStorage.setItem("showNewPage", 1);
            sessionStorage.setItem("rollingLoadSwitch", 1);
            this.showNewPage = false;
            this.show = true;
            this.showhi = true;
            this.setTimer = false;
            this.scrollLoading = true;

            this.loadCount = parseInt(sessionStorage.getItem('loadCount'));
            let totals = parseInt(sessionStorage.getItem('totals'));
            this.pages.page = parseInt(sessionStorage.getItem('page'));
            this.totalPages = JSON.parse(sessionStorage.getItem('totalPages'));

            console.log('--------------点击加载数据----------------');
            this.pages.page = this.selectPage;
            sessionStorage.setItem('page', this.pages.page);
            const resp = await this.getChatList(100);
            if (resp.data.totals == 0) {
                this.scrollLoading = false;
                this.showNewPage = true;
                this.isOpenNewSess = true;
                this.show = false;
                this.showhi = false;
                sessionStorage.setItem("showNewPage", 2);
                sessionStorage.setItem("rollingLoadSwitch", 2);
                this.recordIsOpenNewSess(1);
                Message.warning("还没有对话记录, 开始提问吧.");
                return;
            }
            let respData = resp.data.data;
            if (respData.length == 0) {
                this.scrollLoading = false;
                Message.error("没有数据可加载.");
                return;
            }

            this.defaultSess(respData[0]);

            this.totalPages = resp.data.total_pages;
            sessionStorage.setItem('totalPages', JSON.stringify(this.totalPages));

            let old_data = this.chatCache.length;
            let historyData = this.mergeUniqueByUUid(this.chatCache, respData);
            store.commit("CLEAR_CHAT_CACHE");
            for (let i = 0; i < historyData.length; i++) {
                store.commit("ADD_CHAT_CACHE", historyData[i]);
            }

            if (old_data != historyData.length) {
                this.loadCount += respData.length;
                sessionStorage.setItem('loadCount', this.loadCount);
            }

            sessionStorage.setItem('totals', resp.data.totals);
            

            // 必须等数据加载完才能让handleScroll继续监听滚动条
            this.setTimer = true; 
            this.scrollLoading = false;
            this.chatTitleFormat();
        },
        // 监听滚动条是否已经滚动到底部
        handleScroll() {
            let content = document.getElementsByClassName('content')[0];
            if (content.scrollTop + content.clientHeight + 0.5 >= content.scrollHeight && this.setTimer) {
                this.scrollLoadChatData();
            }
        },
        // 滚动到底部就加载历史记录
        async scrollLoadChatData() {
            this.loadCount = parseInt(sessionStorage.getItem('loadCount'));
            let totals = parseInt(sessionStorage.getItem('totals'));
            this.pages.page = parseInt(sessionStorage.getItem('page'));
            this.isOpenNewSess = false;
            if (this.loadCount != totals) {
                this.recordIsOpenNewSess(2);
                console.log('--------------滚动加载数据----------------');
                this.loadCount = parseInt(sessionStorage.getItem('loadCount'));
                sessionStorage.setItem("showNewPage", 1);
                this.showNewPage = false;
                this.setTimer = false;
                this.scrollLoading = true;
                this.pages.page += 1;
                const resp = await this.getChatList(200);
                let respData = resp.data.data;
                if (respData.length == 0) {
                    this.scrollLoading = false;
                    Message.error("没有数据可加载.");
                    return;
                }
                this.defaultSess(respData[0]);
                this.totalPages = resp.data.total_pages;
                sessionStorage.setItem('totalPages', JSON.stringify(this.totalPages));
                let historyData = this.mergeUniqueByUUid(this.chatCache, respData);
                store.commit("CLEAR_CHAT_CACHE");
                for (let i = 0; i < historyData.length; i++) {
                    store.commit("ADD_CHAT_CACHE", historyData[i]);
                }
                this.loadCount += respData.length;
                sessionStorage.setItem('loadCount', this.loadCount);
                sessionStorage.setItem('page', this.pages.page);
                
                sessionStorage.setItem('totals', resp.data.totals);
            } else {
                this.setTimer = false;
                return;
            }

            setTimeout(() => {
                this.lazyLoadData(2);
                this.setTimer = true;
            }, 1000);
             // 必须等数据加载完才能让handleScroll继续监听滚动条
            this.scrollLoading = false;
            this.chatTitleFormat();
        },
        uploadUrl () {
            return `${baseUrl}/ai/chat/upload/`
        },
        successUpload(response, file, fileList) {
            this.claudeFile = file.name;
            this.isOpenSwitch = false;
            this.fileData.file = file.name;
        },
        checkUploadFileType(file) {
            this.isOpenSwitch = true;
            this.fileData.user = sessionStorage.getItem('user');

            var filePath = file.name;
            //获取最后一个.的位置
            var index= filePath.lastIndexOf(".");
            //获取后缀
            var ext = '.'+filePath.substr(index+1);
            if (!this.allowFile.includes(ext)) {
                Message.error(`只能上传${this.allowFile.join(',  ')}`);
                return false
            }
        },
        handleExceed(files, fileList) {
            Message.error('每次只能上传一个文件');
        },
        handlePreview(file) {
            this.getFileText(file.name);
            // this.downloadFile(file.name);
        },
        // 重新加载页面时显示已经切换的ai平台
        checkModel() {
            let model = window.sessionStorage.getItem('modelSelect');
            
            switch (model) {
                case '8':
                    this.selectedModel = 'qt-text';
                    break;
                case '9':
                    this.selectedModel = 'Gemini';
                    break;
                case '10':
                    this.selectedModel = 'qt-code';
                    break;  
                case '11':
                    this.selectedModel = 'qt-file';
                    break;
                case '12':
                    this.selectedModel = 'qt-vl';
                    break;     
                default:
                    this.selectedModel = 'Gemini';
                    break;
            }
            this.modelSelected = this.$options.filters.getModelLabel(this.selectedModel, this.modelAll);
        },
        getModelLabelRdo(val) {
            if (val.disabled) {
                Message.error('该模型不可用');
                return
            }
            this.selectedModel = val.value;
            this.modelSwitch();
        },
        // ai平台切换
        modelSwitch() {
            this.modelSelected = this.$options.filters.getModelLabel(this.selectedModel, this.modelAll);
            switch (this.selectedModel) {
                case 'qt-text':
                    window.sessionStorage.setItem('modelSelect', 8);
                    break
                case 'qt-code':
                    window.sessionStorage.setItem('modelSelect', 10);
                    break
                case 'qt-file':
                    window.sessionStorage.setItem('modelSelect', 11);
                    break
                case 'qt-vl':
                    window.sessionStorage.setItem('modelSelect', 12);
                    break
                case 'Gemini':
                    window.sessionStorage.setItem('modelSelect', 9);
                    break    
            }
        },
        // 检查chatCache的长度
        getContentLen() {
            if (this.chatCache.length > 0) {
                this.showhi = true;
            } else {
                this.showhi = false;
            }
        },
        // ai的链接
        chatGptUrl(model) {
            switch (model) {
                case 'qt-text':
                    window.open('https://qianwen.aliyun.com/');
                    break;  
                case 'qt-code':
                    window.open('https://qianwen.aliyun.com/');
                    break;
                case 'qt-file':
                    window.open('https://qianwen.aliyun.com/');
                    break;
                case 'qt-vl':
                    window.open('https://qianwen.aliyun.com/');
                    break;
                case 'pg':
                    window.open('https://qianwen.aliyun.com/');
                    break;          
                case 'Gemini':
                    window.open('https://ai.google.dev/');
                    break;
                case 'github':
                    window.open('https://github.com/Lxb921006/chat');
                    break;    

            }   
        },
        // 时间格式化
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
        logout() {
            // sessionStorage.removeItem('user');
            sessionStorage.clear();
            location.reload();
        },
        addB() {
            this.clearS = setInterval(() => {
                this.showCursor = !this.showCursor;
            }, 500);
        },
        // 所有聊天记录
        getAllChatData () {
            this.setTimer = true;
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            if (cacheData) {
                store.commit("CLEAR_CHAT_CACHE");
                this.show = true;
                for (let i = 0; i < cacheData.length; i++) {
                    store.commit("ADD_CHAT_CACHE", cacheData[i]);
                }
            }
        },
        getAllChatRecycleData () {
            if (sessionStorage.getItem("chatRecycle")) {
                store.commit("Z_CLEAR_CHAT_CACHE");
                this.show = true;
                let cacheData = JSON.parse(sessionStorage.getItem("chatRecycle"));
                for (let i = 0; i < cacheData.length; i++) {
                    store.commit("Z_ADD_CHAT_CACHE", cacheData[i]);
                }
            }
        },
        // 搜索聊天记录
        getSearchData() {
            if (this.showNewPage) {
                this.showNewPage = false;
                this.show = true;
                this.showhi = true;
                this.isOpenNewSess = false;
                sessionStorage.setItem("isOpenNewSess", 2);
                sessionStorage.setItem("showNewPage", 1);
            }

            this.setTimer = false;
            if (this.chatCache.length != 0) {
                store.commit("GET_CHAT_CACHE", this.input);
            } else {
                console.log("还没有聊天数据哟");
            }
            this.getContentLen();
        },
        // 隐藏显示侧边栏
        showAside() {
            const asideEl = document.querySelector('.aside');
            const asideSt = getComputedStyle(asideEl);
            if (asideSt.display == 'none') {
                document.querySelector(".aside").setAttribute("style", "display:block");
                document.querySelector(".main").setAttribute("style", "width: calc(100% - 200px)");
            } else {
                document.querySelector(".aside").setAttribute("style", "display:none");
                document.querySelector(".main").setAttribute("style", "width:100%;");
            }
        },
        // 是否隐藏左侧的菜单栏，默认不隐藏
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
        // 刷新页面时，保存最新一条数据
        loadLatestId() {
            let oid = sessionStorage.getItem('data_id');
            if (oid) {
                this.editableTabsValue = oid;
            }
        },
        // 等待ai回复时的loading
        waitingData() {
            this.loadTimer = setInterval(() => {
            this.dots += '.';
            if (this.dots.length > 3) {
                this.dots = ''; 
            }
            }, 500);
        },      
        saveLatestId(id) {
            sessionStorage.setItem('data_id', id);
        },
        // 手动停止ai响应
        stopChat(){
            this.stopCursor = false;
            this.socket.close(1000);
            this.socket = null;
            this.close();
        },
        handleKeyUp(event) {
            if (event.ctrlKey && event.keyCode === 13) {
                this.wsInit();
            }
        },
        // 建立websocket连接
        wsInit (ai_text) {
            if (ai_text) {
                if (this.finished) {
                    Message.error("请等待检测完成");
                    return
                }
                this.chatContent = ai_text;
            }

            // 如果滚动加载按钮打开就关闭，不然如果历史记录多，在ai回复的时候会一直加载历史数据
            if (this.isScrollLoadDataStatus) {
                this.setTimer = false;
                this.isScrollLoadDataStatus = false;
                sessionStorage.setItem('rollingLoadSwitch', 2);
            }

            if (!this.chatContent.replace(/[\r\n\s]+/g, '')) {
                this.chatContent = "";
                Message.error("请输入对话内容.");
                return;
            }

            if (this.input) {
                this.input = "";
                this.getAllChatData();
            }

            if (this.showNewPage) {
                this.show = true;
                this.showhi = true;
                this.showNewPage = false;
                sessionStorage.setItem("showNewPage", 1);
            }

            this.allowSend = true;

            setTimeout(() => {
                this.finished = true;
                let id = (100000000 - 1) * Math.random() + 1;
                let index = Math.random().toString(36).slice(-8);
                this.show = true;
                let modelIcon= "";
                let imageUrl = "";

                // newfile = this.claudeFile;
                
                switch (this.selectedModel) {   
                case 'qt-text':
                    modelIcon = this.qwIcon;
                    break;
                case 'qt-code':
                    modelIcon = this.qwIcon;
                    break;
                case 'qt-file':
                    modelIcon = this.qwIcon;
                    break; 
                case 'qt-vl':
                    modelIcon = this.qwIcon;
                    break;     
                case 'Gemini':
                    modelIcon = this.geminiIcon;
                    break;    
                default:
                    modelIcon = this.defaultIcon;
                    break;
                }
                
                if (this.claudeFile != "") {
                    imageUrl = `${baseUrl}/img/${this.claudeFile}`;
                }

                let key = uuidv4();
                let data = {
                    title: this.chatContent,
                    answer: "",
                    uuid: Math.floor(id),
                    name: this.id++,
                    index: index,
                    cursor: true,
                    date: this.getDate(),
                    timeShow: false,
                    cid: "",
                    pid: "",
                    imageUrl: imageUrl,
                    img: "",
                    icon: modelIcon,
                    content: "",
                    model: this.selectedModel,
                    file: "",
                    key: key,
                    isParent: 2,
                    checked: false,
                };
                
                let new_data = {};
                if (this.isOpenNewSess) {
                    new_data['child'] = [];
                    new_data['child'].push(data);
                    new_data['key'] = key;
                    new_data['title'] = this.chatContent;
                    new_data['model'] = this.selectedModel;
                    new_data['icon'] = modelIcon;
                    new_data['isParent'] = 1;
                    data['isParent'] = 1;
                    this.selectedSess = key;
                    this.recordSelectSessKey();
                    store.commit("ADD_CHAT_CACHE", new_data);
                } else {
                    new_data = this.addConPdSess(data);
                    store.commit("UPDATE_CHAT_CACHE", new_data);
                }

                this.waitingData();
                this.saveLatestId(data.uuid);
                this.editableTabsValue = data.uuid;
                this.isOpenNewSess = false;
                this.recordIsOpenNewSess(2);
                this.jumpFooter();
                this.chatTitleFormat();

                if (typeof(WebSocket) === "undefined") {
                    Message.error("您的浏览器不支持socket");
                    return;
                } 
                // 实例化socket
                switch (this.selectedModel) {  
                    case 'qt-text':
                        this.wsUrl = `${wssUsUrl}/web-wss/ws/chat/${sessionStorage.getItem("user")}/`
                        break
                    case  'qt-code':
                        this.wsUrl = `${wssUsUrl}/web-wss/ws/chat/${sessionStorage.getItem("user")}/`
                        break
                    case  'qt-file':
                        this.wsUrl = `${wssUsUrl}/web-wss/ws/chat/${sessionStorage.getItem("user")}/`
                        break 
                    case  'qt-vl':
                        this.wsUrl = `${wssUsUrl}/web-wss/ws/chat/${sessionStorage.getItem("user")}/`
                        break                                               
                    case 'Gemini':
                        this.wsUrl = `${wssUsUrl}/web-wss/ws/chat/${sessionStorage.getItem("user")}/`
                        break     
                }
                
                this.socket = new WebSocket(this.wsUrl);
                // 监听socket连接
                this.socket.onopen = this.open;
                // 监听socket错误信息
                this.socket.onerror = this.error;
                // 监听socket消息
                this.socket.onmessage = this.getMessage;
                // 监听socket关闭消息
                this.socket.onclose = this.close;
            }, 1)
        },
        addConPdSess(data) {
            let add_data = this.chatCache;
            for (let i = 0; i < add_data.length; i++) {
                if (add_data[i].key == this.selectedSess) {
                    let child = add_data[i].child;
                    data['key'] = this.selectedSess;
                    child.push(data);
                    return add_data[i];
                }
            }
        },
        open () {
            console.log('-----------websocket连接成功------------')
            this.stopCursor = true;
            this.stopResp = true;
            this.send()
        },
        error () {
            Message.error("websocket连接失败");
            this.clearUploadFile();
        },
        // 发送数据
        send () {
            switch (this.selectedModel) {
                case 'qt-text':
                    this.sendQw();
                    break
                case 'qt-code':
                    this.sendQtCode();
                    break
                case 'qt-file':
                    this.sendQtFile();
                    break
                case 'qt-vl':
                    this.sendQtVl();
                    break 
                case 'Gemini':
                    this.gemini();
                    break    
            }
        },
        // 接收数据
        getMessage (msg) {
            let jd = JSON.parse(msg.data);
            let div = document.querySelector(".content");
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].key == this.selectedSess) {
                    let child = this.chatCache[i].child;
                    for (let k = 0; k < child.length; k++) {
                        if (child[k].uuid == this.editableTabsValue) {
                            child[k].answer += jd.data;
                            child[k].cid = jd.cid;
                            child[k].pid = jd.pid;
                            child[k].content = jd.content;
                            // child[k].imageUrl = jd.img;
                            if (this.specifiedContexts.includes(child[k].uuid)) {
                                child[k] = true;
                            }
                        }
                    }
                }
                div.scrollTop = div.scrollHeight - div.clientHeight;
            }
            this.getContentLen();
        },
        // 关闭websocket连接后需要保存下ai的回复
        close () {
            console.log('-----------websocket已关闭------------')
            this.finished = false;
            this.allowSend = false;
            let answer = "";
            let div = document.querySelector(".content");
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].key == this.selectedSess) {
                    let child = this.chatCache[i].child;
                    for (let k = 0; k < child.length; k++) {
                        if (child[k].uuid == this.editableTabsValue) {
                            if (child[k].answer.length == 0) {
                                answer = '抱歉, 网络不佳, ai回复失败, 请重新提问';
                            } else {
                                answer = child[k].answer;
                            }
                            let data = {
                                key: this.selectedSess,
                                uuid: child[k].uuid, 
                                answer: answer, 
                                date: this.getDate(), 
                                timeShow: true,
                                content: child[k].content,
                                cid: child[k].cid,
                                pid: child[k].pid,
                                cursor: false,
                                file: "",
                                imageUrl: child[k].imageUrl,
                            }
                            if (this.specifiedContexts.includes(child[k].uuid)) {
                                child[k] = true;
                            }
                            
                            store.commit("SAVE_CHAT_CACHE_ANSWER", data);
                            break
                        }
                    }
                }
                div.scrollTop = div.scrollHeight - div.clientHeight;
            }
            this.stopResp = false;
            this.socket = null;
            this.pptCreate = false;
            this.isGenerateImg = false;
            this.isGenerateppt = false;
            this.claudeFile = "";
            this.clearUploadFile();
            this.jumpFooter();
            this.saveChatData();
            this.getChatList();
            this.chatTitleFormat();
            clearInterval(this.loadTimer);
        },
        // 保存对话记录
        async saveChatData() {
            let lastData = [];
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            for (let i = 0; i < cacheData.length; i++) {
                if (cacheData[i].key == this.selectedSess) {
                    let child = cacheData[i].child;
                    lastData = child[child.length - 1];
                    break;
                }
            }
            // lastData = cacheData[cacheData.length - 1];
            // lastData['answer'] = JSON.stringify(lastData['answer']);
            let data = {data: JSON.stringify(lastData)};
            const resp = await chatSave(data, this.callMethod);
            if (resp.data.status != 666) {
                Message.error('保存数据失败>>>', resp.data.msg);
            }
        },
        // ai接口
        // 通义千问-文本模型
        sendQw() {
            let sendData = {};
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            let gptData =  cacheData.find(cd => cd.key == this.selectedSess);

            if (gptData) {
                gptData = gptData.child;
                gptData = gptData.filter(item => item.model == this.selectedModel);
                if (!gptData) {
                    gptData = []
                }
            } else {
                gptData = [];
            }

            let context = [];
            if (gptData.length > 1) {
                //发送的信息关联上下文
                if (this.specifiedContexts.length > 0) {
                    context = this.submitSpecifiedContext();
                    if (context.length >= 6) {
                        context = context.slice(context.length - 5, context.length);
                    }
                } else {
                    context = gptData.slice(gptData.length - 6, gptData.length - 1);
                    if (context.length < 4) {
                        context = gptData.slice(0, gptData.length - 1);
                    }
                }
                sendData = {data: this.chatContent, context: context, model: this.selectedModel};
            } else {
                sendData = {data: this.chatContent, context: [], model: this.selectedModel};
            }
            
            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // 通义千问-代码模型
        sendQtCode() {
            let sendData = {};
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            let gptData =  cacheData.find(cd => cd.key == this.selectedSess);
            if (gptData) {
                gptData = gptData.child;
                gptData = gptData.filter(item => item.model == this.selectedModel);
                if (!gptData) {
                    gptData = []
                }
            } else {
                gptData = [];
            }

            let context = [];
            if (gptData.length > 1) {
                //发送的信息关联上下文
                if (this.specifiedContexts.length > 0) {
                    context = this.submitSpecifiedContext();
                    if (context.length >= 6) {
                        context = context.slice(context.length - 5, context.length);
                    }
                } else {
                    context = gptData.slice(gptData.length - 6, gptData.length - 1);
                    if (context.length < 4) {
                        context = gptData.slice(0, gptData.length - 1);
                    }
                }
                sendData = {data: this.chatContent, context: context, model: this.selectedModel};
            } else {
                sendData = {data: this.chatContent, context: [], model: this.selectedModel};
            }
            
            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // 通义千问-视觉模型
        sendQtVl() {
            let sendData = {};
            let context = [];
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            let gptData =  cacheData.find(cd => cd.key == this.selectedSess);
            if (gptData) {
                gptData = gptData.child;
                gptData = gptData.filter(item => item.model == this.selectedModel);
                if (!gptData) {
                    gptData = []
                }
            } else {
                gptData = [];
            }

            if (gptData.length > 1 ) {
                if (this.specifiedContexts.length > 0) {
                    context = this.submitSpecifiedContext();
                    if (context.length >= 6) {
                        context = context.slice(context.length - 5, context.length);
                    }
                } else {
                    context = gptData.slice(gptData.length - 6, gptData.length - 1);
                    if (context.length < 4) {
                        context = gptData.slice(0, gptData.length - 1);
                    }
                }

                let sendContextList = [];
                let sendContextData = {};
                for (let i = 0; i < context.length; i++) {
                    sendContextData = {
                        role: "user",
                        content: [
                            {image: context[i].imageUrl},
                            {text: context[i].title}
                        ]
                    };
                    sendContextList.push(sendContextData);
                    sendContextData = {
                        role: "assistant",
                        content: [
                            {text: context[i].answer}
                        ]
                    };
                    sendContextList.push(sendContextData);
                }
                sendContextData = {
                    role: "user", 
                    content: [
                        {text: this.chatContent}
                    ]
                };
                sendContextList.push(sendContextData);

                console.log(sendContextList);
                sendData = {
                    context: sendContextList,
                    model: this.selectedModel,
                };
            } else {
                sendData = {
                    context: [
                        {
                            role: "user", 
                            content: [
                                {image: `${baseUrl}/img/${this.claudeFile}`},
                                {text: this.chatContent}
                            ]
                        },
                    ],
                    model: this.selectedModel,
                };
            }

            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();

        },
        // 谷歌ai
        gemini() {
            let file = this.claudeFile;
            let sendData = {};
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            let gptData =  cacheData.find(cd => cd.key == this.selectedSess);

            if (gptData) {
                gptData = gptData.child;
                gptData = gptData.filter(item => item.model == this.selectedModel);
                if (!gptData) {
                    gptData = []
                }
            } else {
                gptData = [];
            }

            let text = this.chatContent;

            let context = null;
            if (gptData.length > 1) {
                //发送的信息关联上下文
                if (this.specifiedContexts.length > 0) {
                    context = this.submitSpecifiedContext();
                    if (context.length >= 6) {
                        context = context.slice(context.length - 5, context.length);
                    } 
                } else {
                    context = gptData.slice(gptData.length - 6, gptData.length - 1);
                    if (context.length < 4) {
                        context = gptData.slice(0, gptData.length - 1);
                    }
                }
                sendData = {data: text, content: context, model: this.selectedModel, file: file};
            } else {
                sendData = {data: text, content: '', model: this.selectedModel, file: file};
            }
            
            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // 保存上下文开关状态
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
        // 是否开启上下文，默认开启
        isOpenContext() {
            if (this.contextSwitch) {
                Message.success('对话已启用上下文关联');
                sessionStorage.setItem("oc", 1);
            } else {
                Message.warning('对话已禁用上下文关联');
                sessionStorage.setItem("oc", 2);
            }
        },
        // 检查预设状态
        checkSystemSet() {
            let roleResp = sessionStorage.getItem('roleResp');
            if (roleResp == 1) {
                this.roleResp = true;
            } else if (roleResp == 2) {
                this.roleResp = false;
            } else {
                this.roleResp = true; //预设默认开启
            }
        },
        // 预设开关-仅对chatGPT有效
        isRoleResp() {
            if (this.roleResp) {
                Message.success('已启用预设角色回复');
                sessionStorage.setItem("roleResp", 1);
            } else {
                Message.warning('已关闭预设角色回复');
                sessionStorage.setItem("roleResp", 2);
            }
        },
        // 滚动到最底部
        jumpFooter () {
            // if (!this.setTimer) {
            //     Message.error('不要着急, 先等数据加载完再点击滚动到最底部按钮');
            //     return;
            // }

            let tab = document.getElementsByClassName('tab')[0];
            let content = document.getElementsByClassName('content')[0];
            let scroll = content.scrollTop;
            let tabScroll = tab.scrollTop;

            const distance = 1500;

            // 使用setInterval平滑滚动content
            const timer2 = setInterval(() => {
                scroll += distance;

                // 滚动到底部时停止
                if(scroll >= content.scrollHeight){
                    clearInterval(timer2);
                }

                // 滚动指定距离
                content.scrollTop = scroll;
            }, 8)


            // 使用setInterval平滑滚动tab
            const timer3 = setInterval(() => {
                tabScroll += distance;

                // 滚动到底部时停止
                if(tabScroll >= tab.scrollHeight){
                    clearInterval(timer3);
                }

                // 滚动指定距离
                tab.scrollTop = tabScroll;
            }, 8)
        },
        lazyLoadData(h) {
            let content = document.getElementsByClassName('content')[0];
            let scroll = content.scrollTop;
            scroll -= h;
            content.scrollTop = scroll;
        },
        // 滚动到最顶部
        juamTop() {
            let content = document.getElementsByClassName('content')[0];
            let tab = document.getElementsByClassName('tab')[0];
            
            let scroll = content.scrollTop;
            let tabScroll = tab.scrollTop;

            const distance = 1500;

            // 使用setInterval平滑滚动content
            const timer2 = setInterval(() => {
                scroll -= distance;

                // 滚动到顶部时停止
                if(scroll <= 0){
                    clearInterval(timer2);
                }

                // 滚动指定距离
                content.scrollTop = scroll;
            }, 8)

            // 使用setInterval平滑滚动tab
            const timer3 = setInterval(() => {
                tabScroll -= distance;

                // 滚动到顶部时停止
                if(tabScroll <= 0){
                    clearInterval(timer3);
                }

                // 滚动指定距离
                tab.scrollTop = tabScroll;
            }, 8)
        },
        async chatUpdate(data) {
            const resp = await chatUpdate({uuid: data.uuid, isParent: data.isParent}, this.callMethod);
            if (resp == undefined || resp.data.status != 666) {
                Message.error(resp.data.msg);
                return;
            }
        },
        // 获取单挑对话记录的uuid
        getChildData(curSessKey,uuid) {
            let all_data = this.chatCache;
            let data = [];
            for (let i = 0; i < all_data.length; i++) {
                if (all_data[i].key == curSessKey) {
                    console.log(this.selectedSess);
                    if (all_data[i].child && all_data[i].child.length > 0) {
                        let child_data = all_data[i].child;
                        let get_tar_data = child_data.filter(item => item.uuid == uuid);
                        if (get_tar_data.length > 0) {
                            return get_tar_data;
                        }
                    }
                } 
            }
            return data;
        },
        removeChatParentConfirm(data) {
            MessageBox.confirm('此操作将永久删除当前组里的所有对话记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.removeChatParent(data);
                }).catch(() => {
                    Message.info("已取消删除")         
            });
        },
        // 删除当前所有父子对话记录
        async removeChatParent(key) {
            
            this.getAllChatData();
            
            let sess = key;
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].key == sess) {
                    let nextTab = this.chatCache[i + 1] || this.chatCache[i - 1];
                    if (nextTab) {
                        sess = nextTab.key;
                    }
                    break;
                }
            }
            
            let del_data = this.chatCache.find(item => item.key == key);
            let new_data = this.chatCache.filter(tab => tab.key != key);
            
            let child = del_data.child;

            this.selectedSess = sess;
            this.recordSelectSessKey();
            store.commit("REMOVE_CHAT_CACHE", new_data);

            let uuids = child.map(uuid => uuid.uuid);

            const resp = await this.chatDel(uuids);
            if (resp.data.status != 666) {
                Message.success('删除失败');
            }
            
            if (this.chatCache.length == 0) {
                this.createNewPage();
            }
        },
        removeChatChildConfirm(data) {
            MessageBox.confirm('此操作将永久删除当前对话记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.removeChat(data);
                }).catch(() => {
                    Message.info("已取消删除")         
            });
        },
        // 删除单条对话记录
        async removeChat(targetName) {
            this.getAllChatData();
            let del_data = [];
            let curSessKey = sessionStorage.getItem('recordSelectSessKey');
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].key == this.selectedSess) {
                    let child = this.chatCache[i].child;
                    if (child.length > 1) {
                        for (let c = 0; c < child.length; c++) {
                            if (child[c].uuid == targetName) {
                                if (child[c].isParent == 1) {
                                    let nextChild = "";
                                    let index = 0;
                                    if (child[c + 1]) {
                                        nextChild = child[c + 1];
                                        index = c + 1;
                                    } else if (child[c - 1]) {
                                        nextChild = child[c - 1];
                                        index = c - 1;
                                    }
                                    let data = {
                                        uuid: nextChild.uuid,
                                        isParent: 1,
                                    }
                                    this.chatCache[i].title = nextChild.title;
                                    this.chatCache[i].icon = nextChild.icon;
                                    this.chatCache[i].isParent = 1;
                                    child[index].isParent = 1;
                                    
                                    del_data = child.filter(tab => tab.uuid == targetName);
                                    child = child.filter(tab => tab.uuid != targetName);
                                    this.chatCache[i].child = child;
                                    
                                    store.commit("UPDATE_CHAT_CACHE", this.chatCache[i]);
                                    this.chatUpdate(data);
                                } else {
                                    del_data = child.filter(tab => tab.uuid == targetName);
                                    child = child.filter(tab => tab.uuid != targetName);
                                    this.chatCache[i].child = child;
                                    store.commit("UPDATE_CHAT_CACHE", this.chatCache[i]);
                                }
                            }
                        }
                    } else {
                        curSessKey = sessionStorage.getItem('recordSelectSessKey');
                        let sess = this.selectedSess;
                        for (let i = 0; i < this.chatCache.length; i++) {
                            if (this.chatCache[i].key == sess) {
                                let nextTab = this.chatCache[i + 1] || this.chatCache[i - 1];
                                if (nextTab) {
                                    sess = nextTab.key;
                                }
                                break;
                            }
                        }
                        
                        del_data = this.getChildData(curSessKey, targetName)
                        let new_data = this.chatCache.filter(tab => tab.key != this.selectedSess);
                        this.selectedSess = sess;
                        this.recordSelectSessKey();
                        store.commit("REMOVE_CHAT_CACHE", new_data);
                    }
                    break;
                }
            }

            if (this.chatCache.length == 0) {
                this.createNewPage();
            }
            
            
            let uuids = del_data.map(uuid => uuid.uuid);
            console.log("del uuids >>> ", uuids);
            const resp = await this.chatDel(uuids);
            if (resp.data.status != 666) {
                Message.success('删除失败');
            }
        },
        // 锚点
        jump(data) {
            if (!this.show) {
                this.showNewPage = false;
                this.show = true;
                this.showhi = true;
                sessionStorage.setItem("showNewPage", 1);
            }
            let checked = sessionStorage.getItem("checked");
            this.checked = checked == "1" ? true : false;
            this.selectedSess = data.key;
            this.isOpenNewSess = false;
            this.recordSelectSessKey();
            this.recordIsOpenNewSess(2);
            
            setTimeout(() => {
                this.chatTitleFormat();
                
            }, 50)
        },
        returnChat() {
            let totals = sessionStorage.getItem("totals");
            if (!totals || parseInt(totals) <= 0) {
                Message.success('还有提问记录,没法返回哟,先试试提问吧');
                return
            } 

            if (!this.show) {
                this.showNewPage = false;
                this.show = true;
                this.showhi = true;
                sessionStorage.setItem("showNewPage", 1);
            }
            let checked = sessionStorage.getItem("checked");

            this.checked = checked == "1" ? true : false;
            let selectedSess = sessionStorage.getItem("recordSelectSessKey");
            this.selectedSess = selectedSess;
            this.isOpenNewSess = false;
            this.recordSelectSessKey();
            this.recordIsOpenNewSess(2);
            
            setTimeout(() => {
                this.chatTitleFormat();
            }, 50)
        },
        refresh() {
            this.close();
            clearInterval(this.loadTimer);
        },
        // 拖动
        dialogDrag(event) {
            if (!this.dragDialog.dragging) {
                return;
            }
            // 计算拖拽距离
            const left = event.clientX - this.dragDialog.startX + this.dragDialog.left;
            const top = event.clientY - this.dragDialog.startY + this.dragDialog.top;
            // 更新对话框位置
            this.$refs.dialog.$el.style.left = `${left}px`;
            this.$refs.dialog.$el.style.top = `${top}px`;
        },
        dialogMouseDown(event) {
            // 开始拖拽
            this.dragDialog.dragging = true;
            // 记录起始位置
            this.dragDialog.startX = event.clientX;
            this.dragDialog.startY = event.clientY;
            // 记录当前位置
            const { left, top } = this.$refs.dialog.$el.getBoundingClientRect();
            this.dragDialog.left = left;
            this.dragDialog.top = top;
            // 添加事件监听器
            document.addEventListener('mousemove', this.dialogDrag);
            document.addEventListener('mouseup', this.dialogMouseUp);
        },
        dialogMouseUp() {
            // 结束拖拽
            this.dragDialog.dragging = false;
            // 移除事件监听器
            document.removeEventListener('mousemove', this.dialogDrag);
            document.removeEventListener('mouseup', this.dialogMouseUp);
        },
        onDragEnd(event) {  
            // 获取对话框的当前位置和鼠标位置  
            
            const dialogRect = this.$refs.dialog.getBoundingClientRect();  
            const mouseX = event.clientX;  
            const mouseY = event.clientY;  
                
            // 计算对话框应该移动到的位置  
            const newLeft = mouseX - (dialogRect.width - this.$refs.dialog.offsetWidth) / 2;  
            const newTop = mouseY - (dialogRect.height - this.$refs.dialog.offsetHeight) / 2;  
                
            // 移动对话框到计算得到的位置  
            this.$refs.dialog.style.left = `${newLeft}px`;  
            this.$refs.dialog.style.top = `${newTop}px`;  
        },
        callMethod() {},
    },
    filters: {
        getModelLabel(data, allModel) {
            let labelName = allModel.find(item => item.value == data);
            return labelName ? labelName.label : data;
        },
        getModelLabel2(data, allModel) {
            if (allModel && Array.isArray(allModel)) {
                let labelName = allModel.find(item => item.value == data);
                return labelName ? labelName.label : "";
            }

            return data;
        },
        getContextTitle(data) {
            let title = data.split("44444");
            return title[0];
        },
        getContextIcon(data, icon) {
            let icon_name = icon.split("44444");
            return icon_name[2];
        },
        getContextUUID(data) {
            let title = data.split("44444");
            return title[1];
            
        },
    },
    mounted() {
        if (window.innerWidth < 600) {
            this.ash = false;
        };
        this.contextStatus();
        this.checkContextStatus();
        this.getAllChatData();
        this.checkSystemSet();
        this.getContentLen();
        this.checkModel();
        this.checkLoadingOffset();
        this.chatTitleFormat();
        this.getCurrentUser();
        this.checkisOpenScrollLoadData();
        this.mountTotalPages();
        this.aiNewSesshow();
        this.dafaultIsOpenNewSess();
        this.getSelectSessKey();
        // 登录后加载聊天记录
        this.loginedCheck();
        this.afterLoginDataOnce();
    },
}
</script>

<style lang="scss" scoped>
    @import '../../../public/style/chat-style.css';
</style>