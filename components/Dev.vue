<template lang="pug">
div(class='absolute left-0 w-fit h-9 text-2xl max-w-[280px] \
flex items-start flex-col px-2 m-2 font-mono text-gray-300 z-30')

  div(class='w-fit bg-slate-600 px-2 rounded-md') {{ gameFrame }}
  div(class='text-start pt-3 mx-auto text-white text-2xl \
  max-w-md bg-slate-500/70 rounded-md px-2')
    p connected: {{ gamepadAPI.connected }}
    p buttonsStatus: {{ gamepadAPI.buttonsStatus }}
    p axesStatus: {{ gamepadAPI.axesStatus }}
    p(class='text-start mx-auto text-white text-xl \
  max-w-md leading-5' v-for='(value, key, index) in heroArcher' key=index)
      p(v-if="key == 'X' || key == 'Y'") {{key}}: {{value.toFixed()}}
      p(v-else) {{key}}: {{value}}

</template>
<script setup>
let gameFrame = computed(() => {
  return commonStore().gameFrame;
});
let heroArcher = computed(() => {
  return entityStore().entities.find((entity) => entity.breed == "heroArcher");
});

let gamepadAPI = computed(() => {
  return gamepadStore();
});
</script>
