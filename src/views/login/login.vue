<template>
    <div class="login-box">
        <el-card>
            <el-row :gutter="10" class="login-content">
                <el-col>
                    <h3 class="login-title">ChatAi登录</h3>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="login-content" v-if="isShowQr == 1">
                <el-col>
                    <vue-qr 
                        :logo-src="appSrc"
                        :size="191"
                        :margin="0"
                        :auto-color="true"
                        :dot-scale="1"
                        :text="url"
                    />
                    <p class="notice">打开谷歌验证器Authenticator扫码</p>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="login-content">
                <el-col class="login-col-1">
                    <el-input v-model="user" placeholder="请输入用户名" suffix-icon="el-icon-edit" :disabled="finished" clearable @keyup.enter.native="GaLogin()"></el-input>
                </el-col>
                <el-col class="login-col-2">
                    <el-input v-model="gacode" placeholder="联系Q拿登录码: 120332269" suffix-icon="el-icon-edit" :disabled="finished" clearable @keyup.enter.native="GaLogin()"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="login-content">
                <el-col>
                    <el-button type="success" plain @click="GaLogin()" :loading="submitLoad">{{ logintext }}</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { gaLogin } from '../../api'
import VueQr from 'vue-qr'
import { Message } from 'element-ui'

export default {
    name:"ga",
    data () {
        return {
            user: "",
            appSrc:"",
            gacode:"",
            hidden: true,
            isShowQr:2,
            submitLoad: false,
            finished: false,
            logintext:"确定",
            url: "",
        }
    },
    components: {
        VueQr
    },
    methods: {
        async GaLogin() {
            if (!this.user) {
                return Message.error("请输入用户名");
            }

            if (!this.gacode) {
                return Message.error("请输入chatai码");
            }

            this.finished = true;
            this.logintext = "登录中...";

            this.submitLoad = true;
            const resp = await gaLogin({code: this.gacode, user: this.user}, this.user, this.callMethod).catch(err => {this.submitLoad = false;})

            if (resp.data.status !== 10000) {
                this.submitLoad = false;
                this.finished = false;
                this.logintext = "确定";
                return Message.error(resp.data.message)
            }

            sessionStorage.setItem("user", resp.data.user);
            this.$router.push('/chat');
            this.submitLoad = false;
            this.finished = false;
            this.logintext = "确定";
        },
        callMethod() {},

    },
    created () {
        this.user = this.$route.params.user;
        this.isShowQr =  this.$route.params.qr;
        if (this.isShowQr == 1) {
            this.url = this.$route.params.url;
        }
    },
}
</script>

<style lang="scss" scoped>
.login-box {
    padding-top: 150px;
}
.login-title {
    position: relative;
    width: 400px;
    height: 45px;
    line-height: 45px;
    color: #fff;
    right: 20px;
    bottom: 30px;
    background-color: #1ab395;
}
.login-content {
    margin-top: 10px;
}
.notice {
    font-size: 12px;
    color: #c78282;
}
:deep .el-button--success.is-plain {
    width: 100%;
}
.login-box .el-card {
    width: 400px;
    margin: 0 auto;
}
.login-col-2 {
    margin-top: 15px;
    margin-bottom: 15px;
}
//适应手机
@media only screen and (max-width: 500px) {
    .el-card, .login-title {
        width: 346px;
    }
    
}
</style>