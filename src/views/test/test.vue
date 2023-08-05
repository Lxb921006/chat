<template>
    <div>
        <pre>
            大哥
            <code v-for="(data,index) in data" :key="index">{{ data }}</code>
        </pre>
        
    </div>
</template>

<script>
export default {
    data () {
        return {
            data: ["aa", "bb", "   ", "cc", "\n", "dd"],
        }
    },
    mounted() {
    // 模拟数据变化，每秒钟更新一次
    setInterval(() => {
      this.data.push("lxb");
    }, 1000);
  },
    
}
</script>