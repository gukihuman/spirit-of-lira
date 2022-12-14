<template lang="pug">
//- background
div(ref='background' class="bg-slate-800 h-screen w-screen flex items-center \
justify-center relative")
  //- mainWindow
  div(ref="mainWindow" :style='mainWindowStyle' class='bg-gray-500 absolute overflow-hidden')
    Map
    Pause(v-if="Common().states.pause")
    Dev(v-if="Common().states.dev")
    Canvas
    Minimap
    ButtonFullscreen

</template>
<script setup>
let mainWindowStyle = computed(() => {
  return {
    width: Canvas().width + "px",
    height: Canvas().height + "px",
    scale: Common().mainWindow.scale,
    cursor: Common().states.cursor ? "auto" : "none",
  }
})
const background = ref(null)

onMounted(() => {
  // for fullscreen
  Common().refs.background = background
  mainWindowUpdate()
  listeners()
  animSetup() // adds info to AnimStore from raw JSON
  mapSetup()
  gameLoop()
  mouseLoop()

  generateEntity("heroArcher", 960, 540)
  generateEntity("goblin", 1550, 450)
})
</script>
<style>
::-webkit-scrollbar {
  display: none;
}
* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
