<template>
  <div ref="html" class="box">
      <pre>
        <code v-html="formattedCode" class="code"></code>
        <!-- <span class="cursor"></span> -->
      </pre>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import { Message } from 'element-ui'
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-dark.css';
// import 'highlight.js/styles/monokai.css'; // 高亮样式
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
    },
  },
  data() {
    return {
      renderedCode: '',
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
      let newText = text.replace(/kbkbkb/g, '`').replace(/jjjj/g, '$');
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
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, code).value;
            } catch (__) {}
          }
          return ''; // 使用外部默认转义
        },
      });
      md.renderer.rules.fence = (tokens, idx) => {
        const token = tokens[idx];
        let lang = token.info.trim();
        let langOld = lang;
        const code = token.content.trim();
        if (lang) {
          if (lang == "vue") { // 没有找到对vue.js的代码高亮支持，只能匹配到vue就让它显示js的高亮
            lang = "javascript";
          }
          try {
            return `<div class="custom-code-block-dev"><p class="lang-s">${langOld}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj'))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-${lang} code-3">${hljs.highlight(lang, code).value} </code></pre>`;
          } catch (err) {
            return `<div class="custom-code-block-dev"><p class="lang-s">${lang}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj'))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-${lang} code-3">${md.utils.escapeHtml(code)} </code></pre>`;
          }
        } else {
          return `<div class="custom-code-block-dev"><p class="lang-s">text</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj'))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-${lang} code-3">${md.utils.escapeHtml(code)} </code></pre>`;
        }
      };
      return md.render(this.code);
    },
  },
};
</script>

<style scoped>
    @import '../../../public/style/markdown-style.css';
</style>