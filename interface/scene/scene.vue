<template lang="pug">
div(class="z-30 relative")
  //- layerOne always on
  images(layer="layerOne")
  dialogue(layer="layerOne")
  //- layerTwo
  transition: div(v-if="ACTIVE_SCENE.activeLayer === 'layerTwo'")
    images(layer="layerTwo")
    dialogue(layer="layerTwo")
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
