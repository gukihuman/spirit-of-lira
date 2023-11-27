<template lang="pug">
div(v-if="resolveTab" class="absolute w-full h-full flex justify-center")
  div(mark="hotkeys-column"
    v-for="(column, columnIndex) in columns" :key="columnIndex"
    class="w-[580px] h-[620px] flex flex-col items-center mx-[-25px]")
    div(mark="hotkeys-setting"
      v-for="(events, setting, settingIndex) in column" key="settingIndex"
      class="w-[580px] h-[100px]")
      tn: settings-frame(mark="settings-frame"
        v-if="resolveFocus(columnIndex, settingIndex)" class="w-[580px]")
      div(class="absolute w-fit h-fit z-[10]")
        settings-scroll(mark="settings-scroll"
          class="z-[-10] ml-[88px] mt-[35px] w-[calc(100%-48px)] scale-[1.1]")
        p(mark="hotkeys-title"
          class="text-royal-brown text-[22px] font-bold"
          class="z-[20] ml-[125px] mt-[53px]") {{ setting }}
        div(class="absolute hover:brightness-125 w-[60px] h-[60px] left-[385px] top-[42px] hover:scale-[1.1] flex justify-center pb-[10px] hover:scale-1.4 transition-all duration-150 ease-in-out"
          @click="EVENTS.emitSingle('editHotkey')")
          tn: hotkey-icon(mark="buttonIcon" :device="props.device"
            v-if="resolveIcon(columnIndex, settingIndex, true) && INTERFACE.showButtonIcon"
            class="scale-[1.3] mt-[30px]"
            :inputEvent="resolveEvent(columnIndex, settingIndex, setting)")
        tn: hotkey-icon(inputEvent="editHotkey" class="left-[450px] top-[48px]"
          v-if="resolveIcon(columnIndex, settingIndex) && INTERFACE.showButtonIcon")
  p(mark="hotkeys-message"
    v-if="props.device === 'keyboard' && GLOBAL.lastActiveDevice === 'gamepad' && INTERFACE.editHotkeyMode"
    class="text-tan bottom-[20px] text-[22px] font-semibold"
    class="absolute opacity-[0.8]") keyboard edit activated by gamepad, keyboard press is needed
  p(mark="hotkeys-message"
    v-if="INTERFACE.preventEditHotkeyMode"
    class="text-tan bottom-[20px] text-[22px] font-semibold"
    class="absolute opacity-[0.8]") this button is reserved for main action
  p(mark="hotkeys-message"
    v-if="INTERFACE.preventEditHotkeyModeCast"
    class="text-tan bottom-[20px] text-[22px] font-semibold"
    class="absolute opacity-[0.8]") Up, Down, Left, Right, RB, LB can be used only with Cast
</template>
<script setup lang="ts">
const props = defineProps(["device"])
const resolveEvent = computed(() => {
  return (columnIndex, settingIndex, setting) => {
    let columns = [SETTINGS.gamepadLeftColumn, SETTINGS.gamepadRightColumn]
    if (props.device === "keyboard") {
      columns = [SETTINGS.keyboardLeftColumn, SETTINGS.keyboardRightColumn]
    }
    const events = columns[columnIndex][setting]
    return events[0]
  }
})
const resolveIcon = computed(() => {
  return (columnIndex, settingIndex, button = false) => {
    if (GLOBAL.lastActiveDevice !== "gamepad" && !button) return false
    if (!button) {
      return (
        INTERFACE.settingsFocus.columnIndex === columnIndex &&
        INTERFACE.settingsFocus.settingIndex === settingIndex
      )
    }
    if (button && INTERFACE.editHotkeyMode) {
      return (
        INTERFACE.settingsFocus.columnIndex !== columnIndex ||
        INTERFACE.settingsFocus.settingIndex !== settingIndex
      )
    }
    return true
  }
})
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
