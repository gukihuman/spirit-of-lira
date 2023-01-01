<template lang="pug">
div(
  ref="mouseHandler"
  class="absolute w-full h-full opacity-0"
)
</template>
<script setup lang="ts">
const mouseHandler = ref(null)
onMounted(() => {
  Refs().mouseHandler = mouseHandler
  Refs().mouseHandler.addEventListener("mousemove", Listeners().mouseUpdate)
})
</script>
