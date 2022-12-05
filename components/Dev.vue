<template lang="pug">
div(class='absolute left-0 w-fit h-9 text-2xl \
flex items-start flex-col px-2 m-2 font-mono text-gray-300 z-30')
  div(class='w-fit bg-slate-600 px-2 rounded-md') {{ gameFrame }}
  div(class='text-start pt-3 mx-auto text-white text-2xl \
  max-w-md')
    p connected: {{ gamepadAPI.connected }}
    p buttonsStatus: {{ gamepadAPI.buttonsStatus }}
    p axesStatus: {{ gamepadAPI.axesStatus }}
</template>
<script setup>
let gameFrame = computed(() => {
  return useCommonStore().gameFrame;
});

let gamepadAPI = computed(() => {
  return useGamepadStore();
});
</script>
