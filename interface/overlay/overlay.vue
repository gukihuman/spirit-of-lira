<template lang="pug">
div(
    class="absolute z-0 overflow-hidden w-full h-full"
    v-show="CONTEXT.echo.world"
)
    div( v-show="!CONTEXT.echo.interface" )
        float-damage( v-if="INTERFACE.floatDamage" )
        tn: talk( v-show="INTERFACE.talk" )
        tn: reset( v-show="GLOBAL.reset" )
        tn( type="fast" ): target( v-show="INTERFACE.target" )
    bars-panel
    div(
        mark="gamepad-icon"
        v-if="GLOBAL.lastActiveDevice === 'gamepad'"
        class="absolute w-[100px] h-[100px] bottom-[20px] left-[45px]"
        class="flex items-center justify-center"
    )
        img(
            :src="ASSETS.webp_paths.gamepad"
            draggable="false"
        )
</template>
