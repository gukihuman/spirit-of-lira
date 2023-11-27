<template lang="pug">
div(v-if="INTERFACE.showKeys"
  class="absolute w-[50px] mt-[25px] transition duration-1000 ease-in-out"
  class="flex justify-center items-center pointer-events-none"
  :class="iconClass")
  img(:src="image" class="absolute object-none"
    :class="imageClass" :style="imageStyle")
  p(class="absolute z-10 ml-[1px] mb-[2px] opacity-[.9]"
    class="text-tan text-[22px] font-semibold points-events-none"
    :class="textClass") {{ text }}
</template>
<script setup lang="ts">
const props = defineProps(["inputEvent"])
const iconClass = computed(() => {
  if (GLOBAL.context === "scene") return { "hue-rotate-180": true }
  return {}
})
const imageStyle = computed(() => {
  return { transition: "filter 1000ms ease-in-out" }
})
const image = computed(() => {
  const hotkey = findKey()
  if (!hotkey) return
  if (GLOBAL.lastActiveDevice === "gamepad") {
    if (
      hotkey.includes("Down") ||
      hotkey.includes("Right") ||
      hotkey.includes("Left") ||
      hotkey.includes("Up")
    ) {
      return ASSETS.webps["gamepad-cross"]
    }
    if (hotkey.includes("LB")) return ASSETS.webps["gamepad-lb"]
    if (hotkey.includes("RB")) return ASSETS.webps["gamepad-rb"]
    if (hotkey.includes("LT")) return ASSETS.webps["gamepad-lt"]
    if (hotkey.includes("RT")) return ASSETS.webps["gamepad-rt"]
    if (hotkey.includes("LS")) return ASSETS.webps["gamepad-ls"]
    if (hotkey.includes("RS")) return ASSETS.webps["gamepad-rs"]
    if (hotkey.includes("Start")) return ASSETS.webps["gamepad-start"]
    if (hotkey.includes("Menu")) return ASSETS.webps["gamepad-menu"]
    return ASSETS.webps["gamepad-empty"]
  } else {
    if (hotkey.includes("Arrow")) {
      return ASSETS.webps["keyboard-arrow"]
    }
    if (textMap[hotkey]) return ASSETS.webps["keyboard-empty-wide"]
    return ASSETS.webps["keyboard-empty"]
  }
})
const imageClass = computed(() => {
  const hotkey = findKey()
  if (!hotkey) return
  const classObject = {
    "rotate-90": hotkey === "ArrowRight" || hotkey === "Right",
    "rotate-180": hotkey === "ArrowDown" || hotkey === "Down",
    "-rotate-90": hotkey === "ArrowLeft" || hotkey === "Left",
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
  const hotkey = findKey()
  if (!hotkey) return {}
  if (GLOBAL.lastActiveDevice === "gamepad") return { "mb-0": true }
  else if (textMap[hotkey]) return { "mb-[1px]": true }
  return {}
})
const text = computed(() => {
  const hotkey = findKey()
  if (!hotkey) return {}
  return textMap[hotkey] ? textMap[hotkey] : hotkey
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
  let hotkey
  if (GLOBAL.lastActiveDevice === "gamepad") {
    hotkey = SETTINGS.worldInputEvents.gamepad[props.inputEvent]
    hotkey = hotkey || SETTINGS.sceneInputEvents.gamepad[props.inputEvent]
  } else {
    hotkey = SETTINGS.worldInputEvents.keyboard[props.inputEvent]
    hotkey = hotkey || SETTINGS.sceneInputEvents.keyboard[props.inputEvent]
  }
  return hotkey
}
</script>
