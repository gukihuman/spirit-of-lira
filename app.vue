<template lang="pug">
//- background
div(ref='background' class="bg-slate-800 h-screen w-screen flex items-center \
justify-center")
  //- mainWindow
  div(:style='mainWindowStyle' class='bg-gray-500 \
  relative')
    Pause(v-if="componentStates.pause")
    Dev(v-if="componentStates.dev")
    Canvas
    ButtonFullscreen

</template>
<script setup>
let mainWindowStyle = computed(() => {
  let mainWindow = useCommonStore().mainWindow;
  return {
    width: mainWindow.width + "px",
    height: mainWindow.height + "px",
  };
});
let componentStates = computed(() => {
  return useCommonStore().componentStates;
});
const background = ref(null);

onMounted(() => {
  storeRef("background", background);
  mainWindowUpdate();
  listeners();
  animSetup(); // adds info to AnimStore from raw JSON
  gameLoop();
});
</script>
<style>
::-webkit-scrollbar {
  display: none;
}
</style>
