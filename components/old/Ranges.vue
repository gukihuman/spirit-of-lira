<template lang="pug">
div
  div(
    v-for="(entity, index) in Game().entities" :key="index"
  )
    img(
      :src='range'
      class='absolute opacity-40 animate-spin'
      :style="rangeStyle(entity)"
    )

</template>
<script setup>
import range from "@/assets/range.webp"

const rangeStyle = (entity) => {
  let time = entity.range / 5
  if (entity.range > 150) {
    time = 100
  } else {
    time = 40
  }
  return {
    left: entity.x - Map().offset[0] - entity.range + "px",
    top: entity.y - Map().offset[1] - entity.range + "px",
    width: entity.range * 2 + "px",
    animation: `spin ${time}s linear infinite`,
  }
}
</script>
