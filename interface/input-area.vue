<template lang="pug">
div(
  ref="background"
  class="absolute bottom-[150px] left-[400px] rounded-3xl opacity-50 border-4 border-sand-700 bg-gradient-to-t from-sand-400 to-sand-200 transition"
  :class="{ 'opacity-100': INTERFACE.inputFocus }"
  )
  textarea(
    ref="inputArea"
    @input="updateInputSize()"
    @focus="INTERFACE.inputFocus = true"
    @blur="INTERFACE.inputFocus = false"
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
const inputArea = ref(null)

const sendInput = () => {
  EVENTS.emit("sendInput")
}

const maxInputWidth = 1052

const updateInputSize = () => {
  const input = REFS.input
  if (!input) return

  if (input.scrollWidth < maxInputWidth) {
    input.style.whiteSpace = "nowrap"
  }

  input.style.width = "auto"
  input.style.width = `${Math.min(input.scrollWidth + 40, maxInputWidth)}px`

  if (input.scrollWidth + 40 >= maxInputWidth) {
    input.style.whiteSpace = "pre-wrap"
  } else {
    input.style.whiteSpace = "nowrap"
  }

  input.style.height = `${input.scrollHeight + 5}px`
}

let updateInterval: any = null

onMounted(() => {
  REFS.input = inputArea
  updateInterval = setInterval(() => updateInputSize(), 50)
})

onUnmounted(() => {
  clearInterval(updateInterval)
})
</script>
