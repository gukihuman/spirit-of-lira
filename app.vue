<template lang="pug">

fullscreen(class="relative h-screen w-full bg-slate-800 flex items-center justify-center select-none")

  loading

  //- 1920 / 1080 centered game window
  transition: game-window(v-show="!SYSTEM_DATA.states.loadingScreen")

    //- 1920 / 1080 pixi viewport, where the actual game is
    viewport

    div(class="absolute z-10 overflow-hidden w-full h-full")
      bars
      transition(name="fast"): target(v-show="SYSTEM_DATA.states.target && !SYSTEM_DATA.states.inventory")

    div(class="absolute z-10 w-full h-full")
      transition: input-area(v-show="SYSTEM_DATA.states.input")
      transition: output-area(v-show="SYSTEM_DATA.states.output")

    //- output-area

    div(class="z-30"): transition
        inventory(v-show="SYSTEM_DATA.states.inventory")

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
