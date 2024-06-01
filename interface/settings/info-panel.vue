<template lang="pug">
div(
    mark="info"
    v-if="resolve_show_panel"
    class="absolute w-full h-full flex justify-center"
)
    div( class="w-full h-[500px] px-[80px] flex flex-col mt-[20px]" )
        p(
            mark="version"
            class="text-tan font-lilita text-[28px]"
        ) {{ GLOBAL.version }} early demo
        p(
            mark="text"
            class="text-tan font-semibold mt-[10px] text-[26px] text-justify leading-[40px]"
            v-for="line in text"
            v-html="line"
        )
    div( class="absolute px-[55px] top-[320px] w-full flex ml-[30px]" )
        info-link( platform="x" class="w-[125px]")
        info-link( platform="discord")
        info-link( platform="patreon")
        info-link( platform="boosty")
        info-link( platform="github")
    p(
        mark="thanks"
        class="px-[80px] text-center absolute text-tan font-courgette mt-[20px] text-[28px] bottom-[40px] opacity-[0.80] scale-y-[0.9]"
    ) Special thanks to Psycho-Nerd, General-Tomato, and Karpai. <br> ♡ My first three patrons ever. ♡
</template>
<script setup lang="ts">
const text = [
    "Hi I'm Guki, the dev.",
    "In this early demo there is only one story event (it's not a main plot).",
    "Keep an eye on my socials for updates and support me on Patreon or Boosty, I would really appreciate it.",
]
const resolve_show_panel = computed(() => {
    if (!SETTINGS.echo.show_panel) return
    return CONTEXT.echo.settings === "info"
})
</script>
