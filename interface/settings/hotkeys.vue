<template lang="pug">
div(v-if="resolveTab" class="absolute w-full h-full flex justify-center")
  div(mark="hotkeys-column"
    v-for="(column, columnIndex) in columns" :key="columnIndex"
    class="w-[580px] h-[620px] flex flex-col items-center mx-[-25px]")
    div(mark="hotkeys-setting"
      v-for="(events, setting, settingIndex) in column" key="settingIndex"
      class="w-[580px] h-[100px]")
      tn(type="fast"): settings-frame(mark="settings-frame"
        v-if="resolveFocus(columnIndex, settingIndex)" class="w-[580px]")
      div(class="absolute w-fit h-fit z-[10]")
        settings-scroll(mark="settings-scroll"
          class="z-[-10] ml-[85px] mt-[35px] w-[calc(100%-35px)]")
        p(mark="hotkeys-title"
          class="text-royal-brown text-[22px] font-bold"
          class="z-[20] ml-[125px] mt-[53px]") {{ setting }}
</template>
<script setup lang="ts">
const props = defineProps(["device"])
const resolveTab = computed(() => {
  return INTERFACE.settingsTabList[INTERFACE.settingsTabIndex] === props.device
})
const resolveFocus = computed(() => {
  return (columnIndex, settingIndex) => {
    return (
      INTERFACE.settingsFocus.columnIndex === columnIndex &&
      INTERFACE.settingsFocus.settingIndex === settingIndex
    )
  }
})
const columns = computed(() => {
  if (props.device === "keyboard") {
    return [SETTINGS.keyboardLeftColumn, SETTINGS.keyboardRightColumn]
  }
  return [SETTINGS.gamepadLeftColumn, SETTINGS.gamepadRightColumn]
})
</script>
