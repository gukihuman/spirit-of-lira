<template lang="pug">
div(v-if="resolve_show_panel"
class="absolute w-full h-full flex justify-center")
  div(mark="hotkeys-column"
  v-for="(column, columnIndex) in columns" :key="columnIndex"
  class="w-[580px] h-[600px] flex flex-col items-center mx-[-25px]")
    div(
      mark="hotkeys-setting"
      v-for="(object, name, rowIndex) in column" key="rowIndex"
      class="w-[580px] h-[100px]"
      :class="{ 'mt-[120px]': object.type === 'button' }"
    )
      tn: settings-frame(
        mark="settings-frame"
        v-if="resolveFocus(columnIndex, rowIndex)" :class="{ 'w-[585px]': object.type ==='hotkey', 'w-[460px]': object.type === 'button' }"
        )
      div(class="absolute w-fit h-fit z-[10]")
        settings-scroll(
          mark="settings-scroll"
          class="z-[-10] ml-[88px] mt-[35px] w-[calc(100%-48px)] scale-[1.1]"
          v-if="object.type === 'hotkey'"
        )
        setting-button-bg(
          mark="settings-button"
          class="z-[-10] ml-[88px] mt-[35px] w-[calc(100%-48px)] scale-[1.1]"
          v-if="object.type === 'button'"
          :pressed="resolve_pressed(columnIndex, rowIndex)"
        )
        p(mark="hotkeys-title-pressed-light"
          v-show="resolve_pressed(columnIndex, rowIndex)"
          class="absolute blur-[3px] opacity-[0.5] text-[22px] font-bold pointers-events-none z-[20] ml-[125px] "
          :class="text_class(columnIndex, rowIndex, object)"
        ) {{ name }}
        p(mark="hotkeys-title"
          class="text-[22px] font-bold pointers-events-none z-[20] ml-[125px] "
          :class="text_class(columnIndex, rowIndex, object)"
        ) {{ name }}
        tn( type="fast" ): div(
          mark="front clickable container"
          v-show="object.type === 'button'"
          @click="handleButtonClick(columnIndex, rowIndex)"
          class="absolute w-[80%] h-[68%] mt-[-42px] rounded-3xl ml-[92px] bg-tan opacity-0 hover:opacity-[0.1] hover:saturate-[3.5] blur-[2px] transition-opacity duration-[100ms] ease-in-out"
          :class="SETTINGS.echo.button_pressed ? 'h-[63%]' : 'h-[68%]'"
        )
        div(
          v-if="object.type === 'hotkey'"
          mark="hotkey"
          @click="handleClick(columnIndex, rowIndex)"
          class="absolute w-[60px] h-[60px] left-[385px] top-[42px] flex justify-center pb-[10px] hover:scale-1.4 transition-all duration-150 ease-in-out"
          :class="button_class"
        )
          tn: hotkey-icon(
            :update="SETTINGS.echo.show_hotkey"
            :hueAffected="false"
            :tab="props.tab"
            v-if="resolve_show_button_icon(columnIndex, rowIndex, true)"
            class="scale-[1.3] mt-[30px]"
            :inputEvent="resolveEvent(columnIndex, rowIndex, name)"
          )
        tn: hotkey-icon(
          mark="gamepad action key"
          :hueAffected="false"
          inputEvent="resolve setting action"
          class="top-[48px]"
          :class="{ 'left-[455px]': object.type === 'hotkey', 'left-[338px]': object.type === 'button' }"
          v-if="resolve_show_button_icon(columnIndex, rowIndex)")
  tn: p(
    mark="hotkeys-message"
    v-if="SETTINGS.echo.show_message"
    class="text-tan bottom-[40px] text-[22px] font-semibold absolute opacity-[0.8]"
  ) {{ SETTINGS.echo.show_message }}
</template>
<script setup lang="ts">
const text_class = computed(() => {
    return (columnIndex, rowIndex, object) => {
        const pressed =
            SETTINGS.echo.focus.columnIndex === columnIndex &&
            SETTINGS.echo.focus.rowIndex === rowIndex &&
            SETTINGS.echo.button_pressed
        return {
            "text-royal-brown": object.type === "hotkey",
            "text-tan": object.type === "button",
            "mt-[53px]": !pressed,
            "mt-[56px]": pressed,
        }
    }
})
const resolve_pressed = computed(() => {
    return (columnIndex, rowIndex) => {
        return (
            SETTINGS.echo.focus.columnIndex === columnIndex &&
            SETTINGS.echo.focus.rowIndex === rowIndex &&
            SETTINGS.echo.button_pressed
        )
    }
})
const button_hovered = (columnIndex, rowIndex) => {
    SETTINGS.echo.focus.columnIndex = columnIndex
    SETTINGS.echo.focus.rowIndex = rowIndex
}
const props = defineProps({ tab: { type: String } })
const handleButtonClick = (columnIndex, rowIndex) => {
    SETTINGS.echo.focus.columnIndex = columnIndex
    SETTINGS.echo.focus.rowIndex = rowIndex
    EVENTS.emitSingle("resolve setting action")
}
const handleClick = (columnIndex, rowIndex) => {
    if (CONTEXT.echo.settings === "gamepad") return
    SETTINGS.echo.focus.columnIndex = columnIndex
    SETTINGS.echo.focus.rowIndex = rowIndex
    EVENTS.emitSingle("resolve setting action")
}
const button_class = computed(() => {
    const condition = CONTEXT.echo.settings === "keyboard"
    return {
        "hover:scale-[1.1] hover:brightness-125": condition,
    }
})
const resolveEvent = computed(() => {
    return (columnIndex, rowIndex, name) => {
        let columns = [
            SETTINGS.gamepad_tab.left_column,
            SETTINGS.gamepad_tab.right_column,
        ]
        if (props.tab === "keyboard") {
            columns = [
                SETTINGS.keyboard_tab.left_column,
                SETTINGS.keyboard_tab.right_column,
            ]
        }
        return columns[columnIndex][name].events[0]
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
    if (props.tab === "keyboard") {
        return CONTEXT.echo.settings === "keyboard"
    } else return CONTEXT.echo.settings === "gamepad"
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
    if (props.tab === "keyboard") {
        return [
            SETTINGS.keyboard_tab.left_column,
            SETTINGS.keyboard_tab.right_column,
        ]
    }
    return [SETTINGS.gamepad_tab.left_column, SETTINGS.gamepad_tab.right_column]
})
</script>
