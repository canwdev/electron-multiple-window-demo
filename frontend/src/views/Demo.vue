<template>
  <WindowFrame :title="title">
    <DemoCore/>
  </WindowFrame>
</template>

<script>
// @ is an alias to /src
import DemoCore from '@/components/DemoCore.vue'
import WindowFrame from '@/components/WindowFrame'

export default {
  name: 'Demo',
  data() {
    return {
      title: 'Demo 窗口'
    }
  },
  metaInfo() {
    return {
      title: this.title,
    }
  },
  components: {
    DemoCore,
    WindowFrame
  }
}
</script>
