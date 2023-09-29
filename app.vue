<template lang="pug">
fullscreen
  loading
  transition: game-window(v-show="!GLOBAL.loading" class="cursor-none")
    viewport
    transition: overlay(v-show="INTERFACE.overlay")
    transition: inventory(v-show="INTERFACE.inventory")
    transition(name="scene"): scene(v-show="GLOBAL.context === 'scene'")
</template>
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
  transition: opacity 50ms ease;
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
