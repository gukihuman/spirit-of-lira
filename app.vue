<template lang="pug">

fullscreen(class="h-screen w-screen bg-slate-800 flex items-center justify-center select-none")

  //- 1920 / 1080 centered game window
  game-window

    //- 1920 / 1080 pixi viewport, where the actual game is
    viewport

    div(class="z-10")
      bars

    div(class="z-10")
      transition
        input-area(v-if="SYSTEM_DATA.states.input")

    //- output-area

    div(class="z-30")
      transition
        inventory(v-if="SYSTEM_DATA.states.inventory")

    //- loading screen on top of everything
    div(class="z-50")
      transition
        loading(v-if="SYSTEM_DATA.states.loadingScreen")

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
