<template lang="pug">
CanvasWrapper
  CanvasRanges(
    v-for='(entity, index) in entities'
    :key='index'
    :updateEach='gameFrame'

    :breed='entity.breed'
    :animState='entity.animState'
    :animStateStartFrame='entity.animStateStartFrame'
    :x='entity.x',
    :y='entity.y',
    :mirrored='entity.mirrored',

    :range='entity.range'
  )
  CanvasEntity(
    v-for='(entity, index) in entities'
    :key='index'
    :updateEach='gameFrame'

    :breed='entity.breed'
    :animState='entity.animState'
    :animStateStartFrame='entity.animStateStartFrame'
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
