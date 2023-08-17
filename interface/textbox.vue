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
        div(
          class="absolute w-full h-full g flex justify-center items-center overflow-hidden"
        )
        p(
          class="py-5 mx-8 leading-10 font-semibold text-[28px] text-slate-300"
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
const textSpeed = 50
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
const spanStyle = computed(() => {
  return (index) => {
    return {
      animation: `fade-in ${(0.8 - textSpeed / 180).toFixed(1)}s ${
        ((index / 10) * (100 - textSpeed)) / 25
      }s forwards cubic-bezier(0.11, 0, 0.5, 0)`,
      filter: "blur(1px)",
    }
  }
})
const mouseOver = (index) => {
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
<style>
@keyframes fade-in {
  100% {
    opacity: 1;
    filter: blur(0);
  }
}
@keyframes fade-out {
  100% {
    opacity: 0;
  }
}
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
