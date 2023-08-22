<template lang="pug">
div(class="z-30 relative")
  //- layerOne always on
  images(layer="layerOne")
  dialogue(layer="layerOne")
  //- layerTwo
  transition(:style='transition')
    div(v-if="ACTIVE_SCENE.activeLayer === 'layerTwo'")
      images(layer="layerTwo")
      dialogue(layer="layerTwo")
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
