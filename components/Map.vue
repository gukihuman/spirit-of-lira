<template lang="pug">
div(class='absolute' :style='style')
  img(:src='map' class='opacity-50 w-full')
</template>
<script setup>
import map from "@/assets/map.webp";
const style = computed(() => {
  let size = 6000 * scale() + "px";
  return {
    top: -1 * commonStore().mapOffset[1] + "px",
    left: -1 * commonStore().mapOffset[0] + "px",
    width: size,
    height: size,
  };
});
</script>
