<template lang="pug">
fullscreen
  loading
  tn: game-window(v-show="!GLOBAL.loading" :class="gameWindowClasses")
    viewport
    tn: overlay(v-show="INTERFACE.overlay")
    tn: inventory(v-show="INTERFACE.inventory")
    tn: settings(v-show="INTERFACE.settings")
    tn(name="scene"): scene(v-show="GLOBAL.context === 'scene'")
    tn: audiomessage(v-if="!GLOBAL.firstUserGesture")
    cursor(v-if="GLOBAL.firstUserGesture")
</template>
<script setup lang="ts">
const gameWindowClasses = computed(() => {
  return { "cursor-none": GLOBAL.firstUserGesture }
})
</script>

<style>
.scene-enter-active,
.scene-leave-active {
  transition: opacity 1000ms ease;
}
.scene-enter-from,
.scene-leave-to {
  opacity: 0;
}
.fast-enter-active,
.fast-leave-active {
  transition: opacity 70ms ease;
}
.fast-enter-from,
.fast-leave-to {
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 200ms ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
/* disable scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>
