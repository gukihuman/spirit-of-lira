<template lang="pug">
CanvasWrapper
  CanvasEntity(
    v-for='(entity, index) in entities'
    :key='index'
    :updateEach='gameFrame'
    :breed='entity.breed'
    :x='entity.x',
    :y='entity.y',
    :mirrored='entity.mirrored',
  )
</template>
<script setup>
const entities = computed(() => {
  return useCanvasStore().entities;
});
const gameFrame = computed(() => {
  return useCommonStore().gameFrame;
});
</script>
