<template lang="pug">

div(ref="display" class="bg-gray-700 absolute" :style="style")
  slot

</template>
<script setup lang="ts">
//
const width = 1920
const height = 1080
let scale = ref(0)

const style = computed(() => {
  return {
    width: width + "px",
    height: height + "px",
    scale: scale.value,
    cursor: States().cursor ? "auto" : "none",
  }
})
function setScale() {
  const userWidth = innerWidth * devicePixelRatio
  const userHeight = innerHeight * devicePixelRatio
  let [baseWidth, baseHeight] = [userWidth / 16, userHeight / 9]
  if (baseWidth > baseHeight) {
    scale.value = userHeight / height / devicePixelRatio
  } else {
    scale.value = userWidth / width / devicePixelRatio
  }
}
const displayRef = ref(null)

onMounted(() => {
  //
  Refs().display = displayRef // for mouse events

  setScale()
  addEventListener("resize", setScale)

  // 📜 input controller
  // Refs().display.addEventListener("mousemove", (e: any) => {
  //   console.log(e.offsetY, e.offsetX)
  // })
})
</script>
