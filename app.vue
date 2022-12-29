<template lang="pug">
div(
  ref="background"
  class="h-screen w-screen bg-slate-800 \
  flex items-center justify-center"
)
  div(class="bg-gray-700 absolute" :style="mainWinStyle")
    transition: Loading(v-if="!States().overwriteDataAllowed")
    Display

    //- old =>
    //- AntiFlicker
    //- transition(name="fast"): Pause(v-show="States().pause")
    //- Map
    //- Shadows
    //- transition(name="fast"): Ranges(v-show="States().ranges")
    //- Canvas
    //- transition(name="fast"): Dev(v-show="States().dev")
    //- Minimap
    //- ButtonFullscreen
    //- MouseScreen(v-show="States().mouseScreen")
    //- PixiTest

</template>
<script setup>
let mainWinStyle = computed(() => {
  return {
    width: Settings().displayWidth + "px",
    height: Settings().displayHeight + "px",
    scale: MainWindow().scale,
    cursor: States().cursor ? "auto" : "none",
  }
})
const background = ref(null)

onMounted(() => {
  Ref().background = background // for fullscreen
  mainWinSetSize()
  addEventListener("resize", () => {
    mainWinSetSize()
  })
  if (useCookie("name").value == "lime_full_bobcat") States().devAccess = true
  useCookie("accessKey").value = useCookie("accessKey").value || "empty"

  useCookie("name").value ? getUserData() : createUser() // async

  // getCollision("start")
  // gamepadListeners()
  // keyboardListeners()
  // setVisual()
  // startGameLoop()
  // mouseLoop()
  // Game().entities.push(new Hero("hero", 1800, 6120))
  // for (let i of l.range(80)) {
  //   Game().entitiesCache.push(
  //     new Creature(
  //       "goblin",
  //       1000 + 5200 * Math.random(),
  //       500 + 6200 * Math.random()
  //     )
  //   )
  // }
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
