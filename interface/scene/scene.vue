<template lang="pug">
div(class="z-30 relative")
  //- layerOne always on (content switched :) )
  images(layer = "layerOne")
  dialogue(layer = "layerOne")
  //- layerTwo
  transition
    div(v-if="ACTIVE_SCENE.activeLayer === 'layerTwo'")
      images(layer = "layerTwo")
      dialogue(layer = "layerTwo")

  //- only for adult check
  div(
    class="-z-10 flex justify-center items-center w-full h-[1080px] relative pointer-events-none"
    v-if="ACTIVE_SCENE.name === 's0-adult-check' && ACTIVE_SCENE.stepIndex < 2"
  )
    p(class="mt-[-310px] w-[500px] h-[80px] leading-10 font-semibold text-[30px] text-red-400 text-center") This game is strictly 18+ 🔞
    div(class="mr-[1px] mt-[100px] w-[650px] h-[350px] bg-gradient-to-b from-blue-500 to-sky-700 opacity-[.80] absolute rounded-xl border-8 border-blue-400 saturate-[.60] brightness-[.8]")

</template>
<script setup lang="ts">
const transitionSpeed = computed(() => {
  return `opacity ${CONFIG.scene.transitionSpeed}ms ease`
})
</script>
<style scoped>
.v-enter-active {
  transition: v-bind(transitionSpeed);
}
.v-leave-active {
  transition: opacity 0ms ease;
}
.v-enter-from {
  opacity: 0;
}
.v-leave-to {
  opacity: 1;
}
</style>
