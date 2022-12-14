<template lang="pug">
div(
  ref='background'
  class="bg-slate-800 h-screen w-screen flex items-center \
  justify-center relative"
)
  div(
    v-if="States().mainWindow"
    class='bg-gray-500 absolute overflow-hidden'
    :style='mainWindowStyle'
  )
    Pause(v-if="States().pause")

    Map
    Canvas

    Dev(v-if="States().dev")
    Minimap
    ButtonFullscreen


</template>
<script setup>
let mainWindowStyle = computed(() => {
  return {
    width: Canvas().width + "px",
    height: Canvas().height + "px",
    scale: MainWindow().scale,
    cursor: States().cursor ? "auto" : "none",
  }
})
const background = ref(null)

onMounted(() => {
  Ref().background = background // for fullscreen

  getCollision("start")
  useCookie("name").value ? getGameData() : createUser()
  checkBobcat()

  mainWindowSetSize()

  gamepadListeners()
  keyboardListeners()
  mouseListener()
  resizeListener()

  animSetup() // adds info to store from raw JSON files
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
