<template>
  <WindowFrame>
    <DemoCore/>
  </WindowFrame>
</template>

<script>
// @ is an alias to /src
import DemoCore from '@/components/DemoCore.vue'
import WindowFrame from '@/components/WindowFrame'

export default {
  name: 'Demo',
  components: {
    DemoCore,
    WindowFrame
  }
}
</script>
