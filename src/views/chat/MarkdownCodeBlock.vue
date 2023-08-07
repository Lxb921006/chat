<template>
  <div ref="html">
      <pre>
        <code v-html="formattedCode" class="code"></code>
      </pre>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import { Message } from 'element-ui'
import hljs from 'highlight.js';
// import 'highlight.js/styles/monokai.css';
import 'highlight.js/styles/stackoverflow-dark.css';
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
      language: '',
    };
  },
  computed: {
    formattedCode() {
      // const md = new MarkdownIt();
      // return md.render(this.code);
      return this.renderMarkdown2();
    },
  },
  mounted () {
    window.copy = this.copy;
    this.renderMarkdown2();
  },
  methods: {
    copy (text) {
      this.$copyText(text).then(() => {
          Message.info('复制成功');
      }, (err) => {
        console.log("复制失败 >>>", err);
        Message.error('复制失败');
      });
    },
    renderCode() {
      const md = new MarkdownIt();
      this.renderedCode = md.render(this.code);
    },
    renderMarkdown() {
      // const md = new MarkdownIt();
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
        const lang = token.info.trim();
        const code = token.content.trim();
        if (lang) {
          return `<div class="custom-code-block-dev"><p>${lang}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code)}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-${lang} code-3">${md.utils.escapeHtml(code)}</code></pre>`;
        } else {
          return `<div class="custom-code-block-dev"><p>text</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code)}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-${lang} code-3">${md.utils.escapeHtml(code)}</code></pre>`;
        }
      };
      // this.renderedCode = md.render(this.code);
      return md.render(this.code);
    },
    renderMarkdown2() {
      // 使用MarkdownIt解析Markdown文本，并进行代码高亮
      const md = new MarkdownIt({
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return `<div class="custom-code-block-dev"><p>${lang}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(str)}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block hljs"><code class="language-${lang} code-3">${hljs.highlight(lang, str, true).value} </code></pre>`;
            } catch (err) {
              console.log("md err >>>", err);
            }
            return `<div class="custom-code-block-dev"><p>${lang}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(str)}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block hljs"><code class="language-${lang} code-3">${md.utils.escapeHtml(str)} </code></pre>`;
          } else {
            try {
              return `<div class="custom-code-block-dev"><p>text</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(str)}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-text code-3">${hljs.highlight("text", str, true).value} </code></pre>`;
            } catch (__) {}
            return `<div class="custom-code-block-dev"><p>text</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(str)}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-text code-3">${md.utils.escapeHtml(str)} </code></pre>`;
          }
        }
      });

      // 将Markdown文本转换为HTML，并设置到renderedHtml中
      return md.render(this.code);
    },
  },
};
</script>

<style scoped>
.custom-code-block {
  background-color: #2e2e2e;
  padding: 10px;
  line-height: 1.5;
  width: 659px;
  margin-bottom: 10px;
}
.custom-code-block-dev {
  height: 39px;
  line-height: 39px;
  background-color: #262626;
  border-radius: 2px;
}
.custom-code-block-dev p {
  padding-left: 10px;
}
.code-3 {
  white-space: pre-wrap;
}
.code {
    white-space: pre-wrap;
    display: block;
    margin: 0 auto;
    width: 659px;
    position: relative;
    bottom: 30px;
    color: #fff;
    background-color: #373737;
    /* background-color: #373737; */
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 0 11px 5px 11px;
    font-size: 14px;
}
.title-block {
  white-space: pre-wrap;
    display: block;
    margin: 0 auto;
    width: 659px;
    position: relative;
    bottom: 15px;
    color: #fff;
    background-color: #373737;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 0 11px 5px 11px;
    font-size: 14px;
}

</style>