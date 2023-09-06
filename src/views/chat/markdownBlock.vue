<template>
    <div ref="html" class="box">
        <pre>
          <code v-html="formattedCode" class="code"></code>
        </pre>
    </div>
</template>

<script>
// 自定义markdown组件
import MarkdownIt from 'markdown-it';
import { Message } from 'element-ui'
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-dark.css';
// 高亮样式
// import 'highlight.js/styles/monokai.css'; 
// import 'highlight.js/styles/tomorrow-night-blue.css';
// import 'highlight.js/styles/tomorrow-night-bright.css';

export default {
    props: {
        code: {
            type: String,
            required: true,
        },
        cursor: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    data() {
        return {
            renderedCode: '',
            formatCode: '',
        };
    },
    computed: {
        formattedCode() {
            // const md = new MarkdownIt();
            // return md.render(this.code);
            return this.renderMarkdown();
        },
    },
    mounted () {
        window.copy = this.copy;
        this.renderMarkdown();
    },
    methods: {
        copy (text) {
            let newText = text.replace(/kbkbkb/g, '`').replace(/jjjj/g, '$').replace(/fffrrr/g, "\\");
            this.$copyText(newText).then(() => {
                Message.info('已复制到剪贴板');
            }).catch((err) => {
                Message.error('复制失败');;
            });
        },
        renderCode() {
            const md = new MarkdownIt();
            this.renderedCode = md.render(this.code);
        },
        renderMarkdown() {
            const md = new MarkdownIt({
                highlight: function (code, lang) {
                    // 代码部分就去掉光标效果, 不然<span class="cursor-2">|</span>会原样输出, 不会被渲染成html标签, 还会有一堆报错
                    code = code.replace(/<span class="language-html cursor-2">\|<\/span>/g, '');
                    if (lang && hljs.getLanguage(lang)) {
                        console.log("code 2222>>> ", code);
                        try {
                            return hljs.highlight(lang, code).value;
                        } catch (__) {}
                    }
                    return ''; // 使用外部默认转义
                },
                html: true,
            });
            md.renderer.rules.fence = (tokens, idx) => {
                const token = tokens[idx];
                let lang = token.info.trim();
                let langOld = lang;
                let code = token.content.trim();
                // 代码部分就去掉光标效果, 不然<span class="cursor-2">|</span>会原样输出, 不会被渲染成html标签, 还会有一堆报错
                code = code.replace(/<span class="language-html cursor-2">\|<\/span>/g, '');
                // lang = extractLangFromCode(code);
                if (lang) {
                    if (lang == "vue") { // 没有找到对vue.js的代码高亮支持，只能匹配到vue就让它显示js语法的高亮
                        lang = "javascript";
                    } else if (lang == "" || lang == null) { // 没有匹配到lang就直接用bash的语法
                        lang = "bash"
                    }

                    try {
                        return `<div class="custom-code-block-dev"><p class="lang-s">${langOld}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj').replace(/\\/g, "fffrrr"))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-${lang} code-3">${hljs.highlight(lang, code).value}</code></pre>`;
                    } catch (err) {
                        return `<div class="custom-code-block-dev"><p class="lang-s">${lang}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj').replace(/\\/g, "fffrrr"))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-${lang} code-3">${code}</code></pre>`;
                    }
                } else {
                    return `<div class="custom-code-block-dev"><p class="lang-s">text</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj').replace(/\\/g, "fffrrr"))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-text code-3">${code}</code></pre>`;
                }
            };

            // 返回被markdown，highlight组件渲染后的code
            const html = md.render(this.code + (this.cursor ? '<span class="language-html cursor-2">|</span>' : ""));
            // const html = md.render(this.code);
            return html
        },
    },
};
</script>

<style scoped>
    @import '../../../public/style/markdown-style.css';
</style>