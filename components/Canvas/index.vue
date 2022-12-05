<template lang="pug">
CanvasWrapper
  CanvasEntity(
    v-for='(entity, index) in entities'
    :key='index'
    :updateEach='gameFrame'

    :breed='entity.breed'
    :animState='entity.animState'
    :stateStartFrame='entity.stateStartFrame'
    :x='entity.x',
    :y='entity.y',
    :mirrored='entity.mirrored',

    :range='entity.range'
  )
</template>
<script setup>
const entities = computed(() => {
  return canvasStore().entities;
});
const gameFrame = computed(() => {
  return commonStore().gameFrame;
});
</script>
