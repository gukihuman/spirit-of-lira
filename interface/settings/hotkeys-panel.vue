<template lang="pug">
div(v-if="resolve_show_panel"
class="absolute w-full h-full flex justify-center")
  div(mark="hotkeys-column"
  v-for="(column, columnIndex) in columns" :key="columnIndex"
  class="w-[580px] h-[620px] flex flex-col items-center mx-[-25px]")
    div(mark="hotkeys-setting"
    v-for="(events, setting, rowIndex) in column" key="rowIndex"
    class="w-[580px] h-[100px]")
      tn: settings-frame(mark="settings-frame"
      v-if="resolveFocus(columnIndex, rowIndex)" class="w-[580px]")
      div(class="absolute w-fit h-fit z-[10]")
        settings-scroll(mark="settings-scroll"
        class="z-[-10] ml-[88px] mt-[35px] w-[calc(100%-48px)] scale-[1.1]")
        p(mark="hotkeys-title"
        class="text-royal-brown text-[22px] font-bold"
        class="z-[20] ml-[125px] mt-[53px]") {{ setting }}
        div(@click="handleClick(columnIndex, rowIndex)"
        class="absolute w-[60px] h-[60px] left-[385px] top-[42px] flex justify-center pb-[10px] hover:scale-1.4 transition-all duration-150 ease-in-out" :class="button_class")
          tn: hotkey-icon(mark="buttonIcon" :device="props.device"
          v-if="resolve_show_button_icon(columnIndex, rowIndex, true)"
          class="scale-[1.3] mt-[30px]"
          :inputEvent="resolveEvent(columnIndex, rowIndex, setting)")
        tn: hotkey-icon(inputEvent="editHotkey" class="left-[450px] top-[48px]"
          v-if="resolve_show_button_icon(columnIndex, rowIndex)")
  p(mark="hotkeys-message"
  v-if="props.device === 'keyboard' && GLOBAL.lastActiveDevice === 'gamepad' && SETTINGS.echo.editHotkeyMode"
  class="text-tan bottom-[20px] text-[22px] font-semibold"
  class="absolute opacity-[0.8]") keyboard edit activated by gamepad, keyboard press is needed
  p(mark="hotkeys-message"
  v-if="SETTINGS.echo.preventEditHotkeyMode === 'empty_action'"
  class="text-tan bottom-[20px] text-[22px] font-semibold"
  class="absolute opacity-[0.8]") this button is reserved for main action
  p(mark="hotkeys-message"
  v-if="SETTINGS.echo.preventEditHotkeyMode === 'cast_only'"
  class="text-tan bottom-[20px] text-[22px] font-semibold"
  class="absolute opacity-[0.8]") Up, Down, Left, Right, RB, LB can be used only with Cast
</template>
<script setup lang="ts">
const props = defineProps({ device: { type: String } }) // keyboard | gamepad
const handleClick = (columnIndex, rowIndex) => {
  if (!CONTEXT.echo.world?.interface?.settings?.keyboard) return
  SETTINGS.echo.focus.columnIndex = columnIndex
  SETTINGS.echo.focus.rowIndex = rowIndex
  EVENTS.emitSingle("editHotkey")
}
const button_class = computed(() => {
  const condition = CONTEXT.echo.world?.interface?.settings?.keyboard
  return {
    "hover:scale-[1.1] hover:brightness-125": condition,
  }
})
const resolveEvent = computed(() => {
  return (columnIndex, rowIndex, setting) => {
    let columns = [SETTINGS.gamepad.leftColumn, SETTINGS.gamepad.rightColumn]
    if (props.device === "keyboard") {
      columns = [SETTINGS.keyboard.leftColumn, SETTINGS.keyboard.rightColumn]
    }
    const events = columns[columnIndex][setting]
    return events[0]
  }
})
const resolve_show_button_icon = computed(() => {
  return (columnIndex, rowIndex, button = false) => {
    if (!SETTINGS.echo.showButtonIcon) return
    if (GLOBAL.lastActiveDevice !== "gamepad" && !button) return false
    if (!button) {
      return (
        SETTINGS.echo.focus.columnIndex === columnIndex &&
        SETTINGS.echo.focus.rowIndex === rowIndex
      )
    }
    if (button && SETTINGS.echo.editHotkeyMode) {
      return (
        SETTINGS.echo.focus.columnIndex !== columnIndex ||
        SETTINGS.echo.focus.rowIndex !== rowIndex
      )
    }
    return true
  }
})
const resolve_show_panel = computed(() => {
  if (!SETTINGS.echo.show_panel) return
  if (props.device === "keyboard") {
    return CONTEXT.echo.world?.interface?.settings?.keyboard
  } else return CONTEXT.echo.world?.interface?.settings?.gamepad
})
const resolveFocus = computed(() => {
  return (columnIndex, rowIndex) => {
    return (
      SETTINGS.echo.focus.columnIndex === columnIndex &&
      SETTINGS.echo.focus.rowIndex === rowIndex
    )
  }
})
const columns = computed(() => {
  if (props.device === "keyboard") {
    return [SETTINGS.keyboard.leftColumn, SETTINGS.keyboard.rightColumn]
  }
  return [SETTINGS.gamepad.leftColumn, SETTINGS.gamepad.rightColumn]
})
</script>
