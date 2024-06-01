<template lang="pug">
div(
    v-if="resolve_show_panel"
    class="absolute w-full h-full flex flex-col items-center"
)
    div(
        mark="center column"
        v-show="CONTEXT.echo.settings === 'general'"
        class="w-[860px] h-fit flex flex-col items-center z-[50] mt-[10px]"
    )
        div(
            mark="row"
            v-for="(object, name, central_row_index) in SETTINGS.general_tab.center_column" :key="central_row_index"
            class="w-full h-[90px] ml-[10px]"
        )
            tn: settings-frame(
                class="mt-[-25px]"
                v-if="!CONTEXT.echo.confirm && resolveFocus(0, central_row_index, 'center')" :class="{ 'w-[850px]': SETTINGS.echo.general.showKeys, 'w-[810px]': !SETTINGS.echo.general.showKeys}"
            )
            div( class="absolute w-fit h-fit z-[10] mt-[-25px]" )
                settings-scroll(
                    class="z-[-10] ml-[88px] mt-[35px] w-[calc(100%-48px)] scale-[1.1]"
                )
                p(
                    mark="setting name"
                    class="text-[22px] font-bold pointers-events-none z-[20] ml-[125px] mt-[53px] text-royal-brown"
                ) {{ name }}
                settings-slider(
                    class="absolute left-[310px] mt-[-48px] z-[200]"
                    :setting="object.prop"
                )
                tn: div(
                    mark="gamepad left / right icons"
                    v-if="resolve_show_button_icon_center(central_row_index)"
                )
                    tn: hotkey-icon(
                        :hueAffected="false"
                        static="Left"
                        class="top-[46px] left-[265px]"
                    )
                    tn: hotkey-icon(
                        :hueAffected="false"
                        static="Right"
                        class="top-[47px] left-[725px]"
                    )
    div(
        class="w-full h-full flex justify-center mt-[20px]"
        :class="hotkeys_panel_margin"
    )
        div(
            mark="column of doubles"
            v-for="(column, column_index) in columns" :key="column_index"
            class="w-580px] h-full flex flex-col items-center mx-[-25px]"
        )
            div(
                mark="row"
                v-for="(object, name, row_index) in column" :key="row_index"
                class="w-[580px] h-[90px]"
                :class="{ 'mt-[10px]': object.type === 'button', 'mt-[100px]': object.type === 'button' && CONTEXT.echo.settings !== 'general' }"
            )
                tn: settings-frame(
                    class="mt-[-25px]"
                    v-if="!CONTEXT.echo.confirm && resolveFocus(column_index, row_index)" :class="{ 'w-[585px]': object.type !== 'button' && SETTINGS.echo.general.showKeys, 'w-[535px]': object.type !== 'button' && !SETTINGS.echo.general.showKeys , 'w-[460px]': object.type === 'button' && SETTINGS.echo.general.showKeys, 'w-[416px]': object.type === 'button' && !SETTINGS.echo.general.showKeys }"
                )
                div( class="absolute w-fit h-fit z-[10] mt-[-25px]" )
                    settings-scroll(
                        class="z-[-10] ml-[88px] mt-[35px] w-[calc(100%-48px)] scale-[1.1]"
                        v-if="object.type !== 'button'"
                    )
                    setting-button-bg(
                        class="z-[-10] ml-[88px] mt-[35px] w-[calc(100%-48px)] scale-[1.1]"
                        v-if="object.type === 'button'"
                        :pressed="resolve_pressed(column_index, row_index)"
                    )
                    p(
                        mark="pressed button title light"
                        v-show="resolve_pressed(column_index, row_index)"
                        class="absolute blur-[3px] opacity-[0.5] text-[22px] font-bold pointers-events-none z-[20] ml-[125px] "
                        :class="text_class(column_index, row_index, object)"
                    ) {{ name }}
                    p(
                        mark="setting name"
                        class="text-[22px] font-bold pointers-events-none z-[20] ml-[125px] "
                        :class="text_class(column_index, row_index, object)"
                    ) {{ name }}
                    tn( type="fast" ): div(
                        mark="front clickable container"
                        v-show="object.type === 'button'"
                        @hover="SETTINGS.echo.focus.column_index = column_index; SETTINGS.echo.focus.row_index = row_index"
                        @click="handleButtonClick(column_index, row_index)"
                        class="absolute w-[80%] h-[68%] mt-[-42px] rounded-3xl ml-[92px] bg-tan opacity-0 hover:opacity-[0.1] hover:saturate-[3.5] blur-[2px] transition-opacity duration-[100ms] ease-in-out"
                        :class="{'h-[63%]': SETTINGS.echo.button_pressed, 'h-[68%]': !SETTINGS.echo.button_pressed, 'hover:opacity-0': CONTEXT.echo.confirm}"
                    )
                    div(
                        v-if="object.type === 'hotkey'"
                        mark="hotkey-setting"
                        @click="handleClick(column_index, row_index)"
                        class="absolute w-[60px] h-[60px] left-[385px] top-[46px] flex justify-center pb-[10px] hover:scale-1.4 transition-all duration-150 ease-in-out"
                        :class="button_class"
                    )
                        tn: hotkey-icon(
                            :hotkeySetting="true"
                            :update="SETTINGS.echo.show_hotkey"
                            :hueAffected="false"
                            :tab="props.tab"
                            v-if="resolve_show_button_icon_double(column_index, row_index, true)"
                            class="scale-[1.3] mt-[30px]"
                            :inputEvent="resolveEvent(column_index, row_index, name)"
                        )
                    tn: hotkey-icon(
                        mark="gamepad action key"
                        :hueAffected="false"
                        inputEvent="resolve setting action"
                        class="top-[48px]"
                        :class="{ 'left-[455px]': object.type !== 'button', 'left-[338px]': object.type === 'button' }"
                        v-if="resolve_show_button_icon_double(column_index, row_index)"
                    )
                    trigger-indicator(
                        v-if="object.type === 'trigger'"
                        @click="handle_trigger_click(object.prop)"
                        :state="SETTINGS.echo.general[object.prop]"
                        class="left-[376px] top-[36px] scale-[1.1]"
                    )

    tn: p(
        mark="hotkeys-message"
        v-if="SETTINGS.echo.show_message"
        class="text-tan bottom-[40px] text-[22px] font-semibold absolute opacity-[0.8]"
    ) {{ SETTINGS.echo.show_message }}
</template>
<script setup lang="ts">
const hotkeys_panel_margin = computed(() => {
    return { "mt-[35px]": CONTEXT.echo.settings !== "general" }
})
const handle_trigger_click = (prop) => {
    if (prop === "patreon_access") {
        CONFIRM.resolve_patreon_access()
    } else {
        g.toggle(SETTINGS.echo.general, prop)
    }
}
const text_class = computed(() => {
    return (column_index, row_index, object) => {
        const pressed =
            SETTINGS.echo.focus.column_index === column_index &&
            SETTINGS.echo.focus.row_index === row_index &&
            SETTINGS.echo.button_pressed
        return {
            "text-royal-brown": object.type !== "button",
            "text-tan": object.type === "button",
            "mt-[53px]": !pressed,
            "mt-[56px]": pressed,
        }
    }
})
const resolve_pressed = computed(() => {
    return (column_index, row_index) => {
        return (
            SETTINGS.echo.focus.column_index === column_index &&
            SETTINGS.echo.focus.row_index === row_index &&
            SETTINGS.echo.button_pressed
        )
    }
})
const button_hovered = (column_index, row_index) => {
    SETTINGS.echo.focus.column_index = column_index
    SETTINGS.echo.focus.row_index = row_index
}
const props = defineProps({ tab: { type: String } })
const handleButtonClick = (column_index, row_index) => {
    SETTINGS.echo.focus.column_section = "double" // otherwise action not work
    SETTINGS.echo.focus.column_index = column_index
    SETTINGS.echo.focus.row_index = row_index
    EVENTS.emitSingle("resolve setting action")
}
const handleClick = (column_index, row_index) => {
    if (CONTEXT.echo.settings === "gamepad") return
    SETTINGS.echo.focus.column_index = column_index
    SETTINGS.echo.focus.row_index = row_index
    EVENTS.emitSingle("resolve setting action")
}
const button_class = computed(() => {
    const condition = CONTEXT.echo.settings === "keyboard"
    return {
        "hover:scale-[1.1] hover:brightness-125": condition,
    }
})
const resolveEvent = computed(() => {
    return (column_index, row_index, name) => {
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
        return columns[column_index][name].events[0]
    }
})
const resolve_show_button_icon_center = computed(() => {
    return (row_index) => {
        if (!SETTINGS.echo.general.showKeys) return
        if (CONTEXT.echo.confirm) return
        if (SETTINGS.echo.focus.column_section !== "center") return
        if (GLOBAL.lastActiveDevice !== "gamepad") return
        return SETTINGS.echo.focus.row_index === row_index
    }
})
const resolve_show_button_icon_double = computed(() => {
    return (column_index, row_index, button = false) => {
        if (!SETTINGS.echo.showButtonIcon) return
        if (SETTINGS.echo.focus.column_section !== "double") return
        if (GLOBAL.lastActiveDevice !== "gamepad" && !button) return false
        if (!button) {
            return (
                SETTINGS.echo.focus.column_index === column_index &&
                SETTINGS.echo.focus.row_index === row_index
            )
        }
        if (button && SETTINGS.echo.editHotkeyMode) {
            return (
                SETTINGS.echo.focus.column_index !== column_index ||
                SETTINGS.echo.focus.row_index !== row_index
            )
        }
        return true
    }
})
const resolve_show_panel = computed(() => {
    if (!SETTINGS.echo.show_panel) return
    if (props.tab === "keyboard") {
        return CONTEXT.echo.settings === "keyboard"
    } else if (props.tab === "gamepad") {
        return CONTEXT.echo.settings === "gamepad"
    } else {
        return CONTEXT.echo.settings === "general"
    }
})
const resolveFocus = computed(() => {
    return (column_index, row_index, section = "double") => {
        return (
            SETTINGS.echo.focus.column_section === section &&
            SETTINGS.echo.focus.column_index === column_index &&
            SETTINGS.echo.focus.row_index === row_index
        )
    }
})
const columns = computed(() => {
    if (props.tab === "keyboard") {
        return [
            SETTINGS.keyboard_tab.left_column,
            SETTINGS.keyboard_tab.right_column,
        ]
    } else if (props.tab === "gamepad") {
        return [
            SETTINGS.gamepad_tab.left_column,
            SETTINGS.gamepad_tab.right_column,
        ]
    } else {
        return [
            SETTINGS.general_tab.left_column,
            SETTINGS.general_tab.right_column,
        ]
    }
})
</script>
