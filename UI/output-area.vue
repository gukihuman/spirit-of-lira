<template lang="pug">
div(class="absolute bg-slate-800 left-[1000px] w-[500px] h-full z-20")
  div(class="flex items-end w-full h-full pb-[770px]")
    output(class="bg-sand-light rounded-3xl text-[28px] z-10 focus:outline-none border-8 border-amber-900 opacity-75 p-6 pt-3 resize-none time-100 ease-in-out text-bottom selected-text text-[#552214] leading-[1.3] font-medium" ref="output" @input="updateWidth()" placeholder="...")
</template>

<script setup lang="ts">
const output: any = ref(null)

const maxWidth = 1110
const minWidth = 200

const update = () => {
  if (output.value === null) return

  // value

  // stylization
  if (output.value.scrollWidth < maxWidth) {
    output.value.style.whiteSpace = "nowrap"
  }
  output.value.style.width = "auto"
  output.value.style.width = `${Math.min(
    output.value.scrollWidth + 40,
    maxWidth
  )}px`

  if (output.value.scrollWidth + 40 >= maxWidth) {
    output.value.style.whiteSpace = "pre-wrap"
  } else {
    output.value.style.whiteSpace = "nowrap"
  }

  // if (output.value.scrollWidth < minWidth) {
  //   output.value.style.width = `${minWidth}px`
  // }
  // output.value.style.height = "auto"
  output.value.style.height = `${output.value.scrollHeight + 10}px`
}

let updateInterval: any = null

onMounted(() => {
  updateInterval = setInterval(() => update(), 50)
})

onUnmounted(() => {
  SYSTEM_DATA.refs.output = output
  clearInterval(updateInterval)
})
</script>
<style>
.selected-text::selection {
  background-color: rgb(122, 56, 21);
  color: white;
}
.selected-text::placeholder {
  color: rgb(122, 56, 21);
  font-weight: bold;
}
</style>
