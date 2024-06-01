<template lang="pug">
div(
    v-show="CONTEXT.echo.novel" class="z-[999] relative"
)
    tn: div(
        mark="fullscreen button"
        v-if="NOVEL.echo.active_md !== 'adult'"
        class="absolute top-[7px] right-[7px] saturate-[0.4] opacity-[0.8] z-[999]"
    )
        gbutton(
            type="fullscreen"
            :icon_hue="160 + NOVEL.echo[NOVEL.echo.activeLayer].hue"
        )
    tn: div(
        mark="settings button"
        v-if="NOVEL.echo.active_md !== 'adult'"
        class="absolute top-[0px] left-[0px] saturate-[0.4] opacity-[0.8]"
    )
        gbutton(
            type="settings"
            :icon_hue="160 + NOVEL.echo[NOVEL.echo.activeLayer].hue"
        )
</template>
<script setup lang="ts">
const transitionSpeed = computed(() => {
    return `opacity ${CONFIG.novel.transitionSpeed}ms ease`
})
const style_object = computed(() => {
    return {
        filter: `
            hue-rotate(${NOVEL.echo[NOVEL.echo.activeLayer].hue}deg) 
            brightness(${NOVEL.echo[NOVEL.echo.activeLayer].brightness})
        `,
    }
})
</script>
<style scoped>
.default-enter-active {
    transition: v-bind(transitionSpeed);
}
.default-leave-active {
    transition: opacity 0ms ease;
}
.default-enter-from {
    opacity: 0;
}
.default-leave-to {
    opacity: 1;
}
</style>
