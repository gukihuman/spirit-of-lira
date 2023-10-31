<template lang="pug">
div(class="w-[50px] flex justify-center items-center mt-[25px]")
  img(
    :src="ASSETS.webps['keyboard-key']"
    draggable="false"
    class="absolute object-none"
  )
  p(class="absolute z-10 text-tan text-[22px] font-semibold ml-[1px] mb-[2px] points-events-none") t
</template>
<script setup lang="ts">
const props = defineProps(["pressedKey"])
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
const text = computed(() => {})
</script>
