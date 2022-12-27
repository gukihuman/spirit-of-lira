<template lang="pug">

div
  DevTitle: div monitor
  DevLine
    div gameLoop
    div {{ gameLoop }}
  DevLine
    div gameLoopMax
    div {{ gameLoopMax }}

</template>
<script setup lang="ts">
const gameLoop = computed(() => {
  return l.mean(Monitor().gameLoop)?.toFixed(1)
})
const gameLoopMax = computed(() => {
  return l.max(Monitor().gameLoop)?.toFixed(1)
})
</script>
