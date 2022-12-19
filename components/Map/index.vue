<template lang="pug">
div(class='absolute' :style='imageStyle')
  img(:src='map' class='absolute -z-20 w-full')
div(class='absolute' :style='collisionStyle')
  MapCollision(v-if='States().mapEdit && States().bobcat')

</template>
<script setup>
import map from "@/assets/map.webp"
const collisionStyle = computed(() => {
  let size = 7200 + "px"
  return {
    top: -1 * Map().offsetDelay[1] + "px",
    left: -1 * Map().offsetDelay[0] + "px",
    width: size,
    height: size,
  }
})
const imageStyle = computed(() => {
  let size = 7200 + "px"
  return {
    top: -1 * Map().offset[1] + "px",
    left: -1 * Map().offset[0] + "px",
    width: size,
    height: size,
  }
})
</script>
