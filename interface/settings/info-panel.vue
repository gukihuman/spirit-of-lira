<template lang="pug">
div(
    mark="info"
    v-if="resolve_show_panel"
    class="absolute w-full h-full flex justify-center"
)
    div( class="w-full h-[500px] px-[80px] flex flex-col mt-[30px]" )
        p(
            mark="version"
            class="text-tan font-lilita text-[28px]"
        ) {{ GLOBAL.version }}
        p(
            mark="text"
            class="text-tan font-semibold mt-[10px] text-[26px] text-justify leading-[40px]"
        ) Hey there! It's Guki, the dev behind the scenes. In this early version, I focused on making the basic game mechanics. Fingers crossed that there's a promising future ahead. I'm lining up items, bows, magic, skills, mobs, locations, and naturally, fresh story events. Keep an eye on my socials for updates.
    div( class="absolute px-[55px] top-[330px] w-full flex ml-[30px]" )
        info-link( platform="x" class="w-[125px]")
        info-link( platform="discord")
        info-link( platform="patreon")
        info-link( platform="boosty")
        info-link( platform="github")
    p(
        mark="thanks"
        class="px-[80px] text-center absolute text-tan font-courgette mt-[20px] text-[28px] bottom-[70px] opacity-[0.80]"
    ) Special thanks to Psycho-Nerd, General-Tomato, and Karpai. <br> ♡ My first three patrons ever. ♡
</template>
<script setup lang="ts">
const resolve_show_panel = computed(() => {
    if (!SETTINGS.echo.show_panel) return
    return CONTEXT.echo.settings === "info"
})
</script>
