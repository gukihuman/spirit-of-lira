<template lang="pug">
div(
    mark="settings"
    v-show="CONTEXT.echo.settings"
    class="relative z-[100]"
)
    div(
        mark="dim"
        class="z-[80] absolute w-[1920px] h-[1080px] opacity-[0.4] bg-gray-900"
    )
    img(
        mark="bg"
        draggable="false"
        :src="ASSETS.webp_paths['settings-bg']"
        class="z-[100] absolute"
    )
    div(
        mark="tabs"
        class="flex justify-center items-center w-[1165px] h-[85px] left-[360px] top-[145px] absolute z-[120]"
    )
        settings-tab(
            v-for="(context, i) in SETTINGS.context_list"
            :key="i"
            :context="context"
        )
    tn: div(
        mark="tab switch gamepad icons"
        v-if="GLOBAL.lastActiveDevice === 'gamepad'"
        class="z-[150]"
    )
        hotkey-icon(
            static="LB"
            class="left-[390px] top-[145px]"
        )
        hotkey-icon(
            static="RB"
            class="left-[1450px] top-[145px]"
        )
    div(
        mark="panel"
        class="z-[100] absolute w-[1150px] h-[620px] top-[230px] left-[372px]"
    )
        tn( type="swipe" ): hotkeys-panel( device="keyboard" )
        tn( type="swipe" ): hotkeys-panel( device="gamepad" )
</template>
<style>
.swipe-enter-active,
.swipe-leave-active {
    transition: all 200ms ease;
}
.swipe-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}
.swipe-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>
