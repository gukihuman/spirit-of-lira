<template lang="pug">
  
div(ref="fullscreen")
  slot

</template>
<script setup lang="ts">
//
const fullscreen = ref(null)
onMounted(() => {
  REACTIVE.refs.fullscreen = fullscreen
})
</script>
