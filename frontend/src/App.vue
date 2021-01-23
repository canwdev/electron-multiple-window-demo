<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
const {electronAPI} = window

export default {
  async mounted() {
    electronAPI.onUpdateMessage((evt, message) => {
      console.log('onUpdateMessage', evt, message)
      this.$store.commit('setMessage', message)
    })
    electronAPI.onUpdateWindowIds((evt, windowIds) => {
      console.log('onUpdateWindowIds', evt, windowIds)
      this.$store.commit('setWindowIds', windowIds)
    })
    const ids = await electronAPI.wmGetWindowIds()
    console.log('initial ids', ids)

    this.$store.commit('setWindowIds', ids)
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
