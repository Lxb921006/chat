<template>
  <div>
      <pre>
        <code v-html="formattedCode" class="code"></code>
      </pre>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';

export default {
  props: {
    code: {
      type: String,
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
  beforeMount() {
    this.renderMarkdown();
  },
  created() {
    // this.renderMarkdown();
  },
  methods: {
    renderCode() {
      const md = new MarkdownIt();
      this.renderedCode = md.render(this.code);
    },
    renderMarkdown() {
      const md = new MarkdownIt();
      md.renderer.rules.fence = (tokens, idx) => {
        const token = tokens[idx];
        const lang = token.info.trim();
        const code = token.content.trim();
        return `<div class="custom-code-block-dev"><p>${lang}</p></div><pre class="custom-code-block"><code class="language-${lang} code-3">${md.utils.escapeHtml(code)}</code></pre>`;
      };
      // this.renderedCode = md.render(this.code);
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
    bottom: 15px;
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