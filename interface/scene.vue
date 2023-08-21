<template lang="pug">
div(class="z-30 relative")
  //- images
  img(
      v-for="(value, index) in ACTIVE_SCENE.imageLayer"
      :key="index"
      :src="ASSETS.webps[value]"
      draggable="false"
      class="absolute"
    )
  dialogue(layer="layerOne")
  transition: div(v-if="ACTIVE_SCENE.activeImageLayer === 'secondImageLayer'")
    img(
      v-for="(value, index) in ACTIVE_SCENE.secondImageLayer"
      :key="index"
      :src="ASSETS.webps[value]"
      draggable="false"
      class="absolute"
    )
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
