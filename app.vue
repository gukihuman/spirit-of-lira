<template lang="pug">

wrap-fullscreen(class="relative h-screen w-full bg-slate-800 flex items-center justify-center select-none")

  loading

  //- centered game window
  transition: wrap-game-window(v-show="!GLOBAL.loadingScreen")

    //- pixi viewport, where the actual game is
    wrap-viewport

    div(class="absolute z-10 overflow-hidden w-full h-full")
      bars
      transition(name="fast"): target(v-show="INTERFACE.target && !INTERFACE.inventory")

    div(class="absolute z-10 w-full h-full")
      transition: input-area(v-show="INTERFACE.input")
      transition: output-area(v-show="GLOBAL.output")

    //- output-area

    div(class="z-30"): transition
        inventory(v-show="INTERFACE.inventory")

</template>

<script setup>
onMounted(() => {})
</script>

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
