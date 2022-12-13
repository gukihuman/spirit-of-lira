<template lang="pug">
div(class='text-start pt-3 mx-auto text-white \
max-w-md rounded-md px-2 \
bg-gradient-to-r from-slate-500/70 to-slate-500/0')
  p connected: {{ gamepadAPI.connected }}
  p buttonsStatus: {{ gamepadAPI.buttonsStatus }}
  p axesStatus: {{ gamepadAPI.axesStatus }}
  p(class='text-start mx-auto text-white \
max-w-md' v-for='(value, key, index) in heroArcher' key=index)
    p(v-if="key == 'X' || key == 'Y'") {{key}}: {{value.toFixed()}}
    p(v-else) {{key}}: {{value}}

</template>
<script setup>
let heroArcher = computed(() => {
  return entityStore().entities.find((entity) => entity.breed == "heroArcher");
});

let gamepadAPI = computed(() => {
  return gamepadStore();
});
</script>
