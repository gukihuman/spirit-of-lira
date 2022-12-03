<template lang="pug">
//- background
div(class="bg-slate-800 h-screen w-screen")
  //- mainWindow
  div(:style='mainWindowStyle' class='bg-slate-700 m-auto absolute')

    div(class='absolute right-0 rounded-lg bg-lime-900 w-fit h-9 text-2xl \
    text-end px-2 m-2 font-mono text-lime-500') {{gameFrame}}
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
let gameFrame = computed(() => {
  return usePiniaStore().gameFrame;
});

function gameLoop() {
  setInterval(() => {
    usePiniaStore().gameFrame++;
    gamepadUpdate();
  }, 1000 / useSettingsStore().frameRate);
}
let gamepadAPI = computed(() => {
  return useGamepadStore();
});
onMounted(() => {
  updateMainWindowStyle();
  animSetup(); // adds info to AnimStore from raw JSON
  gameLoop();
  addEventListener("gamepadconnected", gamepadConnect);
  addEventListener("gamepaddisconnected", gamepadDisconnect);
});
</script>
<style>
::-webkit-scrollbar {
  display: none;
}
</style>
