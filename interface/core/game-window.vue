<template lang="pug">
div(v-show="!CONTEXT.echo.loading" :style="style"
  class="absolute bg-gray-700 absolute overflow-hidden")
  slot
</template>
<script setup lang="ts">
const width = CONFIG.viewport.width
const height = CONFIG.viewport.height
let scale = ref(0)
const style = computed(() => {
  return {
    width: width + "px",
    height: height + "px",
    scale: scale.value,
  }
})
function setScale() {
  const userWidth = innerWidth * devicePixelRatio
  const userHeight = innerHeight * devicePixelRatio
  let [baseWidth, baseHeight] = [userWidth / 16, userHeight / 9]
  if (baseWidth > baseHeight) {
    scale.value = userHeight / height / devicePixelRatio
    GLOBAL.gameWindowScale = scale.value
  } else {
    scale.value = userWidth / width / devicePixelRatio
    GLOBAL.gameWindowScale = scale.value
  }
}
onMounted(() => {
  setScale()
  addEventListener("resize", setScale)
})
</script>
