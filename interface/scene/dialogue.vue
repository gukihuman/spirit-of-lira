<template lang="pug">
div(:style="mainStyle")
  choices(:layer="layer")
  textBox(v-if="SCENE.echo[layer].text !== ''" :layer="layer")
</template>
<script setup lang="ts">
const props = defineProps(["layer"])
const mainStyle = computed(() => {
    return {
        filter: `
      hue-rotate(${SCENE.echo[props.layer].hue}deg) 
      brightness(${SCENE.echo[props.layer].brightness})
    `,
    }
})
</script>
