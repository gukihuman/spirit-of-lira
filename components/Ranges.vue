<template lang="pug">
img(
  v-for="(entity, index) in Game().entities" :key="index"

  :src='entity.range > 150 ? range : melee'
  class='absolute opacity-60 animate-spin'
  :style="style(entity)"
)

</template>
<script setup>
import range from "@/assets/range.webp"
import melee from "@/assets/melee.webp"

const style = (entity) => {
  let time
  entity.range > 150 ? (time = 100) : (time = 35)
  return {
    left: entity.x - Map().offset[0] - entity.range + "px",
    top: entity.y - Map().offset[1] - entity.range + "px",
    width: entity.range * 2 + "px",
    animation: `spin ${time}s linear infinite`,
  }
}
</script>
