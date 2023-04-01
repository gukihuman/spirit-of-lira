<template lang="pug">

//- 1920 / 1080 centered game window
game-window

  //- 1920 / 1080 pixi viewport, where the actual game is
  viewport

  //- 📜 Some interface elements

  //- loading screen on top of everything
  transition(name="fast")
    loading(v-if="!States().allLoaded")

</template>

<script setup>
//
onMounted(() => {
  //
  startup()
})
</script>

<style>
/* 
/* "fast" transition */
.fast-enter-active,
.fast-leave-active {
  transition: opacity 0.5s ease;
}

.fast-enter-from,
.fast-leave-to {
  opacity: 0;
}

/* disable scrollbar */
::-webkit-scrollbar {
  display: none;
}

/* disable text selection */
* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
