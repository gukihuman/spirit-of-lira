<template lang="pug">
div(class='absolute right-2')
  button(@click='toggle()' :style='style'
  class='text-slate-900') Fullscreen
    
</template>

<script setup>
function toggle() {
  toggleFullscreen();
}
const style = computed(() => {
  return {
    "font-size": 36 * scale() + "px",
  };
});
</script>
