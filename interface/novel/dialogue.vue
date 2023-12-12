<template lang="pug">
div(:style="mainStyle")
  choices(:layer="layer")
  textBox(v-if="NOVEL.echo[layer].text !== ''" :layer="layer")
</template>
<script setup lang="ts">
const props = defineProps(["layer"])
const mainStyle = computed(() => {
    return {
        filter: `
      hue-rotate(${NOVEL.echo[props.layer].hue}deg) 
      brightness(${NOVEL.echo[props.layer].brightness})
    `,
    }
})
</script>
