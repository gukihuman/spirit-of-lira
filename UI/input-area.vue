<template lang="pug">
div(
  ref="background"
  class="absolute bottom-[170px] left-[400px] rounded-3xl opacity-50 border-4 border-sand-700 bg-gradient-to-t from-sand-400 to-sand-200 transition"
  :class="{ 'opacity-100': SYSTEM_DATA.states.inputFocus }"
  )
  textarea(
    ref="input"
    @input="updateInputSize()"
    @focus="SYSTEM_DATA.states.inputFocus = true"
    @blur="SYSTEM_DATA.states.inputFocus = false"
    placeholder="..."
    class="text-[26px] bg-sand-100 rounded-3xl focus:outline-none border-[6px] border-sand-300 px-[16px] pb-[16px] pt-[8px] resize-none duration-100 ease-in-out text-bottom selected-text text-sand-700 leading-[1.2] font-semibold mt-[6px] mb-[2px] mx-[10px] shadow-md placeholder:text-sand-500 selection:bg-sand-700 selection:text-sand-100"
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
  if (!SYSTEM_DATA.refs.input) return
  if (SYSTEM_DATA.refs.input.scrollWidth < maxInputWidth) {
    SYSTEM_DATA.refs.input.style.whiteSpace = "nowrap"
  }

  SYSTEM_DATA.refs.input.style.width = "auto"
  SYSTEM_DATA.refs.input.style.width = `${Math.min(
    SYSTEM_DATA.refs.input.scrollWidth + 40,
    maxInputWidth
  )}px`

  if (SYSTEM_DATA.refs.input.scrollWidth + 40 >= maxInputWidth) {
    SYSTEM_DATA.refs.input.style.whiteSpace = "pre-wrap"
  } else {
    SYSTEM_DATA.refs.input.style.whiteSpace = "nowrap"
  }

  SYSTEM_DATA.refs.input.style.height = `${
    SYSTEM_DATA.refs.input.scrollHeight + 5
  }px`
}

let updateInterval: any = null

onMounted(() => {
  SYSTEM_DATA.refs.input = input
  updateInterval = setInterval(() => updateInputSize(), 50)
})

onUnmounted(() => {
  clearInterval(updateInterval)
})
</script>
