<template lang="pug">
  
div(ref="fullscreen")
  slot

</template>
<script setup lang="ts">
//
const fullscreen = ref(null)

onMounted(() => {
  //
  REFS.fullscreen = fullscreen

  EVENTS.onSingle("fullscreen", () => {
    //
    GLOBAL.fullscreen = !GLOBAL.fullscreen
    if (REFS.fullscreen && !document.fullscreenElement) {
      REFS.fullscreen.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  })
})
</script>
