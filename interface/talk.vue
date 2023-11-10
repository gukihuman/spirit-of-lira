<template lang="pug">
div(
  class="relative w-[120px] hover:brightness-[1.15] transition duration-150 ease-in-out"
  :style="style"
)
  div(
    class="relative flex justify-center items-center hover:scale-[1.05] transition duration-150 ease-in-out h-[80px]"
    @click="TALK.emit()"
    @mouseover="INTERFACE.talkHover = true"
    @mouseleave="INTERFACE.talkHover = false"
    )
    img(
      :src="ASSETS.webps.talk"
      draggable="false"
      class="absolute object-none"
    )
    p(class="absolute z-10 text-tan text-[25px] font-semibold mb-2 points-events-none") Talk
  keys(class="top-[30px] left-[87px]" inputEvent="talk")
</template>
<script setup lang="ts">
const style = computed(() => {
  return {
    left: INTERFACE.talkPosition.x + "px",
    top: INTERFACE.talkPosition.y + "px",
  }
})
</script>
