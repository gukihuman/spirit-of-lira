<template lang="pug">
//- choice section
div(
  class="absolute flex flex-col-reverse justify-start"
  :style="mainStyle"
)
  //- choice boxes
  div(
    v-for="(choice, index) in ACTIVE_SCENE.choices"
    :key="index"
    class="relative"
    :style="choiceBoxStyle"
    @mouseover="mouseover(index)"
    @click="click(index)"
  )
    transition(:name="resolveChoiceTransition(index)")
      div(v-if="ACTIVE_SCENE.showChoiceBox")
        //- arrow icon
        div(class="absolute z-50 w-full h-full flex justify-end items-end")
          img(
            v-if="choice.arrow"
            class="scale-[0.8] m-[2px]"
            :src="ASSETS.webps['arrow-icon']"
            )
        //- focus frame
        transition: focus-frame(:index="index")
        //- transparent border
        div(class="absolute rounded-3xl w-full h-full bg-gradient-to-b from-dark-gunmetal to-space-cadet opacity-[0.20]")
        //- internal choice box
        div(
          class="-z-10 absolute w-full h-full"
          :style="internalChoiceBoxStyle(index)"
        )
          div(class="w-full h-full rounded-2xl bg-gradient-to-b from-dark-gunmetal to-space-cadet")
        //- text
        p(
          class="py-5 mx-8 leading-10 font-semibold text-[28px] text-slate-300"
        ) {{ choice.text }}
</template>
<script setup lang="ts">
const props = defineProps([
  "layer",
  "choiceBoxWidth",
  "choiceBoxHeight",
  "border",
  "marginX",
  "marginY",
  "unfocusedChoiceIndexBoxOpacity",
  "choiceBoxesGap",
])
let preventClick = false
const resolveChoiceTransition = computed(() => {
  return (index) => {
    let name = "unfocused"
    if (ACTIVE_SCENE.activatedChoiceIndex === index) name = "focused"
    return name
  }
})
const mouseover = (index) => (ACTIVE_SCENE.focusedChoiceIndex = index)
const click = (index) => EVENTS.emitSingle("continue")
const mainStyle = computed(() => {
  return {
    "margin-left": `${ACTIVE_SCENE[props.layer].x + props.marginX}px`,
    "padding-bottom": `${props.marginY}px`,
    width: `${props.choiceBoxWidth}px`,
    height: `${ACTIVE_SCENE[props.layer].y}px`,
    gap: `${props.choiceBoxesGap}px`,
  }
})
const choiceBoxStyle = computed(() => {
  return {
    width: `${props.choiceBoxWidth}px`,
    "min-height": `${props.choiceBoxHeight}px`,
  }
})
const internalChoiceBoxStyle = computed(() => {
  return (index) => {
    let opacity = props.unfocusedChoiceIndexBoxOpacity
    if (index === ACTIVE_SCENE.focusedChoiceIndex) opacity = 0.65
    return {
      opacity: `${opacity}`,
      padding: `${props.border}px`,
    }
  }
})
</script>
<style>
.focused-enter-from,
.unfocused-enter-from,
.unfocused-leave-to {
  opacity: 0;
}
.focused-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.unfocused-enter-active,
.focused-enter-active {
  transition: all 200ms ease-out;
}
.focused-leave-active {
  transition: all 1000ms ease-out;
}
.unfocused-leave-active {
  /* time must be the same as focused leave, to not mess with layout */
  /* instead uses bezier that leave quicly */
  transition: all 1000ms cubic-bezier(0.37, 0.9, 0.31, 1.65);
}
</style>
