<template lang="pug">
div(class="absolute w-full h-full pt-[210px] pr-[30px]"
  class="flex justify-center"
  v-if="INTERFACE.settingsTabList[INTERFACE.settingsTabIndex] === props.device")
  div(mark="hotkeys-column"
    v-for="(column, i) in columns" :key="i"
    class="w-[580px] h-[620px] flex flex-col items-center mx-[-25px]")
    div(mark="hotkeys-setting"
      v-for="(events, setting, k) in column" key="k"
      class="w-[580px] h-[100px]")
      settings-frame(mark="settings-frame" class="w-[580px]")
      div(class="absolute w-fit h-fit z-[10]")
        settings-scroll(mark="settings-scroll"
          class="z-[-10] ml-[85px] mt-[35px] w-[calc(100%-35px)]")
        p(mark="hotkeys-title"
          class="text-royal-brown text-[22px] font-bold"
          class="z-[20] ml-[125px] mt-[53px]") {{ setting }}
</template>
<script setup lang="ts">
const props = defineProps(["device"])
const columns = computed(() => {
  if (props.device === "keyboard") {
    return [keyboardLeftColumn, keyboardRightColumn]
  }
  return [gamepadLeftColumn, gamepadRightColumn]
})
const keyboardLeftColumn = {
  Action: ["quit", "talk", "reset", "continue"],
  Cast: ["cast1"],
  "Auto Move": ["autoMove"],
}
const keyboardRightColumn = {
  "Toggle Fullscreen": ["toggleFullscreen"],
  "Toggle Settings": ["toggleSettings"],
}
const gamepadLeftColumn = {
  Action: ["quit", "talk", "reset", "continue"],
  Cast: ["cast1"],
}
const gamepadRightColumn = {
  "Toggle Fullscreen": ["toggleFullscreen"],
  "Toggle Settings": ["toggleSettings"],
}
</script>
