<template lang="pug">
div(
    v-show="CONTEXT.echo.novel" class="z-30 relative"
)
    //- layer one always on - content switched when layer two fully appears
    //- then layer two immidealtly turns off again and preloads next step
    div( mark="layer-one" )
        images( layer="layerOne" )
        dialogue( layer="layerOne" )
    tn: div(
        mark="layer-two"
        v-if="NOVEL.echo.activeLayer === 'layerTwo'"
    )
        images( layer="layerTwo" )
        dialogue( layer="layerTwo" )
    div(
        :style="style_object"
        class="absolute left-[35px] top-[1005px] flex gap-10"
        v-if="NOVEL.echo.active_md !== 'a0'"
    )
        skipScene
        navigate
    tn: div(
        mark="button-fullscreen"
        v-if="NOVEL.echo.active_md !== 'a0'"
        class="absolute top-[7px] right-[7px] saturate-[0.4] opacity-[0.8]"
    )
        gbutton(
            type="fullscreen"
            :icon_hue="160 + NOVEL.echo[NOVEL.echo.activeLayer].hue"
        )

    //- adult check
    div(
        mark="bg"
        v-if="NOVEL.echo.active_md === 'a0' && NOVEL.echo.stepIndex < 2"
        class="-z-10 w-full h-[1080px] bg-slate-800 relative pointer-events-none flex justify-center items-center"
    )
        p(
            class="w-[500px] h-[80px] mt-[-310px] text-[30px] font-semibold leading-10 text-red-400 text-center"
        ) This game is strictly 18+ 🔞
        div(
            class="mr-[1px] mt-[100px] w-[650px] h-[350px] opacity-[.80] absolute rounded-xl border-8 border-blue-400 saturate-[.60] brightness-[.8] bg-gradient-to-b from-blue-500 to-sky-700"
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
