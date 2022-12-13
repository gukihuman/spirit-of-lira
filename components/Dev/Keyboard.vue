<template lang="pug">
div( class='absolute left-[360px] w-fit text-3xl leading-8 max-w-[380px] \
  flex items-start flex-col px-2 m-2 font-mono text-white z-30 \
  rounded-md \
  bg-gradient-to-r from-slate-500/70 to-slate-500/0')
  div(class='text-start mx-auto w-[380px]' )
    p fullscreen: {{ fullscreen }}
  div(class='text-start mx-auto w-[380px]' v-for='(value, key, index) in keyStates' key=index)
    p {{key}}: {{value}}

</template>
<script setup>
let fullscreen = computed(() => {
  return keyboardStore().fullscreen;
});
let keyStates = computed(() => {
  return keyboardStore().states;
});
</script>
