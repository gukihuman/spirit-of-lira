<template lang="pug">
div(
  ref="background"
  class="h-screen w-screen bg-slate-800 \
  flex items-center justify-center"
)
  Display
    Viewport

    transition: Loading(v-if="!States().allLoaded" class="z-50")

</template>
<script setup>
const background = ref(null)

onMounted(() => {
  //
  // 📜 move it to input controller
  function listeners() {
    addEventListener("gamepadconnected", Listeners().padConnect)
    addEventListener("gamepaddisconnected", Listeners().padDisconnect)
    addEventListener("mousemove", Listeners().mouseMove)
    addEventListener("mousedown", Listeners().mouseDown)
    addEventListener("mouseup", Listeners().mouseUp)
    addEventListener("keydown", Listeners().keyDown)
    addEventListener("keyup", Listeners().keyUp)
  }

  Refs().background = background // for fullscreen

  startup()
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
