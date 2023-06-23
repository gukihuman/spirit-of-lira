<template lang="pug">

fullscreen(class="h-screen w-screen bg-slate-800 flex items-center justify-center select-none")

  loading

  //- 1920 / 1080 centered game window
  transition: game-window(v-show="!REACTIVE.states.loadingScreen")

    //- 1920 / 1080 pixi viewport, where the actual game is
    viewport

    div(class="z-10")
      bars
      transition: target(v-show="true")

    div(class="z-10"): transition
        input-area(v-show="REACTIVE.states.input")

    //- output-area

    div(class="z-30"): transition
        inventory(v-show="REACTIVE.states.inventory")

</template>

<script setup>
onMounted(() => {})
</script>

<style>
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
