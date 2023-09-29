<template lang="pug">
div(class="relative h-screen w-full bg-slate-800 flex items-center justify-center select-none" ref="fullscreen")
  slot
</template>
<script setup lang="ts">
const fullscreen = ref(null)
onMounted(() => {
  REFS.fullscreen = fullscreen
  EVENTS.onSingle("toggleFullscreen", () => {
    console.log("e")
    GLOBAL.fullscreen = !GLOBAL.fullscreen
    if (REFS.fullscreen && !document.fullscreenElement) {
      REFS.fullscreen.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  })
})
</script>
