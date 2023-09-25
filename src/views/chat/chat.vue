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
                    <el-menu-item :index=data.index v-for="data in chatCache" :key="data.index" @click="jump(data.uuid)" v-show="true">
                        <i class="el-icon-delete delete" @click="removeChat(data.uuid)"></i>
                        <span slot="title" class="cache-title">
                            <span slot="title" class="cache-title title-model-icon" v-if="data.model == 'chatGPT'">
                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data.icon"></use></svg>
                            </span>
                            <span slot="title" class="cache-title title-model-icon" v-if="data.model == 'GPT-4'">
                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data.icon"></use></svg>
                            </span>
                            <span slot="title" class="cache-title title-model-icon" v-if="data.model == 'chatGPT3.5'">
                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data.icon"></use></svg>
                            </span>
                            <span slot="title" class="cache-title title-model-icon" v-else-if="data.model == 'claude-2'">
                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data.icon"></use></svg>
                            </span>
                            <span slot="title" class="cache-title title-model-icon" v-else-if="data.model == 'xf'">
                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data.icon"></use></svg>
                            </span>
                            <span slot="title" class="cache-title title-model-icon" v-else-if="data.model == 'ai-assistant'">
                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data.icon"></use></svg>
                            </span>
                            <span slot="title" class="cache-title title-model-icon" v-else-if="data.model == 'bd'">
                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data.icon"></use></svg>
                            </span>
                            <span slot="title" class="cache-title title-model-icon" v-else-if="data.model == 'qw'">
                                <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data.icon"></use></svg>
                            </span>
                            {{ data.title }}
                        </span>
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
            <div class="content" ref="wrapper" @scroll="handleScroll" v-loading="dataLoading">
                <transition name="el-zoom-in-top">
                    <div class="reach" v-show="showhi">
                        <svg class="icon-qa-3" aria-hidden="true"><use xlink:href="#icon-tishi1"></use></svg> <span>顶部</span>
                    </div>
                </transition>
                <transition-group name="el-zoom-in-center">
                    <template v-if="show">
                        <div v-for="(data1, index1) in chatCache" :key="index1+1" class="z-content">
                            <!-- Ai模型 -->
                            <transition name="el-zoom-in-top">
                                <div class="platform">
                                    <p>
                                        <svg  class="icon-qa-3 model-icon" aria-hidden="true"><use  :xlink:href="data1.icon"></use></svg> <span @click="chatGptUrl(data1.model)" v-if="data1.title" class="z-model-name">{{ data1.model | getModelLabel(modelAll) }}</span>
                                    </p>
                                </div>
                            </transition>
                            <!-- 标题 -->
                            <h2 class="answer-title" :id=data1.uuid>
                                <p class="question" ref="title">
                                    <svg class="icon-qa" aria-hidden="true">
                                        <use xlink:href="#icon-changjianwenti"></use>
                                    </svg>
                                    {{ data1.title }}  <el-link :underline="false" v-if="data1.file" @click="getFileText(data1.file)">{{ data1.file }}</el-link>
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
                                        <i class="el-icon-time time-2">{{ data1.date }}</i>
                                        <div class="whole-answer">
                                            <el-dropdown>
                                                <span class="el-dropdown-link">
                                                    <svg class="icon" aria-hidden="true">
                                                        <use xlink:href="#icon-shenglvehao"></use>
                                                    </svg>
                                                </span>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item icon="el-icon-document-copy" @click.native="copyAll(data1.answer)">复制整个对话</el-dropdown-item>
                                                    <el-dropdown-item icon="el-icon-delete" @click.native="removeChat(data1.uuid)">删改该对话</el-dropdown-item>
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
                        <svg class="icon-qa-3" aria-hidden="true"><use xlink:href="#icon-tishi1"></use></svg> <span v-loading="scrollLoading" v-if="scrollLoading"></span>
                        <span v-else>底部</span>
                    </div>
                </transition>
            </div>
            <!-- 是否停止ai响应 -->
            <div class="stop">
                <transition name="el-zoom-in-top">
                    <div class="jump-top">
                        <el-button v-show="showhi" circle mini @click="juamTop()"><span class="iconfont icon-cs-dw-xs-1"></span></el-button>
                    </div>
                </transition>
                <!-- 是否停止ai响应 -->
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
            <!-- 所有设置 -->
            <div class="footer list-group"  id="sortable">
                <!-- 设置 -->
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
                        </el-row>
                        <el-row :gutter="10" class="set-item set-item-1">
                            <el-col :span="1" class="z-col-3 col-font">是否开启预设模式: </el-col>
                            <el-col :span="1" class="z-col-4">
                                <el-tooltip content="只对chatGPT有效" placement="top">
                                    <el-switch
                                        @change="isOpenDay()"
                                        v-model="dnSwitch"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949">
                                    </el-switch>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" class="set-item set-item-1">
                            <el-col :span="1" class="z-col-3 col-font">是否开启滚动加载: </el-col>
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
                        <el-row :gutter="10" class="set-item set-item-1">
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
                        <el-table :data="chatRecycle" stripe height="166">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column width="150" property="title" show-overflow-tooltip label="title"></el-table-column>
                            <el-table-column width="150" property="answer" show-overflow-tooltip label="答案">
                                <template slot-scope="scope">
                                    <el-link :underline="false">{{ scope.row.answer }}</el-link>
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
                                    <el-button size="mini" @click="restoreChat(scope.row.uuid)" type="primary">更新</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button slot="reference">
                            <svg class="icon z-rb-icon" aria-hidden="true">
                                <use xlink:href="#icon-yonghuguanli"></use>
                            </svg>
                        </el-button>
                    </el-popover>
                </div>
                <!-- 历史记录 -->
                <div class="user rb">
                    <el-popconfirm
                        title="是否加载历史记录?(只加载最新的10条, 如需加载更多请把滚动加载打开)"
                        @confirm="getChatList(100)"
                        >
                        <el-button slot="reference">
                            <svg class="icon z-rb-icon" aria-hidden="true">
                                <use xlink:href="#icon-xiaoxilishi"></use>
                            </svg>
                        </el-button>
                    </el-popconfirm>
                </div>
                <!-- 插件 -->
                <div class="user rb">
                    <el-popover
                        placement="right"
                        width="400"
                        trigger="click">
                        <div class="z-rb-title">
                            <h2>插件</h2>
                        </div>
                        <el-row :gutter="20">
                            <el-col :span=10>
                                <el-checkbox v-model="pptCreate" size="medium">
                                    <svg class="icon z-rb-icon z-ppt-icon" aria-hidden="true">
                                        <use xlink:href="#icon-ppt"></use>
                                    </svg>ppt生成
                                </el-checkbox>
                            </el-col>
                        </el-row>
                        <el-button slot="reference">
                            <svg class="icon z-rb-icon" aria-hidden="true">
                                <use xlink:href="#icon-chajian"></use>
                            </svg>
                        </el-button>
                    </el-popover>
                </div>
                <!-- 提示词 -->
                <div class="user rb">
                    <el-button @click="isOpenNoticeWord()">
                        <svg class="icon z-rb-icon" aria-hidden="true">
                            <use xlink:href="#icon-bangzhu"></use>
                        </svg>
                    </el-button>
                </div>
                <!-- 工具-pdf-word文档互转 -->
                <div class="user rb">
                    <el-popover
                        placement="right"
                        width="400"
                        trigger="click">
                        <div class="z-rb-title">
                            <h2>pdf-word文档互转</h2>
                        </div>
                        <el-upload
                            class="upload-demo-1"
                            drag
                            :action=uploadUrl()
                            :on-preview="handlePreview"
                            :before-upload="checkUploadFileType"
                            :on-success="successUpload"
                            :limit="1"
                            :on-remove="handleRemove"
                            :on-exceed="handleExceed"
                            multiple
                            :data="fileData"
                            :file-list="fileList"
                            >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将pdf或者word文档拖到此处, 或<em>点击上传</em></div>
                        </el-upload>
                        <el-row :gutter="10" class="z-pdf-word-row">
                            <el-col :span="8">
                                <el-button type="success " size="mini" :disabled="isOpenSwitch" @click="downloadFile()">下载</el-button>
                            </el-col>
                            <!-- <el-col :span="1">
                                <el-button type="primary" size="mini" :disabled="isOpenSwitch" @click="downloadFile()">word文档转pdf</el-button>
                            </el-col> -->
                        </el-row>
                        <el-button slot="reference">
                            <svg class="icon z-rb-icon" aria-hidden="true">
                                <use xlink:href="#icon-gongju"></use>
                            </svg>
                        </el-button>
                    </el-popover> 
                </div>
                <!-- 对话输入 -->
                <div class="send-question">
                    <div class="z-model-show">
                        <span>模型: 【<span class="z-model-s">{{ selectedModel | getModelLabel2(modelAll) }}</span>】; </span>
                        <span v-if="contextSwitch">上下文: 【<span class="z-model-s">开启</span>】; </span>
                        <span v-else>上下文: 【<span class="z-model-s-c">关闭</span>】; </span>
                        <span v-if="dnSwitch">预设角色: 【<span class="z-model-s">开启</span>】; </span>
                        <span v-else>预设角色: 【<span class="z-model-s-c">关闭</span>】; </span>
                        <span v-if="isScrollLoadDataStatus">滚动加载: 【<span class="z-model-s">开启</span>】; </span>
                        <span v-else>滚动加载: 【<span class="z-model-s-c">关闭</span>】; </span>
                        <span v-if="pptCreate">ppt生成: 【<span class="z-model-s">开启</span>】; </span>
                        <span v-else>ppt生成: 【<span class="z-model-s-c">关闭</span>】; </span>
                    </div>
                    <div class="send-input">
                         <el-input
                            type="textarea"
                            autocomplete="on"
                            show-word-limit
                            :autosize="{ minRows: 2, maxRows: 3 }"
                            placeholder="请输入对话内容, 先按住ctrl再按enter键提交"
                            v-model="chatContent"
                            @keyup.native="handleKeyUp"
                            :disabled="finished"
                            resize="none"
                            >
                        </el-input>
                        <el-button slot="reference" @click="wsInit()">
                            <svg class="icon z-send-button" aria-hidden="true">
                                <use xlink:href="#icon-send-01"></use>
                            </svg>
                        </el-button>
                        <!-- 目前只支持claude上传附件 -->
                        <el-upload
                            :style="{ visibility: selectedModel=='claude-2' ? 'visible' : 'hidden' }"
                            class="upload-demo"
                            :action=uploadUrl()
                            :on-preview="handlePreview"
                            :before-upload="checkUploadFileType"
                            :on-success="successUpload"
                            multiple
                            :limit="1"
                            :data="fileData"
                            :file-list="fileList"
                            :on-exceed="handleExceed"
                            >
                            <el-tooltip class="item" effect="dark" content="只能上传.txt, .pdf, .docx文件; 目前只支持claude上传附件" placement="top-start">
                                <el-button size="small" type="primary">
                                    <svg class="icon z-send-button" aria-hidden="true">
                                        <use xlink:href="#icon-fujian"></use>
                                    </svg>
                                </el-button>
                            </el-tooltip>
                        </el-upload>
                    
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
import { mapState } from 'vuex'
import store from '../../store/index'
import { wssSinUrl, wssUsUrl, wssSinApiUrl } from "../../utils/wssUrl";
import 'highlight.js/styles/atom-one-dark-reasonable.css'  //这里有多个样式，自己可以根据需要切换
import MarkdownCodeBlock from './markdownBlock';
import baseUrl from "../../utils/baseUrl";
import { chatList, chatSave, getFileText, chatDel, downloadFile } from '../../api';


// 所有对话数据都存储在浏览器本地，如果浏览器没有做相应的保存设置将无法保存对话记录(如需保存对话可在谷歌浏览器里边找到，设置->启动时->继续浏览上次打开的网页，即可)
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
            isOpenSwitch: true,
            dataLoading: false,
            pptCreate: '',
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
            dnSwitch: false,
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
            gpt4: "#icon-a-Chatgpt4",
            assistantIcon: "#icon-a-Chatgpt35",
            xfIcon: "#icon-xunfeilogo",
            wxIcon: "#icon-baidu",
            qwIcon: "#icon-a-result4",
            scrollLoading: false,
            setTimer: true,
            isScrollLoadDataStatus: true,
            fileData: {},
            modelAll: [
                {
                    value: 'claude-2',
                    label: 'claude',
                    disabled: false,
                },
                {
                    value: 'chatGPT3.5',
                    label: 'GPT-3.5-turbo',
                    disabled: false,
                },
                {
                    value: 'GPT-4',
                    label: 'GPT-4',
                    disabled: false,
                },
                // {
                //     value: 'chatGPT',
                //     label: 'GPT-3',
                //     disabled: false,
                // },
                {
                    value: 'xf',
                    label: '讯飞星火',
                    disabled: false,
                },
                {
                    value: 'bd',
                    label: '文心一言',
                    disabled: false,
                },
                {
                    value: 'qw',
                    label: '通义千问',
                    disabled: false,
                },
            ],
            allowFile: ['.txt', '.pdf', '.docx'],
            loadCount: 0,
            historyDataLoading: false,
            pages: {
                page: 1,
                size: 10,
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
    },
    components: {
        MarkdownCodeBlock,
        // MarkdownTitle,
    },
    
    methods: {
        handleRemove(file, fileList) {
            this.isOpenSwitch = true;
        },
        async downloadFile() {
            let name = this.fileData.file;
            let pre = name.split(".")[0];
            let suf = name.split(".")[1];
            let file = suf == "docx" ? pre + ".pdf" : pre + ".docx";
            // const resp = await downloadFile({file: file, user: this.currentUser})
            // if (resp.data.status == 444) {
            //     Message.error(resp.data.msg);
            // }
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
            this.lazyLoadData(); // 当打开开关，防止滚动条刚好在最底部无限刷新的bug
            if (this.isScrollLoadDataStatus) {
                sessionStorage.setItem("sds", 1);
                this.loadCount = parseInt(sessionStorage.getItem('loadCount'));
                this.pages.page = parseInt(sessionStorage.getItem('page'));
                let totals = parseInt(sessionStorage.getItem('totals'));
                if (this.pages.page && this.pages.page > 1) {
                    if (this.loadCount == totals) {
                        sessionStorage.setItem('totals', totals-=1);
                    }
                    this.scrollLoadChatData();
                } else {
                    this.getChatList(100);
                }
                
                Message.success('滚动加载数据已开启');
            } else {
                sessionStorage.setItem("sds", 2);
                let loadCount = sessionStorage.getItem('loadCount');
                let totals = sessionStorage.getItem('totals');
                if (loadCount != totals) {
                    sessionStorage.setItem('totals', loadCount);
                }
                Message.warning('滚动加载数据已关闭');
            }
        },
        // 滚动加载数据开关状态
        checkisOpenScrollLoadData() {
            let sds = window.sessionStorage.getItem('sds');
            switch (sds) {
                case '1':
                    this.isScrollLoadDataStatus = true;
                    break
                case '2':
                    this.isScrollLoadDataStatus = false;
                    break
                default:
                    this.isScrollLoadDataStatus = false;
                    break;
            }
            // this.saveScrollLoadDataStatus();
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
                            if (nt[i].clientHeight  > 69) {
                                nt[i].setAttribute("style", "white-space: break-spaces;text-align: justify");
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
                if (!idMap.has(item.uuid)) {
                idMap.set(item.uuid, true);
                mergedArray.push(item);
                }
            }
            for (const item of arr2) {
                if (!idMap.has(item.uuid)) {
                idMap.set(item.uuid, true);
                mergedArray.push(item);
                }
            }

            return mergedArray;
        },
        // 监听滚动条是否已经滚动到底部
        handleScroll() {
            let content = document.getElementsByClassName('content')[0];
            if (content.scrollTop + content.clientHeight + 0.5 >= content.scrollHeight && this.setTimer) {
                this.scrollLoadChatData();
            }
        },
        // 拉取保存在服务端的历史对话-建议关闭，如果数据过多，滚动加载会比较慢
        async getChatList(ac) {
            if (ac==100) {
                this.pages.page = 1;
            };

            const resp = await chatList({page: this.pages.page, size: this.pages.size})
            if (resp.data.status != 666) {
                Message.error('加载历史对话失败')
                return
            };

            if (ac == 100) {
                this.dataLoading = true;
                let respData = resp.data.data;
                if (resp.data.totals == 0) {
                    Message.warning('没有历史数据可加载')
                    return
                }
                this.pages.totals = resp.data.totals;
                this.loadCount = respData.length;
                this.saveChatListTotal(this.loadCount);
                this.saveLoadingOffset();
                store.commit("CLEAR_CHAT_CACHE");
                let historyData = this.mergeUniqueByUUid(this.chatCache, respData);
                this.show = true;
                this.showhi = true;
                for (let i = 0; i < historyData.length; i++) {
                    store.commit("ADD_CHAT_CACHE", historyData[i]);
                }
                this.dataLoading = false;
                // Message.success('历史对话加载完成');
            };

            setTimeout(() => {
                this.chatTitleFormat();
            }, 2000);

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
            let td = sessionStorage.getItem('loadCount');
            let totals = sessionStorage.getItem('totals');
            if (td == totals) {
                this.scrollLoading = false;
            } else {
                this.scrollLoading = true;
            }
        },
        // 滚动到底部就加载数据
        async scrollLoadChatData() {
            let totals = parseInt(sessionStorage.getItem('totals'));
            this.loadCount = parseInt(sessionStorage.getItem('loadCount'));
            this.pages.page = parseInt(sessionStorage.getItem('page'));
            if (this.loadCount != totals) {
                console.log('--------------正在加载数据----------------');
                this.setTimer = false;
                this.scrollLoading = true;
                this.pages.page += 1;
                const resp = await this.getChatList(200);
                let respData = resp.data.data;
                let historyData = this.mergeUniqueByUUid(this.chatCache, respData);
                store.commit("CLEAR_CHAT_CACHE");
                for (let i = 0; i < historyData.length; i++) {
                    store.commit("ADD_CHAT_CACHE", historyData[i]);
                }
                this.loadCount += respData.length;
                sessionStorage.setItem('loadCount', this.loadCount);
                sessionStorage.setItem('page', this.pages.page);
                
                sessionStorage.setItem('totals', resp.data.totals);
            }
            this.chatTitleFormat();
            this.setTimer = true; // 必须等数据加载完才能让handleScroll继续监听滚动条
            this.scrollLoading = false;
        },
        uploadUrl () {
            return `${baseUrl}/claude/upload/`
        },
        successUpload(response, file, fileList) {
            if (this.pptCreate) {
                this.claudeFile = file.name;
            }
            this.isOpenSwitch = false;
            this.fileData.file = file.name;
        },
        checkUploadFileType(file) {
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
        // 清空回收站
        async clearRbData() {
            let uuids = this.chatRecycle.map(uuid => uuid.uuid);
            const resp = await this.chatDel(uuids);
            if (resp.data.status == 666) {
                store.commit("Z_REMOVE_ALL_CHAT_CACHE", "clear");
            }
            
        },
        // 回收站恢复数据
        restoreChat(data) {
            let chatRecycleData = JSON.parse(sessionStorage.getItem("chatRecycle"));
            for (let i = 0; i < chatRecycleData.length; i++) {
                if (chatRecycleData[i].uuid == data.uuid) {
                    console.log(chatRecycleData[i]);
                    store.commit("ADD_CHAT_CACHE", chatRecycleData[i]);
                    this.removeRbData(data);
                    break;
                }
            }
            this.getContentLen();
            Message.success(`【${data.title}】已从回收站恢复`);
        },
        // 删除回收站的数据
        async removeRbData(data) {
            this.getAllRbData();
            let tabs = this.chatRecycle;
            let rbChat = tabs.filter(tab => tab.uuid != data.uuid);
            let fd = [data.uuid]
            const resp = await this.chatDel(fd);
            if (resp.data.status == 666) {
                store.commit("Z_REMOVE_CHAT_CACHE", rbChat);

                this.getContentLen();
            }
            // store.commit("Z_REMOVE_CHAT_CACHE", rbChat);
            // this.getContentLen();
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
        // 重新加载页面时显示已经切换的ai平台
        checkModel() {
            let model = window.sessionStorage.getItem('modelSelect');
            
            switch (model) {
                case '1':
                    this.selectedModel = 'claude-2';
                    break
                case '2':
                    this.selectedModel = 'chatGPT';
                    break;
                case '3':
                    this.selectedModel = 'ai-assistant';
                    break;
                case '4':
                    this.selectedModel = 'xf';
                    break;
                case '5':
                    this.selectedModel = 'bd';
                    break;
                case '6':
                    this.selectedModel = 'chatGPT3.5';
                    break;
                case '7':
                    this.selectedModel = 'GPT-4';
                    break;
                case '8':
                    this.selectedModel = 'qw';
                    break;
                default:
                    this.selectedModel = 'GPT-4';
                    break;
            }
        },
        // ai平台切换
        modelSwitch() {
            switch (this.selectedModel) {
                case 'claude-2':
                    window.sessionStorage.setItem('modelSelect', 1);
                    break
                case 'chatGPT':
                    window.sessionStorage.setItem('modelSelect', 2);
                    break
                case 'ai-assistant':
                    window.sessionStorage.setItem('modelSelect', 3);
                    break
                case 'xf':
                    window.sessionStorage.setItem('modelSelect', 4);
                    break
                case 'bd':
                    window.sessionStorage.setItem('modelSelect', 5);
                    break
                case 'chatGPT3.5':
                    window.sessionStorage.setItem('modelSelect', 6);
                    break  
                case 'GPT-4':
                    window.sessionStorage.setItem('modelSelect', 7);
                    break
                case 'qw':
                    window.sessionStorage.setItem('modelSelect', 8);
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
                case 'claude-2':
                    window.open('https://claude.ai/');
                    break;
                case 'chatGPT':
                    window.open('https://openai.com/');
                    break;
                case 'bd':
                    window.open('https://yiyan.baidu.com/');
                    break;    
                case 'ai-assistant':
                    window.open('https://openai.com/');
                    break;
                case 'chatGPT3.5':
                    window.open('https://openai.com/');
                    break;
                case 'GPT-4':
                    window.open('https://openai.com/');
                    break;
                case 'xf':
                    window.open('https://xinghuo.xfyun.cn/');
                    break;    
                case 'qw':
                    window.open('https://qianwen.aliyun.com/');
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
            if (sessionStorage.getItem("chatCache")) {
                store.commit("CLEAR_CHAT_CACHE");
                this.show = true;
                let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
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
            this.socket.close();
            this.socket = null;
            this.stopCursor = false;
        },
        handleKeyUp(event) {
            if (event.ctrlKey && event.keyCode === 13) {
                this.wsInit();
            }
        },
        // 建立websocket连接
        wsInit () {
            if (!this.chatContent.replace(/[\r\n\s]+/g, '')) {
                this.chatContent = "";
                Message.error("请输入对话内容.");
                return;
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
            case 'GPT-4':
                modelIcon = this.gpt4;
                break;
            case 'chatGPT3.5':
                modelIcon = this.chatGptIcon;
                break;    
            case 'ai-assistant':
                modelIcon = this.assistantIcon;
                break;
            case 'bd':
                modelIcon = this.wxIcon;
                break;    
            case 'xf':
                modelIcon = this.xfIcon;
                break;    
            case 'qw':
                modelIcon = this.qwIcon;
                break;   
            default:
                modelIcon = this.defaultIcon;
                break;
            }

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
                icon: modelIcon,
                content: "",
                model: this.selectedModel,
                file: this.claudeFile,
            };

            this.waitingData();
            this.saveLatestId(data.uuid);
            this.editableTabsValue = data.uuid;

            store.commit("ADD_CHAT_CACHE", data);
            this.jumpFooter();
            this.chatTitleFormat();
            if (typeof(WebSocket) === "undefined") {
                Message.error("您的浏览器不支持socket")
            } else {
                // 实例化socket
                switch (this.selectedModel) {
                    case 'claude-2':
                        this.wsUrl = `${wssUsUrl}/ws/chat/${sessionStorage.getItem("user")}/`
                        break
                    case 'chatGPT3.5':
                        this.wsUrl = `${wssUsUrl}/ws/chat/${sessionStorage.getItem("user")}/`
                        break
                    case 'GPT-4':
                        this.wsUrl = `${wssUsUrl}/ws/chat/${sessionStorage.getItem("user")}/`
                        // this.wsUrl = `${wssSinApiUrl}/ws/chat/${sessionStorage.getItem("user")}/`
                        break
                    case 'chatGPT':
                        this.wsUrl = `${wssSinApiUrl}/ws/chat/${sessionStorage.getItem("user")}/`
                        break
                    case 'bd':
                        this.wsUrl = `${wssSinUrl}/ws/chat/${sessionStorage.getItem("user")}/`
                        break    
                    case 'qw':
                        this.wsUrl = `${wssSinUrl}/ws/chat/${sessionStorage.getItem("user")}/`
                        break
                    case 'xf':
                        this.wsUrl = `${wssSinApiUrl}/ws/chat/${sessionStorage.getItem("user")}/`
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
                
            }
        },
        open () {
            console.log('-----------websocket连接成功------------')
            this.stopCursor = true;
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
                    this.chatLLAM();
                    break
                case 'bd':
                    this.sendBd();
                    break
                case 'qw':
                    this.sendQw();
                    break
                case 'chatGPT3.5':
                    this.chatGPT35();
                    break
                case 'GPT-4':
                    this.chatGPT35();
                    // this.chatLLAM();
                    break
                case 'xf':
                    this.sendXF();
                    break
            }
        },
        // 接收数据
        getMessage (msg) {
            let jd = JSON.parse(msg.data);
            let div = document.querySelector(".content");
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].uuid == this.editableTabsValue) {
                    // this.chatCache[i].answer.push(jd.data);
                    this.chatCache[i].answer += jd.data;
                    this.chatCache[i].cid = jd.cid;
                    this.chatCache[i].pid = jd.pid;
                    this.chatCache[i].content = jd.content;
                } 
                div.scrollTop = div.scrollHeight - div.clientHeight;
            }
            this.getContentLen();
        },
        // 关闭websocket连接后需要保存下ai的回复
        close () {
            console.log('-----------websocket已关闭------------')
            this.finished = false;
            let answer = "";
            let div = document.querySelector(".content");
            for (let i = 0; i < this.chatCache.length; i++) {
                if (this.chatCache[i].uuid == this.editableTabsValue) {
                    if (this.chatCache[i].answer.length == 0) {
                        answer = '抱歉, 网络不佳, ai回复失败, 请重新提问';
                    } else {
                        answer = this.chatCache[i].answer;
                    }

                    let data = {
                        uuid: this.chatCache[i].uuid, 
                        answer: answer.replace(/ppt正在制作中.../g, 'ppt制作完成'), 
                        date: this.getDate(), 
                        timeShow: true,
                        content: this.chatCache[i].content,
                        cid: this.chatCache[i].cid,
                        pid: this.chatCache[i].pid,
                        cursor: false,
                        file: this.claudeFile,
                    }
                    store.commit("SAVE_CHAT_CACHE_ANSWER", data);
                    break
                } 
                div.scrollTop = div.scrollHeight - div.clientHeight;
            }
            this.claudeFile = "";
            // this.fileList = [];
            this.chatContent = "";
            this.stopResp = false;
            this.socket = null;
            this.pptCreate = false;
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
            lastData = cacheData[cacheData.length - 1];
            // lastData['answer'] = JSON.stringify(lastData['answer']);
            let data = {data: JSON.stringify(lastData)};
            const resp = await chatSave(data, this.callMethod);
            if (resp.data.status != 666) {
                Message.error('保存数据失败>>>', resp.data.msg);
            }
        },
        // 通义千问
        sendQw() {
            let sendData = {};
            if (this.contextSwitch) {
                //发送的信息关联上下文
                sendData = {cid: "claude", pid: "", file: this.claudeFile, data: this.chatContent.replace(/[\r\n\s]+/g, ''), model: this.selectedModel, context: 'open'};
            } else {
                sendData = {cid: "", pid: "", file: this.claudeFile, data: this.chatContent.replace(/[\r\n\s]+/g, ''), model: this.selectedModel, context: ''};
            }
            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // claude
        sendClaude() {
            let sendData = {};
            // let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            if (this.contextSwitch) {
                //发送的信息关联上下文
                sendData = {cid: "claude", pid: "", file: this.claudeFile, data: this.chatContent.replace(/[\r\n\s]+/g, ''), model: this.selectedModel, context: 'open'};
            } else {
                sendData = {cid: "", pid: "", file: this.claudeFile, data: this.chatContent.replace(/[\r\n\s]+/g, ''), model: this.selectedModel, context: ''};
            }
            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // 文心一言
        sendBd() {
            let sendData = {};
            let lastData = [];
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            let gptData =  cacheData.filter(cd => cd.model == this.selectedModel);
            if (this.contextSwitch) {
                if (gptData.length > 1) {
                    //发送的信息关联上下文
                    lastData = gptData[gptData.length - 2];
                    sendData = {cid: lastData.cid, pid: lastData.pid, data: this.chatContent.replace(/[\r\n\s]+/g, ''), model: this.selectedModel, content: lastData.title};
                } else {
                    sendData = {cid: "", pid: "", data: this.chatContent.replace(/[\r\n\s]+/g, ''), model: this.selectedModel, content: ''};
                }
            } else {
                sendData = {cid: "", pid: "", data: this.chatContent.replace(/[\r\n\s]+/g, ''), model: this.selectedModel, content: ''};
            }

            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // 讯飞星火
        sendXF() {
            let sendData = {};
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            let xfData =  cacheData.filter(cd => cd.model == this.selectedModel);
            if (this.contextSwitch) {
                if (xfData.length > 1) {
                    //发送的信息关联上下文
                    sendData = {data: this.chatContent.replace(/[\r\n\s]+/g, ''), content: xfData.slice(-4), model: this.selectedModel};
                } else {
                    sendData = {data: this.chatContent.replace(/[\r\n\s]+/g, ''), content: '', model: this.selectedModel};
                }
            } else {
                sendData = {data: this.chatContent.replace(/[\r\n\s]+/g, ''), content: '', model: this.selectedModel};
            }
            
            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // assistant(第三方提供的api)
        chatLLAM() {
            let sendData = {};
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            let gptData =  cacheData.filter(cd => cd.model == this.selectedModel);
            if (this.contextSwitch) {
                if (gptData.length > 1) {
                    //发送的信息关联上下文
                    sendData = {data: this.chatContent.replace(/[\r\n\s]+/g, ''), systemSet: this.dnSwitch ? 'open' : '', content: gptData.slice(-5), model: this.selectedModel};
                } else {
                    sendData = {data: this.chatContent.replace(/[\r\n\s]+/g, ''), content: '', systemSet: this.dnSwitch ? 'open' : '', model: this.selectedModel};
                }
            } else {
                sendData = {data: this.chatContent.replace(/[\r\n\s]+/g, ''), content: '', systemSet: this.dnSwitch ? 'open' : '', model: this.selectedModel};
            }

            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // chatGPT3.5,gpt-4
        chatGPT35() {
            let sendData = {};
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            let gptData =  cacheData.filter(cd => cd.model == this.selectedModel);
            let id = (100000000 - 1) * Math.random() + 1;
            let uuid = Math.floor(id);
            let file = this.pptCreate ? uuid+'.pptx': '';
            let ppt = this.pptCreate ? 'ppt': '';
            if (this.contextSwitch) {
                if (gptData.length > 1) {
                    //发送的信息关联上下文
                    sendData = {data: this.chatContent.replace(/[\r\n\s]+/g, ''), systemSet: this.dnSwitch ? 'open' : '', content: gptData.slice(-5), model: this.selectedModel, file: file, ppt: ppt};
                } else {
                    sendData = {data: this.chatContent.replace(/[\r\n\s]+/g, ''), content: '', systemSet: this.dnSwitch ? 'open' : '', model: this.selectedModel, file: file, ppt: ppt};
                }
            } else {
                sendData = {data: this.chatContent.replace(/[\r\n\s]+/g, ''), content: '', systemSet: this.dnSwitch ? 'open' : '', model: this.selectedModel, file: file, ppt: ppt};
            }
            console.log(sendData);
            this.socket.send(JSON.stringify(sendData));
            this.jumpFooter();
        },
        // chatgpt
        sendChatGpt() {
            let sendData = {};
            let lastData = [];
            let cacheData = JSON.parse(sessionStorage.getItem("chatCache"));
            let gptData =  cacheData.filter(cd => cd.model == 'chatGPT');
            if (this.contextSwitch) {
                if (gptData.length > 1) {
                    //发送的信息关联上下文
                    lastData = gptData[gptData.length - 2];
                    sendData = {cid: lastData.cid, pid: lastData.pid, data: this.chatContent.replace(/[\r\n\s]+/g, ''), model: this.selectedModel, systemSet: this.dnSwitch ? 'open' : ''};
                } else {
                    sendData = {cid: "", pid: "", data: this.chatContent.replace(/[\r\n\s]+/g, ''), model: this.selectedModel, systemSet: this.dnSwitch ? 'open' : ''};
                }
            } else {
                sendData = {cid: "", pid: "", data: this.chatContent.replace(/[\r\n\s]+/g, ''), model: this.selectedModel, systemSet: this.dnSwitch ? 'open' : ''};
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
            let dnSwitch = sessionStorage.getItem('ss');
            if (dnSwitch == 1) {
                this.dnSwitch = true;
            } else if (dnSwitch == 2) {
                this.dnSwitch = false;
            } else {
                this.dnSwitch = false; //预设默认关闭
            }
        },
        // 预设开关-仅对chatGPT有效
        isOpenDay() {
            if (this.dnSwitch) {
                Message.success('已启用预设角色回复');
                sessionStorage.setItem("ss", 1);
            } else {
                Message.warning('已关闭预设角色回复');
                sessionStorage.setItem("ss", 2);
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
        lazyLoadData() {
            let content = document.getElementsByClassName('content')[0];
            let scroll = content.scrollTop;
            scroll -= 3;
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


            // if(content.scrollHeight > content.clientHeight) {
                
            //     setTimeout(function(){
            //         //设置滚动条到最顶部
            //         content.scrollTop = 0;
            //     },0);
            //     setTimeout(function(){
            //         //设置滚动条到最顶部
            //         tab.scrollTop = 0;
            //     },0);
            // }
        },
        // 删除对话记录, 会现在回收站保存, 最多保留200条数据
        removeChat(targetName) {
            this.getAllChatData();
            let tabs = this.chatCache;
            let rbChat = tabs.filter(tab => tab.uuid == targetName);
            let activeName = this.editableTabsValue;
            if (activeName == targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.uuid == targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.uuid;
                        }
                    }
                });
            }
            
            this.editableTabsValue = activeName;
            let newChat = tabs.filter(tab => tab.uuid != targetName);
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
        // 锚点
        jump(id) {
            location.hash = "#" + id;
            document.getElementById(id).setAttribute("style", "color: #d9d04b;");
        },
        refresh() {
            this.close();
            clearInterval(this.loadTimer);
        },
        callMethod() {},
    },
    filters: {
        getModelLabel(data, allModel) {
            let label = allModel.find(item => item.value == data);
            return label.label;
        },
        getModelLabel2(data, allModel) {
            if (allModel && Array.isArray(allModel)) {
                let label = allModel.find(item => item.value == data);
                return label ? label.label : "";
            }
            return data;
        },
    },
    mounted() {
        if (window.innerWidth < 600) {
            this.ash = false;
        }
        this.checkContextStatus();
        this.getAllChatData();
        this.getAllChatRecycleData();
        // this.defaultHideAside();
        this.checkSystemSet();
        this.getContentLen();
        this.getAllRbData();
        this.checkModel();
        this.checkLoadingOffset();
        // this.getChatList(100);
        this.chatTitleFormat();
        this.scrollLoadChatDataStatus();
        this.getCurrentUser();
        this.checkisOpenScrollLoadData();
    },
}
</script>

<style lang="scss" scoped>
    @import '../../../public/style/chat-style.css';
</style>