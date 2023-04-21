<template lang="pug">

//- background
div(
  ref="background"
  class="h-screen w-screen bg-slate-800 flex items-center justify-center"
  )

  //- game window
  div(class="Bg-gray-700 absolute" :style="style")
    slot

</template>
<script setup lang="ts">
//
const background = ref(null)
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
    gsd.states.gameWindowScale = scale.value
  } else {
    scale.value = userWidth / width / devicePixelRatio
    gsd.states.gameWindowScale = scale.value
  }
}

onMounted(() => {
  //
  // To switch fullscreen
  gsd.refs.background = background

  setScale()
  addEventListener("resize", setScale)
})
</script>
