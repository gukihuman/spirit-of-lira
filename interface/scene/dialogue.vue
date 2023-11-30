<template lang="pug">
div(:style="mainStyle")
  choices(:layer="layer")
  textBox(v-if="SCENE_ACTIVE[layer].text !== ''" :layer="layer")
</template>
<script setup lang="ts">
const props = defineProps(["layer"])
const mainStyle = computed(() => {
  return {
    filter: `
      hue-rotate(${SCENE_ACTIVE[props.layer].hue}deg) 
      brightness(${SCENE_ACTIVE[props.layer].brightness})
    `,
  }
})
</script>
