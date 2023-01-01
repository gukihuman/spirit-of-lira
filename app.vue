<template lang="pug">
div(
  ref="background"
  class="h-screen w-screen bg-slate-800 \
  flex items-center justify-center"
)
  div(class="bg-gray-700 absolute" :style="viewportStyle")
    MouseHandler(v-if="States().mouseMoving" class="z-50")
    transition: Loading(v-if="!States().allLoaded" class="z-40")
    Viewport

</template>
<script setup>
let viewportStyle = computed(() => {
  return {
    width: Settings().displayWidth + "px",
    height: Settings().displayHeight + "px",
    scale: Viewport().scale,
    cursor: States().cursor ? "auto" : "none",
  }
})
const background = ref(null)

onMounted(() => {
  Refs().background = background // for fullscreen
  setViewportSize()
  addEventListener("resize", Listeners().resize)
  addEventListener("mousemove", Listeners().mouseMove)

  // 📜 move to dev panel
  // l.forOwn(Info().maps, (key, value) => {
  //   createMapIfNotExist(key, value, useCookie("accessKey").value)
  // })

  if (useCookie("name").value == "lime_full_bobcat") States().devAccess = true
  useCookie("accessKey").value = useCookie("accessKey").value || "empty"

  // these async functions also do => setTicker()
  useCookie("name").value ? getUserData() : createUser()

  watchPadConnection()
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
