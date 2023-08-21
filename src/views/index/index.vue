<template>
    <div>
        <div class="index">
            <el-row :gutter="20">
                <el-card>
                    <h1 class="model">
                        <svg class="icon-qa-3" aria-hidden="true">
                            <use xlink:href="#icon-a-5_moxingtongbu"></use>
                        </svg>
                        模型选择
                    </h1>
                </el-card>
            </el-row>
            <el-row :gutter="20">
                <el-card class="card" v-for="data in models" :key="data.id" @click.native="useAi(data.action)">
                    <el-col>
                        <svg class="icon-qa" aria-hidden="true">
                            <use :xlink:href=data.icon></use>
                        </svg>
                        <span class="title">{{ data.name }}</span>
                    </el-col>
                </el-card>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: "index",
    data () {
        return {
            data: "",
            models:[
                {name:"图片模型", icon:"#icon-tupian", action:"img", id:1},
                {name:"达芬奇模型", icon:"#icon-daima", action:"chat", id:2},
            ],
        }
    },
    methods:{
        chat() {
            this.$router.push('/chat');
        },
        img() {
            this.$router.push('/img');
        },
        useAi(method) {
            switch (method) {
                case "img":
                    this.img();
                    break
                case "chat":
                    this.chat();
                    break
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.index {
    width: 580px;
    margin: 0 auto;
}
.card {
    display: inline-block;
    margin: 16px;
    cursor:pointer;
}
.card:hover {
    background-color: rgb(235, 240, 245);
}
.title {
    font-size: 10px;
    display: block;
    padding-bottom: 17px;
    padding-top: 6px;
}
.icon-qa {
    width: 39px;
    height: 39px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
.model {
    font-weight: 100;
}
.icon-qa-3 {
    position: relative;
    top: 6px;
    width: 47px;
    height: 44px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
//适应手机
@media only screen and (max-width: 500px) {
    .index {
        width: 100%;
    }
}
</style>