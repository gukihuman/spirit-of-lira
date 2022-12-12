<template lang="pug">
div(class='absolute' :style='style')
  img(:src='map' class='opacity-50 w-full')
MapCollision

</template>
<script setup>
import map from "@/assets/map.webp";
const style = computed(() => {
  let size = 6000 + "px";
  return {
    top: Number(-1 * commonStore().mapOffset[1]).toFixed() + "px",
    left: Number(-1 * commonStore().mapOffset[0]).toFixed() + "px",
    width: size,
    height: size,
  };
});
</script>
