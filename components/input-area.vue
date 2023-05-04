<template lang="pug">
div(
  ref="background"
  class="absolute bottom-[170px] left-[400px] rounded-3xl opacity-25 border-8 border-sand-700 bg-gradient-to-t from-sand-300 to-sand-200 transition"
  :class="{ 'opacity-100': gsd.states.isInputFocused }"
  )
  textarea(
    ref="input"
    @input="updateInputSize()"
    @focus="turnFocusOn()"
    @blur="turnFocusOff()"
    placeholder="..."
    class="text-[26px] bg-sand-100 rounded-3xl focus:outline-none border-8 border-sand-300 p-5 pt-2 resize-none duration-100 ease-in-out text-bottom selected-text text-sand-700 leading-[1.3] font-semibold mt-[6px] mb-[3px] mx-[10px] shadow-md placeholder:text-sand-500"
  )
</template>

<script setup lang="ts">
const background: any = ref(null)
const input = ref(null)

const turnFocusOn = () => (gsd.states.isInputFocused = true)
const turnFocusOff = () => (gsd.states.isInputFocused = false)

const maxInputWidth = 1060
const minInputWidth = 200

const updateInputSize = () => {
  if (gsd.refs.input.scrollWidth < maxInputWidth) {
    gsd.refs.input.style.whiteSpace = "nowrap"
  }

  gsd.refs.input.style.width = "auto"
  gsd.refs.input.style.width = `${Math.min(
    gsd.refs.input.scrollWidth + 40,
    maxInputWidth
  )}px`

  if (gsd.refs.input.scrollWidth + 40 >= maxInputWidth) {
    gsd.refs.input.style.whiteSpace = "pre-wrap"
  } else {
    gsd.refs.input.style.whiteSpace = "nowrap"
  }

  gsd.refs.input.style.height = `${gsd.refs.input.scrollHeight + 5}px`
}

let updateInterval: any = null

onMounted(() => {
  gsd.refs.input = input
  updateInterval = setInterval(() => updateInputSize(), 50)
})

onUnmounted(() => {
  clearInterval(updateInterval)
})
</script>
<style>
.selected-text::selection {
  background-color: rgb(122, 56, 21);
  color: white;
}
</style>
