<template lang="pug">
div(class="absolute relative top-[20px] left-[757px]")
  img(:src="ASSETS.webps.target" class="absolute" draggable="false")
  img(
    :src="ASSETS.webps['target-health']"
    class="absolute left-0 w-[400px] h-[100px] object-left object-cover transition-all duration-150 ease-in-out"
    draggable="false"
    :style="health"
  )
  transition(type="fast")
    img(
      :src="ASSETS.webps['target-lock']"
      class="absolute"
      draggable="false"
      v-show="INTERFACE.targetLocked"
    )
  div(class="absolute top-[13px] left-[84px] w-[205px] h-[40px] pl-[30px] flex justify-center")
    p(class="text-tan text-2xl font-semibold mb-4") Bunbo
</template>
<script setup lang="ts">
const health = computed(() => {
  return {
    width: (INTERFACE.targetHealth / INTERFACE.targetMaxHealth) * 400 + "px",
  }
})
</script>
