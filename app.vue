<template lang="pug">
//- background
div(ref='background' class="bg-slate-800 h-screen w-screen flex items-center \
justify-center")
  //- mainWindow
  div(:style='mainWindowStyle' class='bg-gray-500 relative overflow-hidden')
    Map
    Pause(v-if="states.pause")
    Dev(v-if="states.dev")
    Canvas
    Minimap
    ButtonFullscreen

</template>
<script setup>
let mainWindowStyle = computed(() => {
  let mainWindow = commonStore().mainWindow;
  return {
    width: mainWindow.width + "px",
    height: mainWindow.height + "px",
  };
});
let states = computed(() => {
  return commonStore().states;
});
const background = ref(null);

onMounted(() => {
  storeRef("background", background);
  mainWindowUpdate();
  listeners();
  animSetup(); // adds info to AnimStore from raw JSON
  gameLoop();

  generateEntity("heroArcher", 960, 540);
  generateEntity("goblin", 1550, 450);
});
</script>
<style>
::-webkit-scrollbar {
  display: none;
}
* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
