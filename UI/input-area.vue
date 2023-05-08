<template lang="pug">
div(
  ref="background"
  class="absolute bottom-[170px] left-[400px] rounded-3xl opacity-50 border-8 border-sand-700 bg-gradient-to-t from-sand-400 to-sand-200 transition"
  :class="{ 'opacity-100': gsd.states.inputFocus }"
  )
  textarea(
    ref="input"
    @input="updateInputSize()"
    @focus="turnFocusOn()"
    @blur="turnFocusOff()"
    placeholder="..."
    class="text-[26px] bg-sand-100 rounded-3xl focus:outline-none border-8 border-sand-300 px-[16px] pb-[20px] pt-[6px] resize-none duration-100 ease-in-out text-bottom selected-text text-sand-700 leading-[1.2] font-semibold mt-[6px] mb-[2px] mx-[10px] shadow-md placeholder:text-sand-500 selection:bg-sand-700 selection:text-sand-100"
  )
  img(
    src="@/assets/inventory/send.webp"
    draggable="false"
    class="absolute bottom-[-20px] right-[-52px] cursor-pointer hover:brightness-125"
    @click="sendInput()"
  )
</template>

<script setup lang="ts">
const background: any = ref(null)
const input = ref(null)

const turnFocusOn = () => (gsd.states.inputFocus = true)
const turnFocusOff = () => (gsd.states.inputFocus = false)
const sendInput = () => console.log("eo")

const maxInputWidth = 1052

const updateInputSize = () => {
  if (!gsd.refs.input) return
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
