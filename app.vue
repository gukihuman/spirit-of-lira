<template lang="pug">
//- background
div(class="bg-slate-800 h-screen w-screen")
  //- mainWindow
  div(:style='mainWindowStyle' class='bg-slate-700 m-auto absolute')
    div(class='absolute right-0 rounded-lg bg-lime-900 w-fit h-9 text-2xl \
    text-end px-2 m-2 font-mono text-lime-500') {{gameFrame.value}}
    div(class='text-center pt-3 mx-auto text-white text-3xl max-w-md') {{gamepadAPI}}
</template>
<script setup>
let mainWindowStyle = computed(() => {
  let style = usePiniaStore().mainWindowStyle;
  return {
    width: style.width + "px",
    height: style.height + "px",
    top: style.top + "px",
    left: style.left + "px",
  };
});
let gameFrame = reactive({ value: 0 });
let gamepadAPI = reactive(useGamepadSetup());
function updateGameFrame() {
  setInterval(() => {
    gameFrame.value++;
    gamepadAPI.update();
  }, 1000 / 60);
}
onMounted(() => {
  addEventListener("gamepadconnected", gamepadAPI.connect);
  addEventListener("gamepaddisconnected", gamepadAPI.disconnect);
  updateMainWindowStyle();
  updateGameFrame();
});
</script>
<style>
::-webkit-scrollbar {
  display: none;
}
</style>
