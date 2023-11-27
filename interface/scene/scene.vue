<template lang="pug">
div(v-show="GLOBAL.context === 'scene'" class="z-30 relative")
  //- layer one always on - content switched when layer two fully appears
  //- then layer two immidealtly turns off again and preloads next step
  div(mark="layer-one")
    images(layer="layerOne")
    dialogue(layer="layerOne")
  tn: div(mark="layer-two" v-if="ACTIVE_SCENE.activeLayer === 'layerTwo'")
    images(layer="layerTwo")
    dialogue(layer="layerTwo")
  div(:style="style" class="absolute left-[35px] top-[1005px] flex gap-10"
    v-if="GLOBAL.context === 'scene' && ACTIVE_SCENE.name !== 'a0-adult-check'")
    quitScene
    navigate

  div(mark="adult-check-bg"
    v-if="ACTIVE_SCENE.name === 'a0-adult-check' && ACTIVE_SCENE.stepIndex < 2"
    class="-z-10 w-full h-[1080px] bg-slate-800 relative pointer-events-none"
    class="flex justify-center items-center")
    p(class="w-[500px] h-[80px] mt-[-310px]"
      class="text-[30px] font-semibold leading-10 text-red-400 text-center"
    ) This game is strictly 18+ 🔞
    div(class="mr-[1px] mt-[100px] w-[650px] h-[350px] opacity-[.80] absolute "
    class="rounded-xl border-8 border-blue-400 saturate-[.60] brightness-[.8]"
    class="bg-gradient-to-b from-blue-500 to-sky-700")
</template>
<script setup lang="ts">
const transitionSpeed = computed(() => {
  return `opacity ${CONFIG.scene.transitionSpeed}ms ease`
})
const style = computed(() => {
  return {
    filter: `
      hue-rotate(${ACTIVE_SCENE[ACTIVE_SCENE.activeLayer].hue}deg) 
      brightness(${ACTIVE_SCENE[ACTIVE_SCENE.activeLayer].brightness})
    `,
  }
})
</script>
<style scoped>
.default-enter-active {
  transition: v-bind(transitionSpeed);
}
.default-leave-active {
  transition: opacity 0ms ease;
}
.default-enter-from {
  opacity: 0;
}
.default-leave-to {
  opacity: 1;
}
</style>
