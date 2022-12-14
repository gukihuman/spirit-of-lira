<template lang="pug">
div(class='absolute' :style='imageStyle')
  img(:src='map' class='absolute -z-20 opacity-50 w-full')
div(class='absolute' :style='collisionStyle')
  MapCollision(v-if='Common().states.mapEdit')

</template>
<script setup>
import map from "@/assets/map.webp"
const collisionStyle = computed(() => {
  let size = 4800 + "px"
  return {
    top: -1 * Map().mapOffsetDelay[1] + "px",
    left: -1 * Map().mapOffsetDelay[0] + "px",
    width: size,
    height: size,
  }
})
const imageStyle = computed(() => {
  let size = 4800 + "px"
  return {
    top: -1 * Map().mapOffset[1] + "px",
    left: -1 * Map().mapOffset[0] + "px",
    width: size,
    height: size,
  }
})
</script>
