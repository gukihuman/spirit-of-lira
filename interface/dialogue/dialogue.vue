<template lang="pug">
div(:style="mainStyle")
  choicebox(
    :textboxWidth="textboxWidth"
    :textboxHeight="textboxHeight"
    :choiceboxWidth="choiceboxWidth"
    :choiceboxHeight="choiceboxHeight"
    :bgMargin="bgMargin"
    :unfocusedOpacity="unfocusedOpacity"
  )
  textbox(
    :textboxWidth="textboxWidth"
    :textboxHeight="textboxHeight"
    :bgMargin="bgMargin"
    :textSpeed="textSpeed"
  )
</template>
<script setup lang="ts">
const textboxWidth = 700
const textboxHeight = 220
const choiceboxWidth = 550
const choiceboxHeight = 80
const unfocusedOpacity = 0.3
const bgMargin = 8
const textSpeed = 50
const mainStyle = computed(() => {
  return {
    filter: `hue-rotate(${ACTIVE_SCENE.hue}deg)`,
  }
})
</script>
