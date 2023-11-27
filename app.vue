<template lang="pug">
fullscreen(mark="fullscreen")
  loading(mark="loading")
  tn: game-window(mark="game-window" :class="classObject")
    viewport(mark="viewport")
    tn: overlay(mark="overlay")
    tn: inventory(mark="inventory")
    tn: settings(mark="settings")
    tn(type="long"): scene(mark="scene")
    tn: audiomessage(mark="audiomessage")
    cursor(mark="cursor" v-if="GLOBAL.firstUserGesture")
</template>
<script setup lang="ts">
const classObject = computed(() => {
  return { "cursor-none": GLOBAL.firstUserGesture }
})
</script>
<style>
.long-enter-active,
.long-leave-active {
  transition: opacity 1000ms ease;
}
.long-enter-from,
.long-leave-to {
  opacity: 0;
}
.swipe-enter-active,
.swipe-leave-active {
  transition: all 200ms ease;
}
.swipe-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.swipe-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.fast-enter-active,
.fast-leave-active {
  transition: opacity 70ms ease;
}
.fast-enter-from,
.fast-leave-to {
  opacity: 0;
}
.default-enter-active,
.default-leave-active {
  transition: opacity 200ms ease;
}
.default-enter-from,
.default-leave-to {
  opacity: 0;
}
/* disable scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>
