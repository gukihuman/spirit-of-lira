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
    AntiFlicker
    transition
      Loading(v-if="!States().updateAllowed")
    transition(name='fast')
      Pause(v-if="States().pause")

    Map
    transition(name='fast')
      Ranges(v-if="States().ranges")
    Canvas

    transition(name='fast')
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

  setVisual()

  gameLoop()

  mouseLoop()

  Game().entities.push(new Hero("hero", 1800, 6120))
  Game().entities.push(new Creature("goblin", 2550, 6000))
  // generateEntity("hero", 1800, 6120)
  // generateEntity("goblin", 2550, 6000)
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

.fast-enter-active,
.fast-leave-active {
  transition: opacity 0.1s ease;
}

.fast-enter-from,
.fast-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
