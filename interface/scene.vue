<template lang="pug">
div(class="z-30")
  div(class="absolute w-[1920px] h-[1080px]")
  img(
    :src="SCENE.active"
    draggable="false"
    class="absolute"
  )
</template>
<script setup lang="ts">
onMounted(() => {
  console.log(SCENE.active)
})
</script>
