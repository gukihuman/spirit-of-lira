<template lang="pug">
div(
  ref="background"
  class="h-screen w-screen bg-slate-800 \
  flex items-center justify-center"
)
  div(class="bg-gray-700 absolute" :style="viewportStyle")
    transition: Loading(v-if="!States().overwriteDataAllowed" class="z-50")
    Display

</template>
<script setup>
let viewportStyle = computed(() => {
  return {
    width: Settings().displayWidth + "px",
    height: Settings().displayHeight + "px",
    scale: Viewport().scale,
    // 📜 cursor: States().cursor ? "auto" : "none",
  }
})
const background = ref(null)

onMounted(() => {
  Refs().background = background // for fullscreen
  setViewportSize()
  addEventListener(
    "resize",
    l.debounce(() => setViewportSize(), 20)
  )
  // 📜 move to dev panel
  // Info().maps.forEach((map) => {
  //   createMapIfNotExist(map, useCookie("accessKey").value)
  // })

  if (useCookie("name").value == "lime_full_bobcat") States().devAccess = true
  useCookie("accessKey").value = useCookie("accessKey").value || "empty"

  // States().overwriteDataAllowed = true after these async functions
  useCookie("name").value ? getUserData() : createUser()

  watchGamepadConnection()
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
