<template lang="pug">
div(class="z-30")
  div(class="absolute w-[1920px] h-[1080px]")
  img(
    :src="INTERFACE.scene.main"
    draggable="false"
    class="absolute"
  )
</template>
<script setup lang="ts">
onMounted(() => {})
</script>
