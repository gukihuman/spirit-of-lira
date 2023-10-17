<template lang="pug">
div
  img(
      v-for="(value, index) in ACTIVE_SCENE[props.layer].images"
      :key="index"
      :src="ASSETS.webps[value]"
      draggable="false"
      class="absolute -z-10"
    )
</template>
<script setup lang="ts">
const props = defineProps(["layer"])
</script>
