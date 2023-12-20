<template lang="pug">
div(v-show="GLOBAL.firstUserGesture && !CONTEXT.echo.empty"
:style="cursorStyle"
class="absolute left-[100px] z-[999] w-[102px] h-[94px] pointer-events-none")
    img(v-show="cursor"
        :src="ASSETS.get_webp_path('cursor')"
        draggable="false" class="absolute")
    img(v-show="cursorNo"
        :src="ASSETS.get_webp_path('cursor-no')"
        draggable="false" class="absolute")
    img(v-show="cursorCast"
        :src="ASSETS.get_webp_path('cursor-cast')"
        draggable="false" class="absolute")
</template>
<script setup lang="ts">
const cursorStyle = computed(() => {
    const imageOffset = { x: 51, y: 47 }
    return {
        left: _.round(GLOBAL.mouseOfScreen.x - imageOffset.x) + "px",
        top: _.round(GLOBAL.mouseOfScreen.y - imageOffset.y) + "px",
    }
})
const cursor = computed(() => {
    if (GLOBAL.lastActiveDevice === "gamepad") return false
    if (CONTEXT.echo.interface || CONTEXT.echo.novel) return true
    if (INTERFACE.buttonHover) return true
    return (
        !GLOBAL.hoverId &&
        COLLISION.is_coord_clear(
            GLOBAL.mousePosition.x,
            GLOBAL.mousePosition.y,
            false
        )
    )
})
const cursorNo = computed(() => {
    if (GLOBAL.lastActiveDevice === "gamepad") return false
    if (CONTEXT.echo.interface || CONTEXT.echo.novel) return false
    if (INTERFACE.buttonHover) return false
    return (
        !GLOBAL.hoverId &&
        !COLLISION.is_coord_clear(
            GLOBAL.mousePosition.x,
            GLOBAL.mousePosition.y,
            false
        )
    )
})
const cursorCast = computed(() => {
    if (GLOBAL.lastActiveDevice === "gamepad") return false
    if (CONTEXT.echo.interface || CONTEXT.echo.novel) {
        return false
    }
    if (INTERFACE.buttonHover) return false
    return GLOBAL.hoverId
})
</script>
