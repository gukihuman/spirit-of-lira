<template lang="pug">
div(
    v-show="CONTEXT.echo.world"
    :class="{ 'blur': CONTEXT.echo.confirm }"
)
    tn: div(
        mark="button-settings"
        class="absolute top-[7px] left-[7px] z-[999]"
    )
        gbutton( type="settings" )
    tn: div(
        mark="button-fullscreen"
        class="absolute top-[7px] right-[7px] z-[999]"
    )
        gbutton( type="fullscreen" )
    //- div(mark="buttons-panel-left" class="absolute w-[500px] h-[150px] bottom-0"
    //-   class="flex items-center justify-end gap-3")
    //-     gbutton(type="girls")
</template>
