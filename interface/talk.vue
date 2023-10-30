<template lang="pug">
div(
  class="relative flex justify-center items-center w-[120px] hover:brightness-125 hover:scale-[1.05] transition duration-150 ease-in-out"
  :style="style"
  @mouseover="INTERFACE.talkHover = true"
  @mouseleave="INTERFACE.talkHover = false"
  )
  img(
    :src="ASSETS.webps.talk"
    draggable="false"
    class="absolute object-none"
  )
  p(class="z-10 text-tan text-2xl font-semibold mb-2 points-events-none") Talk
</template>
<script setup lang="ts">
const style = computed(() => {
  return {
    left: INTERFACE.talkPosition.x + "px",
    top: INTERFACE.talkPosition.y + "px",
  }
})
</script>
