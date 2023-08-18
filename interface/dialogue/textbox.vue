<template lang="pug">
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
  transition: div(
    v-show="ACTIVE_SCENE.showText"
    class="my-7 mx-11 leading-10 font-semibold text-[28px] text-slate-300"
  )
    span(
      v-for='(word, index) in textArray'
      :key='index'
      class='opacity-0 cursor-default'
      :style='spanStyle(index)'
    ) {{ word + " " }}
</template>
<script setup lang="ts">
const props = defineProps([
  "bgMargin",
  "textboxWidth",
  "textboxHeight",
  "textSpeed",
])
const textArray = computed(() => {
  if (ACTIVE_SCENE.text.includes(" ")) {
    let array = [].concat(ACTIVE_SCENE.text.split(" "))
    let newArray: string[] = []
    array.forEach((word) => {
      if (word === "/") {
        newArray.push("", "")
      } else {
        newArray.push(word)
      }
    })
    return newArray
  } else {
    return [ACTIVE_SCENE.text]
  }
})
const textboxStyle = computed(() => {
  return {
    "margin-left": `${ACTIVE_SCENE.x}px`,
    "margin-top": `${ACTIVE_SCENE.y}px`,
    width: `${props.textboxWidth}px`,
    height: `${props.textboxHeight}px`,
  }
})
const internalTextboxBgStyle = computed(() => {
  return {
    margin: `${props.bgMargin}px`,
    width: `${props.textboxWidth - props.bgMargin * 2}px`,
    height: `${props.textboxHeight - props.bgMargin * 2}px`,
  }
})
const spanStyle = computed(() => {
  return (index) => {
    return {
      animation: `fade-in ${(0.8 - props.textSpeed / 180).toFixed(1)}s ${
        ((index / 10) * (100 - props.textSpeed)) / 25
      }s forwards cubic-bezier(0.11, 0, 0.5, 0)`,
      filter: "blur(1px)",
    }
  }
})
</script>
<style>
@keyframes fade-in {
  100% {
    opacity: 1;
    filter: blur(0);
  }
}
</style>
