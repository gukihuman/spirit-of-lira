<template lang="pug">
div(:style="mainStyle")
  //- choiceboxes
  div(
    class="absolute flex flex-col-reverse justify-start"
    :style="choiceblockStyle"
  )
    div(
      v-for="(choice, index) in ACTIVE_SCENE.choices"
      :key="index"
      class="relative"
      :style="choiceboxStyle"
      @mouseover="mouseOver(index)"
    )
      div(class="absolute z-50 w-full h-full flex justify-end items-end")
        img(
          v-if="choice.arrow"
          class="scale-[0.8] m-[2px]"
          :src="ASSETS.webps['arrow-icon']"
          )
      transition: focus-border(:index="index", :choiceboxWidth="choiceboxWidth")
      //- bg
      div(class="absolute rounded-3xl w-full h-full bg-gradient-to-b from-dark-gunmetal to-space-cadet opacity-[0.20]")
      div(
        class="-z-10 absolute w-full h-full transition-all"
        :style="internalChoiceboxBgStyle(index)"
      )
        div(
          class="rounded-2xl w-full h-full bg-gradient-to-b from-dark-gunmetal to-space-cadet"
        )
      p(
        class="my-5 mx-8 leading-10 font-semibold text-[28px] text-slate-300"
      ) {{ choice.text }}
  //- textbox
  div(
    class="absolute"
    :style="textboxStyle"
  )
    //- bg
    div(class="absolute rounded-3xl w-full h-full bg-gradient-to-b from-dark-gunmetal to-space-cadet opacity-[0.20]")
    div(
      class="-z-10 absolute opacity-[0.65]"
      :style="internalTextboxBgStyle"
    )
      div(
      class="rounded-3xl w-full h-full bg-gradient-to-b from-dark-gunmetal to-space-cadet "
      )
    p(
      class="my-7 mx-11 leading-10 font-semibold text-[28px] text-slate-300"
    ) {{ ACTIVE_SCENE.text }}
</template>
<script setup lang="ts">
const textboxWidth = 700
const textboxHeight = 220
const choiceboxWidth = 550
const choiceboxHeight = 80
const bgMargin = 8
const choiceGap = 15
const choiceblockGap = 30
const unfocusedOpacity = 0.3
const x = ACTIVE_SCENE.x
const y = ACTIVE_SCENE.y
const hue = ACTIVE_SCENE.hue
const mouseOver = (index: number) => {
  ACTIVE_SCENE.focusedChoice = index
}
const mainStyle = computed(() => {
  return {
    filter: `hue-rotate(${hue}deg)`,
  }
})
const choiceblockStyle = computed(() => {
  return {
    "margin-left": `${x + (textboxWidth - choiceboxWidth) / 2}px`,
    "padding-bottom": `${choiceblockGap}px`,
    height: `${y}px`,
    width: `${choiceboxWidth}px`,
    gap: `${choiceGap}px`,
  }
})
const choiceboxStyle = computed(() => {
  return {
    width: `${choiceboxWidth}px`,
    "min-height": `${choiceboxHeight}px`,
  }
})
const internalChoiceboxBgStyle = computed(() => {
  return (index) => {
    let opacity = unfocusedOpacity
    if (index === ACTIVE_SCENE.focusedChoice) opacity = 0.65
    return {
      opacity: `${opacity}`,
      padding: `${bgMargin}px`,
    }
  }
})
const textboxStyle = computed(() => {
  return {
    "margin-left": `${x}px`,
    "margin-top": `${y}px`,
    width: `${textboxWidth}px`,
    height: `${textboxHeight}px`,
  }
})
const internalTextboxBgStyle = computed(() => {
  return {
    margin: `${bgMargin}px`,
    width: `${textboxWidth - bgMargin * 2}px`,
    height: `${textboxHeight - bgMargin * 2}px`,
  }
})
</script>
