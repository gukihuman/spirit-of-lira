<template lang="pug">

div(class="relative text-gray-300")
  button(@click="toggle()")
    SvgFullscreen

</template>
<script setup>
function toggle() {
  toggleFullscreen()
}
</script>
