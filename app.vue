<template lang="pug">
fullscreen
  loading
  transition: game-window(v-show="!GLOBAL.loading")
    viewport
    transition: overlay(v-show="INTERFACE.overlay")
    transition: inventory(v-show="INTERFACE.inventory")
    transition: scene(v-show="GLOBAL.context === 'scene'")
</template>
<style>
.fast-enter-active,
.fast-leave-active {
  transition: opacity 0.05s ease;
}
.fast-enter-from,
.fast-leave-to {
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
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
