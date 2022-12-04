<template lang="pug">
div(class='absolute right-0 rounded-lg bg-lime-900 w-fit h-9 text-2xl \
text-end px-2 m-2 font-mono text-lime-500 z-30') {{ gameFrame }}
  div(class='text-center pt-3 mx-auto text-white text-3xl \
  max-w-md') {{ gamepadAPI }}
</template>
<script setup>
let gameFrame = computed(() => {
  return useCommonStore().gameFrame;
});

let gamepadAPI = computed(() => {
  return useGamepadStore();
});
</script>
