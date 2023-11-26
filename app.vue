<template lang="pug">
fullscreen(mark="fullscreen")
  loading(mark="loading")
  tn: game-window(mark="game-window"
    v-show="!GLOBAL.loading" :class="gameWindowClasses")
    viewport(mark="viewport")
    tn: overlay(mark="overlay" v-show="INTERFACE.overlay")
    tn: inventory(mark="inventory" v-show="INTERFACE.inventory")
    tn: settings(mark="settings" v-show="INTERFACE.settings")
    tn(type="long"): scene(mark="scene" v-show="GLOBAL.context === 'scene'")
    tn: audiomessage(mark="audiomessage" v-if="!GLOBAL.firstUserGesture")
    cursor(mark="cursor" v-if="GLOBAL.firstUserGesture")
</template>
<script setup lang="ts">
const gameWindowClasses = computed(() => {
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
