<template lang="pug">
div(
  v-for="(entity, index) in Game().entities" :key="index"
)
  div(
    class='absolute opacity-30 bg-gray-600 rounded-full'
    :style='sizeStyle(entity)'
  )

</template>
<script setup>
import range from "@/assets/range.webp"

const sizeStyle = (entity) => {
  let style = {
    left: entity.x - Map().offset[0] - entity.size + "px",
    top: entity.y - Map().offset[1] - entity.size + "px",
    width: entity.size * 2 + "px",
    height: entity.size * 2 + "px",
  }
  entity.isHeroTarget ? (style.background = "black") : {}
  return style
}
</script>
