<template lang="pug">
div(
  v-if="INTERFACE.showKeys"
  class="absolute top-0 left-0 w-[50px] flex justify-center items-center mt-[25px] pointer-events-none transition duration-1000 ease-in-out"
  :class="iconClass"
)
  img(
    :src="image"
    draggable="false"
    class="absolute object-none transition duration-1000 ease-in-out"
    :class="imageClass"
  )
  p(
    class="absolute z-10 text-tan text-[22px] font-semibold ml-[1px] mb-[2px] points-events-none opacity-[.7]"
    :class="textClass"
  ) {{ text }}
</template>
<script setup lang="ts">
const props = defineProps(["inputEvent"])
const image = computed(() => {
  const key = findKey()
  if (!key) return
  if (GLOBAL.lastActiveDevice === "gamepad") {
    return ASSETS.webps["gamepad-key"]
  } else {
    if (key.includes("Arrow")) {
      return ASSETS.webps["keyboard-key-arrow"]
    }
    if (textMap[key]) return ASSETS.webps["keyboard-key-wide"]
    return ASSETS.webps["keyboard-key"]
  }
})
const iconClass = computed(() => {
  if (GLOBAL.context === "scene") {
    return {
      "hue-rotate-180": true,
    }
  }
  return {}
})
const imageClass = computed(() => {
  const key = findKey()
  if (!key) return
  if (GLOBAL.context === "scene") {
    return {
      "saturate-[.8]": true,
      "brightness-[.8]": true,
      "rotate-90": key === "ArrowRight",
      "rotate-180": key === "ArrowDown",
      "-rotate-90": key === "ArrowLeft",
    }
  }
  return {
    "rotate-90": key === "ArrowRight",
    "rotate-180": key === "ArrowDown",
    "-rotate-90": key === "ArrowLeft",
  }
})
const textClass = computed(() => {
  const key = findKey()
  if (!key) return
  if (GLOBAL.lastActiveDevice === "gamepad") {
    return { "mb-0": true }
  } else if (textMap[key]) {
    return { "mb-[1px]": true }
  }
  return {}
})
const text = computed(() => {
  const key = findKey()
  if (!key) return
  return textMap[key] ? textMap[key] : key
})
const textMap = {
  Control: "Ct",
  Shift: "Sh",
  Alt: "Al",
  Enter: "En",
  " ": "Sp",
  Tab: "Tb",
  CopsLock: "Cl",
  Backspace: "Bs",
  Delete: "Dl",
  ArrowLeft: " ",
  ArrowRight: " ",
  ArrowUp: " ",
  ArrowDown: " ",
}
function findKey() {
  let key
  if (GLOBAL.lastActiveDevice === "gamepad") {
    key = SETTINGS.worldInputEvents.gamepad[props.inputEvent]
    key = key || SETTINGS.sceneInputEvents.gamepad[props.inputEvent]
  } else {
    key = SETTINGS.worldInputEvents.keyboard[props.inputEvent]
    key = key || SETTINGS.sceneInputEvents.keyboard[props.inputEvent]
  }
  return key
}
</script>
