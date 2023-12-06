<template lang="pug">
div(class="absolute relative w-[100px] hover:brightness-[1.15] transition duration-150 ease-in-out")
  div(class="relative flex justify-center items-center hover:scale-[1.05] transition duration-150 ease-in-out h-[100px]"
  @mouseover="INTERFACE.buttonHover = true"
  @mouseleave="INTERFACE.buttonHover = false"
  @click="handleClick()")
    img(:src="ASSETS.webps[props.type]" draggable="false"
    class="absolute object-none" :style="image_style")
  hotkey-icon(class="top-[60px] left-[25px]" :inputEvent="inputEvent")
</template>
<script setup lang="ts">
const props = defineProps(["type", "icon_hue"]) // like toggleFullscreen
const image_style = computed(() => {
  return {
    filter: `hue-rotate(${props["icon_hue"]}deg)`,
  }
})
const handleClick = () => {
  if (SETTINGS.echo.editHotkeyMode) return
  if (props.type === "inventory") {
    EVENTS.emitSingle("toggleInventory")
  } else if (props.type === "settings") {
    EVENTS.emitSingle("toggleSettings")
  } else {
    EVENTS.emitSingle("toggleFullscreen")
  }
}
const inputEvent = computed(() => {
  if (props.type === "inventory") {
    return "toggleInventory"
  } else if (props.type === "settings") {
    return "toggleSettings"
  } else {
    return "toggleFullscreen"
  }
})
</script>
