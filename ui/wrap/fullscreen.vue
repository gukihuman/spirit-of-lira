<template lang="pug">
  
div(ref="fullscreen")
  slot

</template>
<script setup lang="ts">
//
const fullscreen = ref(null)
onMounted(() => {
  SYSTEM_DATA.refs.fullscreen = fullscreen
})
</script>
