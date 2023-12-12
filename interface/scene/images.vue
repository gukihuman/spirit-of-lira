<template lang="pug">
div
  img(
      v-for="(value, index) in SCENE.echo[props.layer].images"
      :key="index"
      :src="ASSETS.webp_paths[value]"
      draggable="false"
      class="absolute -z-10"
    )
</template>
<script setup lang="ts">
const props = defineProps(["layer"])
</script>
