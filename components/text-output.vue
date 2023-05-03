<template lang="pug">
div(class="absolute left-[1000px] w-[500px] h-full z-20")
  div(class="flex items-end w-full h-full pb-[770px]")
    textarea(class="bg-sand-light rounded-3xl text-[28px] z-10 focus:outline-none border-8 border-amber-900 opacity-75 p-6 pt-3 resize-none duration-100 ease-in-out text-bottom selected-text text-[#552214] leading-[1.3] font-medium" ref="textarea" @input="updateWidth()" placeholder="...")
</template>

<script setup lang="ts">
const textarea: any = ref(null)

const maxWidth = 1110
const minWidth = 200

const update = () => {
  if (textarea.value === null) return

  // value
  textarea.value.value = gud.states.output

  // stylization
  if (textarea.value.scrollWidth < maxWidth) {
    textarea.value.style.whiteSpace = "nowrap"
  }
  textarea.value.style.width = "auto"
  textarea.value.style.width = `${Math.min(
    textarea.value.scrollWidth + 40,
    maxWidth
  )}px`

  if (textarea.value.scrollWidth + 40 >= maxWidth) {
    textarea.value.style.whiteSpace = "pre-wrap"
  } else {
    textarea.value.style.whiteSpace = "nowrap"
  }

  // if (textarea.value.scrollWidth < minWidth) {
  //   textarea.value.style.width = `${minWidth}px`
  // }
  // textarea.value.style.height = "auto"
  textarea.value.style.height = `${textarea.value.scrollHeight + 10}px`
}

let updateInterval: any = null

onMounted(() => {
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
