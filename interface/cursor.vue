<template lang="pug">
div(class="absolute left-[100px] z-[999] w-[102px] h-[94px] pointer-events-none" :style="cursorStyle")
  img(
      v-show="cursor"
      :src="ASSETS.webps.cursor"
      draggable="false"
      class="absolute"
    )
  img(
      v-show="cursorNo"
      :src="ASSETS.webps['cursor-no']"
      draggable="false"
      class="absolute"
    )
  img(
      v-show="cursorCast"
      :src="ASSETS.webps['cursor-cast']"
      draggable="false"
      class="absolute"
    )
</template>
<script setup lang="ts">
const cursorStyle = computed(() => {
  const imageOffset = { x: 51, y: 47 }
  return {
    left: _.round(GLOBAL.mouseOfScreen.x - imageOffset.x) + "px",
    top: _.round(GLOBAL.mouseOfScreen.y - imageOffset.y) + "px",
  }
})
const cursor = computed(() => {
  if (GLOBAL.context === "interface" || GLOBAL.context === "scene") return true
  return (
    !(INPUT.lastActiveDevice === "gamepad") &&
    !GLOBAL.hoverId &&
    COORDINATES.isWalkable(GLOBAL.mousePosition.x, GLOBAL.mousePosition.y)
  )
})
const cursorNo = computed(() => {
  if (GLOBAL.context === "interface" || GLOBAL.context === "scene") return false
  return (
    !(INPUT.lastActiveDevice === "gamepad") &&
    !GLOBAL.hoverId &&
    !COORDINATES.isWalkable(GLOBAL.mousePosition.x, GLOBAL.mousePosition.y)
  )
})
const cursorCast = computed(() => {
  if (GLOBAL.context === "interface" || GLOBAL.context === "scene") return false
  return (
    !(INPUT.lastActiveDevice === "gamepad") &&
    GLOBAL.hoverId &&
    COORDINATES.isWalkable(GLOBAL.mousePosition.x, GLOBAL.mousePosition.y)
  )
})
</script>
