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
            return `<div class="custom-code-block-dev"><p>${langOld}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj'))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-${lang} code-3">${hljs.highlight(lang, code).value} </code></pre>`;
          } catch (err) {
            return `<div class="custom-code-block-dev"><p>${lang}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj'))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-${lang} code-3">${md.utils.escapeHtml(code)} </code></pre>`;
          }
        } else {
          return `<div class="custom-code-block-dev"><p>text</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(code.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj'))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-${lang} code-3">${md.utils.escapeHtml(code)} </code></pre>`;
        }
      };
      return md.render(this.code);
    },
    renderMarkdownUpdate() {
      // 使用MarkdownIt解析Markdown文本，并进行代码高亮
      const md = new MarkdownIt({
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return `<div class="custom-code-block-dev"><p>${lang}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(str.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj'))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block hljs"><code class="language-${lang} code-3">${hljs.highlight(lang, str, true).value} </code></pre>`;
            } catch (err) {
              console.log("md1 err >>>", err);
            }
            try {
              return `<div class="custom-code-block-dev"><p>${lang}</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(str.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj'))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block hljs"><code class="language-${lang} code-3">${md.utils.escapeHtml(str)} </code></pre>`;
            } catch (err) {
              console.log("md2 err >>>", err);
            }  
          } else {
            try {
              return `<div class="custom-code-block-dev"><p>text</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(str.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj'))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-text code-3">${hljs.highlight("text", str, true).value} </code></pre>`;
            } catch (err) {
              console.log("md3 err >>>", err);
            }
            try {
              return `<div class="custom-code-block-dev"><p>text</p><button class="copy-1" onclick="copy(\`${md.utils.escapeHtml(str.replace(/\`/g, 'kbkbkb').replace(/\$/g, 'jjjj'))}\`)"><span class="iconfont icon-fuzhi"></span></button></div><pre class="custom-code-block"><code class="language-text code-3">${md.utils.escapeHtml(str)} </code></pre>`;
            } catch (err) {
              console.log("md4 err >>>", err);
            }
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
.code-day {
    color: #262626
}
.box {
  position: relative;
  margin-top: -31px;
}
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
    /* bottom: 30px; */
    color: #fff;
    background-color: #373737;
    /* background-color: #373737; */
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 0 11px 0px 11px;
    font-size: 14px;
    line-height: 1.5;
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
.code-day {
    color: #262626
}
</style>