<template lang="pug">
div(
  class="absolute relative w-[100px] hover:brightness-[1.15] transition duration-150 ease-in-out"
)
  div(
    class="relative flex justify-center items-center hover:scale-[1.05] transition duration-150 ease-in-out h-[100px]"
    @click="handleClick()"
    @mouseover="INTERFACE.buttonHover = true"
    @mouseleave="INTERFACE.buttonHover = false"
    )
    img(
      :src="ASSETS.webps[props.type]"
      draggable="false"
      class="absolute object-none"
    )
  keys(class="top-[60px] left-[25px]" :inputEvent="inputEvent")
</template>
<script setup lang="ts">
const props = defineProps(["type"]) // like toggleFullscreen
const handleClick = () => {
  if (props.type === "inventory") {
    EVENTS.emitSingle("toggleInventory")
  } else {
    EVENTS.emitSingle("toggleFullscreen")
  }
}
const inputEvent = computed(() => {
  if (props.type === "inventory") {
    return "toggleInventory"
  } else {
    return "toggleFullscreen"
  }
})
</script>
