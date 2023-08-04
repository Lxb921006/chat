<template>
    <div v-html="highlightedCode"></div>
  </template>
  
  <script>
  // 引入 highlight.js 库和需要的语言支持（这里以 Python 为例）
  import hljs from 'highlight.js/lib/core';
  import 'highlight.js/styles/github.css';
  import python from 'highlight.js/lib/languages/python';
  import javascript from 'highlight.js/lib/languages/javascript';
//   import html from 'highlight.js/lib/languages/html';
  import golang from 'highlight.js/lib/languages/go';
  
  // 注册语言支持到 highlight.js
  hljs.registerLanguage('python', python);
  hljs.registerLanguage('javascript', javascript);
//   hljs.registerLanguage('html', html);
  hljs.registerLanguage('golang', golang);
  
  export default {
    props: {
      code: {
        type: String,
        required: true
      }
    },
    computed: {
      highlightedCode() {
        // 使用正则表达式匹配三个反引号包裹的代码块
        const regex = /```([\s\S]+?)```/g;
        const matches = this.code.match(regex);
  
        // 如果匹配到了代码块
        if (matches) {
          // 获取代码块中的内容
          const code = matches[0].slice(3, -3);
  
          // 自动识别代码语言，并使用 highlight.js 进行高亮显示
          const language = hljs.highlightAuto(code).language;
          const highlighted = hljs.highlight(code, { language }).value;
  
          // 返回高亮显示的代码
          return this.code.replace(regex, `<pre><code class="hljs ${language}">${highlighted}</code></pre>`);
        } else {
          // 没有匹配到代码块，直接返回原始内容
          return this.code;
        }
      }
    }
  };
  </script>