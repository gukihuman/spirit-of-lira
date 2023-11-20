<template lang="pug">
div(
  v-if="INTERFACE.showKeys"
  class="absolute w-[50px] flex justify-center items-center mt-[25px] pointer-events-none transition duration-1000 ease-in-out"
  :class="iconClass"
)
  img(
    :src="image"
    draggable="false"
    class="absolute object-none"
    :class="imageClass"
    :style="imageStyle"
  )
  p(
    class="absolute z-10 text-tan text-[22px] font-semibold ml-[1px] mb-[2px] points-events-none opacity-[.9]"
    :class="textClass"
  ) {{ text }}
</template>
<script setup lang="ts">
const props = defineProps(["inputEvent"])
const iconClass = computed(() => {
  if (GLOBAL.context === "scene") {
    return {
      "hue-rotate-180": true,
    }
  }
  return {}
})
const imageStyle = computed(() => {
  return {
    transition: "filter 1000ms ease-in-out",
  }
})
const image = computed(() => {
  const key = findKey()
  if (!key) return
  if (GLOBAL.lastActiveDevice === "gamepad") {
    if (
      key.includes("Down") ||
      key.includes("Right") ||
      key.includes("Left") ||
      key.includes("Up")
    ) {
      return ASSETS.webps["gamepad-key-cross"]
    }
    if (key.includes("LB")) return ASSETS.webps["gamepad-key-lb"]
    if (key.includes("RB")) return ASSETS.webps["gamepad-key-rb"]
    if (key.includes("LT")) return ASSETS.webps["gamepad-key-lt"]
    if (key.includes("RT")) return ASSETS.webps["gamepad-key-rt"]
    if (key.includes("LS")) return ASSETS.webps["gamepad-key-ls"]
    if (key.includes("RS")) return ASSETS.webps["gamepad-key-rs"]
    if (key.includes("Start")) return ASSETS.webps["gamepad-key-start"]
    if (key.includes("Menu")) return ASSETS.webps["gamepad-key-menu"]
    return ASSETS.webps["gamepad-key"]
  } else {
    if (key.includes("Arrow")) {
      return ASSETS.webps["keyboard-key-arrow"]
    }
    if (textMap[key]) return ASSETS.webps["keyboard-key-wide"]
    return ASSETS.webps["keyboard-key"]
  }
})
const imageClass = computed(() => {
  const key = findKey()
  if (!key) return
  const classObject = {
    "rotate-90": key === "ArrowRight" || key === "Right",
    "rotate-180": key === "ArrowDown" || key === "Down",
    "-rotate-90": key === "ArrowLeft" || key === "Left",
  }
  if (GLOBAL.context === "scene") {
    _.merge(classObject, {
      "saturate-[.6]": true,
      "brightness-[.85]": true,
      "contrast-[1.2]": true,
    })
  }
  return classObject
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
  // keyboard
  Control: "Ct",
  Shift: "Sh",
  Alt: "Al",
  Enter: "En",
  " ": "Sp",
  Delete: "Dl",
  CopsLock: "Cl",
  Tab: "Tb",
  Backspace: "Bs",
  ArrowUp: " ",
  ArrowRight: " ",
  ArrowDown: " ",
  ArrowLeft: " ",
  // gamepad
  LB: " ",
  RB: " ",
  LT: " ",
  RT: " ",
  Start: " ",
  Menu: " ",
  LS: " ",
  RS: " ",
  Up: " ",
  Down: " ",
  Left: " ",
  Right: " ",
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
