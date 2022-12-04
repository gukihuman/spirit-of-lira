<template lang="pug">
div(class='absolute right-2')
  button(@click='toggle()' class='text-white text-xl') Fullscreen
    
</template>

<script setup>
function toggle() {
  toggleFullscreen();
}
</script>
