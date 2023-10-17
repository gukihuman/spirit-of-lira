<template lang="pug">
div(:style="mainStyle")
  choices(:layer="layer")
  textBox(v-if="ACTIVE_SCENE[layer].text !== ''" :layer="layer")
</template>
<script setup lang="ts">
const props = defineProps(["layer"])
const mainStyle = computed(() => {
  return {
    filter: `
      hue-rotate(${ACTIVE_SCENE[props.layer].hue}deg) 
      brightness(${ACTIVE_SCENE[props.layer].brightness})
    `,
  }
})
</script>
