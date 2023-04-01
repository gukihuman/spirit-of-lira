<template lang="pug">

div(class="absolute right-3 top-3 text-gray-300")
  button(@click="toggle()")
    svg-fullscreen

</template>
<script setup>
function toggle() {
  toggleFullscreen()
}
</script>
