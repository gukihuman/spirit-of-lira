<template lang="pug">
div(class="z-30 relative")
  img(
    v-for="(value, index) in SCENE.activeImages"
    :key="index"
    :src="ASSETS.webps[value]"
    draggable="false"
    class="absolute"
  )
</template>
<script setup lang="ts">
onMounted(() => {})
</script>
