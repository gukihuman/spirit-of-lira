<template lang="pug">
div(
  ref="background"
  class="absolute bottom-[170px] left-[400px] rounded-3xl opacity-50 border-4 border-sand-700 bg-gradient-to-t from-sand-400 to-sand-200 transition"
  :class="{ 'opacity-100': REACTIVE.states.inputFocus }"
  )
  textarea(
    ref="input"
    @input="updateInputSize()"
    @focus="REACTIVE.states.inputFocus = true"
    @blur="REACTIVE.states.inputFocus = false"
    placeholder="..."
    class="text-[26px] bg-sand-100 rounded-3xl focus:outline-none border-[6px] border-sand-300 px-[16px] pb-[16px] pt-[8px] resize-none time-100 ease-in-out text-bottom selected-text text-sand-700 leading-[1.2] font-semibold mt-[6px] mb-[2px] mx-[10px] shadow-md placeholder:text-sand-500 selection:bg-sand-700 selection:text-sand-100"
  )
  img(
    src="@/assets/inventory/send.webp"
    draggable="false"
    class="absolute bottom-[-20px] right-[-50px] cursor-pointer hover:brightness-125 scale-[.85]"
    @click="sendInput()"
  )
</template>

<script setup lang="ts">
const background: any = ref(null)
const input = ref(null)

const sendInput = () => console.log("eo")

const maxInputWidth = 1052

const updateInputSize = () => {
  if (!REACTIVE.refs.input) return
  if (REACTIVE.refs.input.scrollWidth < maxInputWidth) {
    REACTIVE.refs.input.style.whiteSpace = "nowrap"
  }

  REACTIVE.refs.input.style.width = "auto"
  REACTIVE.refs.input.style.width = `${Math.min(
    REACTIVE.refs.input.scrollWidth + 40,
    maxInputWidth
  )}px`

  if (REACTIVE.refs.input.scrollWidth + 40 >= maxInputWidth) {
    REACTIVE.refs.input.style.whiteSpace = "pre-wrap"
  } else {
    REACTIVE.refs.input.style.whiteSpace = "nowrap"
  }

  REACTIVE.refs.input.style.height = `${REACTIVE.refs.input.scrollHeight + 5}px`
}

let updateInterval: any = null

onMounted(() => {
  REACTIVE.refs.input = input
  updateInterval = setInterval(() => updateInputSize(), 50)
})

onUnmounted(() => {
  clearInterval(updateInterval)
})
</script>
