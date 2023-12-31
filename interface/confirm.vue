<template lang="pug">
div(
    mark="confirm"
    v-if="CONTEXT.echo.confirm"
    class="relative z-[1100]"
)
    div(
        mark="dim"
        class="z-[80] absolute w-[1920px] h-[1080px] opacity-[0.4] bg-gray-900"
    )
    img(
        mark="bg"
        draggable="false"
        :src="ASSETS.webp_paths['confirm-bg']"
        class="z-[100] absolute object-none mt-[23px]"
    )
    tn: div(
        v-if="CONFIRM.echo.patreon_mode && CONFIRM.echo.show_content"
        mark="patreon top line with links"
        class="absolute top-[370px] w-full flex items-center ml-[547px] z-[300]"
    )
        p(
            class="text-tan font-semibold text-[26px] leading-[40px]"
        ) Get access key for $<span class="ml-[2px]">5</span> / month:
        info-link( platform="patreon")
        info-link( platform="boosty" class="ml-[-30px]")
    tn: div(
        v-if="CONFIRM.echo.patreon_mode && CONFIRM.echo.show_content"
        class="absolute mt-[400px] ml-[500px] z-[200] w-[880px] h-[170px] px-[30px] flex justify-center gap-[10px] items-center"
    )
        p(
            mark="patreon input left text"
            class="text-tan font-semibold text-[26px] leading-[40px] mt-[15px]"
        ) Please provide access key:
        input(
            ref="input"
            class="bg-tan/70 saturate-[.5] focus:outline-none rounded-md w-[400px] h-[50px] ml-[25px] mt-[20px] text-[30px] text-[#3d2e2b] px-[20px] z-[300] font-semibold cursor-none"
            @input="handle_input()"
            @focus="() => CONFIRM.echo.input_focus = true"
            @blur="() => CONFIRM.echo.input_focus = false"
            maxlength="16"
        )
    tn: div(
        mark="regular text"
        v-if="!CONFIRM.echo.patreon_mode && CONFIRM.echo.show_content"
        class="absolute mt-[350px] ml-[500px] z-[200] w-[880px] h-[200px] px-[30px] flex flex-col justify-center gap-[0px] items-center"
    )
        p(
            class="text-tan font-semibold text-[26px] text-center leading-[40px] mt-[15px] text-justify"
        ) {{ CONFIRM.echo.text }}
        p(
            class="text-tan font-semibold text-[26px] text-center leading-[40px] mt-[15px]"
        ) {{ CONFIRM.echo.text_2 }}
    div(
        v-for="(button_text, index) in CONFIRM.echo.button_texts"
        :key="index"
        class="absolute ml-[580px] mt-[560px] w-[300px] h-[70px] z-[300]"
        :class="{ 'ml-[992px]': index === 1, 'ml-[790px] mt-[540px]': index === 1 && !CONFIRM.echo.double_button }"
    )
        tn: div(
            class="w-full h-full flex justify-center items-center"
            v-show="(CONFIRM.echo.double_button || index === 1) && CONFIRM.echo.show_content"
        )
            tn: settings-frame(
                class="mt-[30px]"
                v-if="resolve_focus(index)" :class="{ 'w-[470px] ml-[50px]': SETTINGS.echo.general.showKeys, 'w-[420px]': !SETTINGS.echo.general.showKeys }"
            )
            tn: hotkey-icon(
                mark="gamepad action key"
                :hueAffected="false"
                inputEvent="resolve setting action"
                class="top-[24px] left-[288px]"
                v-if="resolve_focus(index) && SETTINGS.echo.general.showKeys && GLOBAL.lastActiveDevice === 'gamepad'"
            )
            div( class="absolute w-[200px] h-fit z-[10] flex justify-center" )
                setting-button-bg(
                    class="z-[-10] w-[max(calc(100%+58px),200px)] scale-[1.1]"
                    :pressed="resolve_pressed(index)"
                )
                p(
                    mark="pressed button title light"
                    v-show="resolve_pressed(index)"
                    class="absolute blur-[3px] opacity-[0.5] text-[22px] font-bold pointers-events-none z-[20] text-tan"
                    :class="text_class()"
                ) {{ button_text }}
                p(
                    mark="setting name"
                    class="text-[22px] font-bold pointers-events-none z-[20] text-tan"
                    :class="text_class()"
                ) {{ button_text }}
                tn( type="fast" ): div(
                    mark="front clickable container"
                    @click="handle_click(index)"
                    class="absolute w-[250px] rounded-3xl mt-[10px] bg-tan opacity-0 hover:opacity-[0.1] hover:saturate-[3.5] blur-[2px] transition-opacity duration-[100ms] ease-in-out z-[20]"
                    :class="SETTINGS.echo.button_pressed ? 'h-[50px]' : 'h-[52px]'"
                )
</template>
<script setup lang="ts">
const resolve_focus = computed(() => {
    return (index) => {
        return SETTINGS.echo.focus.confirm_index === index
    }
})
const resolve_pressed = computed(() => {
    return (index) => {
        return (
            SETTINGS.echo.button_pressed &&
            index === SETTINGS.echo.focus.confirm_index
        )
    }
})
const handle_click = (index) => {
    SETTINGS.echo.button_pressed = true
    SETTINGS.echo.focus.confirm_index = index
    TIME.after(150, () => {
        if (index === 0) CONFIRM.echo.left_fn()
        else CONFIRM.echo.right_fn()
        SETTINGS.echo.button_pressed = false
    })
}
const text_class = computed(() => {
    return () => {
        const pressed =
            // SETTINGS.echo.focus.column_index === column_index &&
            // SETTINGS.echo.focus.row_index === row_index &&
            SETTINGS.echo.button_pressed
        return {
            "mt-[19px]": !pressed,
            "mt-[20px]": pressed,
        }
    }
})
const input: any = ref(null)
const handle_input = () => {
    CONFIRM.echo.input = input.value.value
}
onMounted(() => (REFS.input = input))
</script>
<style>
::selection {
    background: #3d2e2b;
    color: #f9e4d4;
}
::-moz-selection {
    background: #3d2e2b;
    color: #f9e4d4;
}
</style>
