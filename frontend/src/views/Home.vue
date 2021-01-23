<template>
  <WindowFrame>
    <div style="text-align:center;">
      <img alt="Vue logo" src="../assets/logo.png">
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </WindowFrame>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import WindowFrame from '@/components/WindowFrame'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    WindowFrame
  }
}
</script>
