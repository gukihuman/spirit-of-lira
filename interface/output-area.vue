<template lang="pug">
div(class="absolute bg-slate-800 left-[1000px] w-[500px] h-full z-20")
  div(class="flex items-end w-full h-full pb-[770px]")
    output(class="bg-sand-light rounded-3xl text-[28px] z-10 focus:outline-none border-8 border-amber-900 opacity-75 p-6 pt-3 resize-none time-100 ease-in-out text-bottom selected-text text-[#552214] leading-[1.3] font-medium" ref="outputArea" @input="updateWidth()" placeholder="...")
</template>

<script setup lang="ts">
const outputArea = ref(null)

const maxWidth = 1110
const minWidth = 200

const update = () => {
  //
  // the same output but taken as value of the ref
  const output = REFS.output
  if (!output) return

  // stylization
  if (output.scrollWidth < maxWidth) {
    output.style.whiteSpace = "nowrap"
  }
  output.style.width = "auto"
  output.style.width = `${Math.min(output.scrollWidth + 40, maxWidth)}px`

  if (output.scrollWidth + 40 >= maxWidth) {
    output.style.whiteSpace = "pre-wrap"
  } else {
    output.style.whiteSpace = "nowrap"
  }

  output.style.height = `${output.scrollHeight + 10}px`
}

let updateInterval: any = null

onMounted(() => {
  REFS.output = outputArea
  updateInterval = setInterval(() => update(), 50)
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
.selected-text::placeholder {
  color: rgb(122, 56, 21);
  font-weight: bold;
}
</style>
