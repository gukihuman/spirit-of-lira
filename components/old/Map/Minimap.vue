<template lang="pug">
img(:src='minimap' class='absolute' :style='style')
</template>
<script setup>
import minimap from "@/assets/minimap.webp"
const style = computed(() => {
  let size = 200 + "px"
  let right = 100 + "px"
  let top = 20 + "px"
  return {
    width: size,
    height: size,
    right: right,
    top: top,
  }
})
</script>
