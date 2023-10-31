<template lang="pug">
div(
  v-if="INTERFACE.showKeys"
  class="absolute top-0 left-0 w-[50px] flex justify-center items-center mt-[25px] pointer-events-none"
)
  img(
    :src="image"
    draggable="false"
    class="absolute object-none"
  )
  p(
    class="absolute z-10 text-tan text-[22px] font-semibold ml-[1px] mb-[2px] points-events-none"
    :class="GLOBAL.lastActiveDevice === 'gamepad' ? 'mb-0' : ''"
  ) {{ text }}
</template>
<script setup lang="ts">
const props = defineProps(["inputEvent"])
const image = computed(() => {
  if (GLOBAL.lastActiveDevice === "gamepad") {
    return ASSETS.webps["gamepad-key"]
  } else {
    return ASSETS.webps["keyboard-key"]
  }
})
const text = computed(() => {
  let key
  if (GLOBAL.lastActiveDevice === "gamepad") {
    key = SETTINGS.worldInputEvents.gamepad[props.inputEvent]
  } else {
    key = SETTINGS.worldInputEvents.keyboard[props.inputEvent]
  }
  if (!key) return
  return textMap[key] ? textMap[key] : key
})
const textMap = {
  Control: "Ct",
  Shift: "Sh",
  Alt: "Al",
  Enter: "En",
  Escape: "Es",
  " ": "Sp",
  Tab: "Tb",
  CopsLock: "Cl",
  Backspace: "Bs",
  Delete: "Dl",
}
</script>
