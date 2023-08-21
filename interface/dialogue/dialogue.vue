<template lang="pug">
div(:style="mainStyle")
  choice-section(
    :layer="layer"
    :choiceBoxWidth="choiceBoxWidth"
    :choiceBoxHeight="choiceBoxHeight"
    :border="border"
    :marginX="(textBoxWidth - choiceBoxWidth) / 2"
    :marginY="choiceSectionMarginY"
    :unfocusedChoiceIndexBoxOpacity="unfocusedChoiceIndexBoxOpacity"
    :choiceBoxesGap="choiceBoxesGap"
  )
  textBox(
    :layer="layer"
    :width="textBoxWidth"
    :height="textBoxHeight"
    :border="border"
    :textSpeed="textSpeed"
  )
</template>
<script setup lang="ts">
const props = defineProps(["layer"])
const textBoxWidth = 700
const textBoxHeight = 220
const choiceBoxWidth = 550
const choiceBoxHeight = 80
const choiceBoxesGap = 15
const choiceSectionMarginY = 30
const unfocusedChoiceIndexBoxOpacity = 0.3 // focused is hardcoded to 0.65
const border = 10
const textSpeed = 70
const mainStyle = computed(() => {
  return {
    filter: `hue-rotate(${ACTIVE_SCENE.hue}deg)`,
  }
})
</script>
