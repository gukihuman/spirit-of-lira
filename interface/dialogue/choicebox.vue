<template lang="pug">
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
    @click="handleClick(index)"
  )
    transition(:name="clickedIndex === index || clickedIndex === -1 ? 'long' : 'short'"): div(
      v-if="ACTIVE_SCENE.showChoicebox"
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
          class="rounded-2xl w-full h-full bg-gradient-to-b from-dark-gunmetal to-space-cadet transition-all"
        )
      p(
        class="py-5 mx-8 leading-10 font-semibold text-[28px] text-slate-300"
      ) {{ choice.text }}
</template>
<script setup lang="ts">
const props = defineProps([
  "bgMargin",
  "textboxWidth",
  "textboxHeight",
  "choiceboxWidth",
  "choiceboxHeight",
  "unfocusedOpacity",
])
const choiceGap = 15
const choiceblockGap = 30
let preventClick = false
let clickedIndex = ref(-1)
const handleClick = (index) => {
  if (preventClick) return
  preventClick = true
  ACTIVE_SCENE.showChoicebox = false
  clickedIndex.value = index
  ACTIVE_SCENE.showText = false
  setTimeout(() => {
    ACTIVE_SCENE.text = "Well, here. / Happy?"
    ACTIVE_SCENE.showText = true
  }, 300)
  setTimeout(() => {
    preventClick = false
    ACTIVE_SCENE.showChoicebox = true
    ACTIVE_SCENE.choices = [
      {
        text: "Not quite.",
        part: "",
        arrow: false,
      },
      {
        text: "Yeah. Good girl.",
        part: "s1-end",
        arrow: true,
      },
    ]
    clickedIndex.value = -1
  }, 1000)
}
const mouseOver = (index) => {
  ACTIVE_SCENE.focusedChoice = index
}
const choiceblockStyle = computed(() => {
  return {
    "margin-left": `${
      ACTIVE_SCENE.x + (props.textboxWidth - props.choiceboxWidth) / 2
    }px`,
    "padding-bottom": `${choiceblockGap}px`,
    height: `${ACTIVE_SCENE.y}px`,
    width: `${props.choiceboxWidth}px`,
    gap: `${choiceGap}px`,
  }
})
const choiceboxStyle = computed(() => {
  return {
    width: `${props.choiceboxWidth}px`,
    "min-height": `${props.choiceboxHeight}px`,
  }
})
const internalChoiceboxBgStyle = computed(() => {
  return (index) => {
    let opacity = props.unfocusedOpacity
    if (index === ACTIVE_SCENE.focusedChoice) opacity = 0.65
    return {
      opacity: `${opacity}`,
      padding: `${props.bgMargin}px`,
    }
  }
})
</script>
<style>
.long-enter-active,
.long-leave-active {
  transition: all 1s ease-out;
}
.long-enter-from {
  opacity: 0;
}
.long-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.short-enter-active,
.short-leave-active {
  transition: all 1000ms cubic-bezier(0.37, 0.9, 0.31, 1.65); /* custom */
}
.short-enter-from,
.short-leave-to {
  opacity: 0;
}
</style>
