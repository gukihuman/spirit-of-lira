<template lang="pug">
//- choice section
div(
  class="absolute flex flex-col-reverse justify-center gap-[15px]"
  :class="ACTIVE_SCENE.name !== 'a0-adult-check' ? 'animate-translate-y-menu' : 'animate-fade-in'"
  :style="mainStyle"
)
  //- choice boxes
  div(
    v-for="(choice, index) in ACTIVE_SCENE[props.layer].choices"
    :key="index"
    class="relative hover:scale-[1.03] transition duration-300 ease-in-out"
    :class="choiceBoxClass(choice)"
    :style="choiceBoxStyle"
    @mouseover="mouseover(index, choice)"
    @click="click(index)"
  )
    transition(:name="resolveChoiceTransition(index)")
      div(v-if="ACTIVE_SCENE.showChoiceBox")
        //- arrow icon
        div(class="absolute z-50 w-full h-full flex justify-end items-end bottom-[12px] right-[10px] opacity-[0.8]")
          img(
            v-if="choice.arrow"
            class="scale-[1] m-[2px]"
            :src="ASSETS.webps['arrow-icon']"
            )
        //- bulb icons
        div(
          v-if="choice.bulb"
          class="absolute z-50 w-full h-full flex justify-end items-end bottom-[10px] right-[10px] opacity-[0.8]"
        )
          img(
            v-if="PROGRESS.scenes.includes(choice.bulbScene)"
            class="scale-[1] m-[2px]"
            :src="ASSETS.webps['bulb-scene-on']"
            )
          img(
            v-if="!PROGRESS.scenes.includes(choice.bulbScene)"
            class="scale-[1] m-[2px]"
            :src="ASSETS.webps['bulb-scene-off']"
            )
        //- focus frame
        transition(name="fast"): focus-frame(:index="index")
        //- transparent border
        div(class="absolute rounded-3xl w-full h-full bg-gradient-to-b from-dark-gunmetal to-space-cadet opacity-[0.20]")
        //- internal choice box
        div(
          class="-z-10 absolute w-full h-full"
          :style="internalChoiceBoxStyle(index)"
        )
          div(class="w-full h-full rounded-2xl bg-gradient-to-b from-dark-gunmetal to-space-cadet")
        //- text
        p(class="py-5 mx-8 leading-10 font-semibold text-[28px] text-slate-300") {{ choice.text }}
        //- condition text
        div(
          v-if="hasCondition(choice) && !done(choice)"
          class="top-11 w-full h-full flex items-center pl-6"
        )
          div(class="ml-6 -mt-2 w-[80%] h-[50px] bg-slate-700/75 border-4 border-slate-600 rounded-xl saturate-[1.3]")
            p(class="mx-8 leading-10 font-semibold text-[28px] text-slate-300/80") {{ conditionText(choice) }}
</template>
<script setup lang="ts">
const props = defineProps(["layer"])
let preventClick = false
const resolveChoiceTransition = computed(() => {
  return (index) => {
    let name = "unfocused"
    if (ACTIVE_SCENE.focusedChoiceIndex === index) name = "focused"
    return name
  }
})
const mouseover = (index, choice) => {
  if (hasCondition.value(choice) && satisfied.value(choice)) {
    ACTIVE_SCENE.focusedChoiceIndex = index
  }
  if (!hasCondition.value(choice)) ACTIVE_SCENE.focusedChoiceIndex = index
}
const click = (index) => EVENTS.emitSingle("continue")
// otherwise there some random frame somehow apperas causing flickering
let accumulate = 0
const mainStyle = computed(() => {
  const marginX = (CONFIG.scene.textBoxWidth - CONFIG.scene.choiceBoxWidth) / 2
  const start = {
    "justify-content": "end",
    "margin-left": `${ACTIVE_SCENE[props.layer].x + marginX}px`,
    "padding-bottom": `${CONFIG.scene.choiceSectionMarginY}px`,
    width: `${CONFIG.scene.choiceBoxWidth}px`,
    height: `${ACTIVE_SCENE[props.layer].y}px`,
  }
  const center = {
    "margin-left": `${ACTIVE_SCENE[props.layer].x + marginX}px`,
    "padding-bottom": `${CONFIG.scene.choiceSectionMarginY}px`,
    width: `${CONFIG.scene.choiceBoxWidth}px`,
    height: "1000px",
  }
  let finalStyle = center
  if (
    !SCENE.menuScenes.includes(ACTIVE_SCENE.name.split("-")[0]) &&
    ACTIVE_SCENE.leaveMenuMS + 1000 < GLOBAL.elapsedMS
  ) {
    accumulate++
    if (accumulate > 10) finalStyle = start
  } else {
    accumulate = 0
    finalStyle = center
  }
  return finalStyle
})
const choiceBoxStyle = computed(() => {
  return {
    width: `${CONFIG.scene.choiceBoxWidth}px`,
    "min-height": `${CONFIG.scene.choiceBoxHeight}px`,
  }
})
const choiceBoxClass = computed(() => {
  return (choice) => {
    if (!choice.bulb) return
    const condition: Condition = SCENE.sceneConditions[choice.bulbScene]
    if (!condition) return
    return {
      "pointer-events-none": !condition.getCondition(),
    }
  }
})
const conditionText = computed(() => {
  return (choice) => {
    if (!choice.bulb) return
    const condition: Condition = SCENE.sceneConditions[choice.bulbScene]
    if (satisfied.value(choice)) return "✔ " + condition.getText()
    return condition.getText()
  }
})
const hasCondition = computed(() => {
  return (choice) => {
    if (!choice.bulb) return false
    const condition: Condition | null = SCENE.sceneConditions[choice.bulbScene]
    if (condition) return true
    return false
  }
})
const done = computed(() => {
  return (choice) => {
    if (!choice.bulb) return true
    if (PROGRESS.scenes.includes(choice.bulbScene)) return true
    return false
  }
})
const satisfied = computed(() => {
  return (choice) => {
    if (!choice.bulb) return false
    const condition: Condition | null = SCENE.sceneConditions[choice.bulbScene]
    if (!condition) return false
    return condition.getCondition()
  }
})
const internalChoiceBoxStyle = computed(() => {
  return (index) => {
    let opacity = CONFIG.scene.unfocusedChoiceBoxOpacity
    if (index === ACTIVE_SCENE.focusedChoiceIndex) {
      opacity = CONFIG.scene.focusedChoiceBoxOpacity
    }
    return {
      opacity: `${opacity}`,
      padding: `${CONFIG.scene.border}px`,
    }
  }
})
const focusedTransitionSpeed = computed(() => {
  return `all ${CONFIG.scene.transitionSpeed / 2}ms ease-out`
})
// time must be the same as focused leave, to not mess with layout so instead uses bezier that leave quicly */
const unfocusedTransitionSpeed = computed(() => {
  return `all ${
    CONFIG.scene.transitionSpeed / 2
  }ms cubic-bezier(0.37, 0.9, 0.31, 1.65)`
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
  transition: v-bind(focusedTransitionSpeed);
}
.unfocused-leave-active {
  transition: v-bind(unfocusedTransitionSpeed);
}
</style>
