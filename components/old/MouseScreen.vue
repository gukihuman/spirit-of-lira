<template lang="pug">
div(
  ref="mouseScreen"
  class="absolute z-50 w-full h-full opacity-0"
)
</template>
<script setup lang="ts">
const mouseScreen = ref(null)
onMounted(() => {
  Ref().mouseScreen = mouseScreen
  mouseListener()
})
</script>
