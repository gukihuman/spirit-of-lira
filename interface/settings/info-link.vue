<template lang="pug">
div( class="relative w-fit h-fit flex p-[10px] pr-[5px]" )
    div(
        mark="hover receiver container"
        class="z-[50] w-full h-full absolute"
        @mouseover="hover = true"
        @mouseleave="hover = false"
        @click="open_link()"
    )
    div(
        mark="x-logo"
        class="flex justify-center items-center h-[50px] w-[50px] transition-all duration-[80ms] ease-in-out ml-[20px]"
        :class="{ 'ml-[20px]': is_hover, 'scale-[1.1]': is_hover, 'hue-rotate-[130deg]': is_hover, 'brightness-[1.1]': is_hover, 'saturate-[1.3]': is_hover }"
    )
        img(
            :src="ASSETS.get_webp_path(props.platform)"
            draggable="false"
            class="object-cover w-full"
        )
    div: p(
            mark="link text hover light"
            class="left-[65px] z-[-10] ml-[10px] text-sky-blue font-semibold mt-[10px] text-[26px] leading-[28px] hover:scale-[1.05] transition duration-[100ms] ease-in-out blur-[5px] opacity-0"
            :class="{ 'opacity-[0.15]': is_hover }"
        ) {{ props.platform.toUpperCase() }}
    div(
        class="absolute left-[68px] w-fit px-[10px] h-[50px] transition-all duration-[150ms] ease-in-out"
        :class="{ 'left-[73px]': is_hover }"
    )
        p(
            mark="link text"
            class="ml-[10px] text-tan font-semibold mt-[10px] text-[26px] leading-[32px] transition-all duration-[100ms] ease-in-out z-10"
            :class="{ 'text-sky-blue': is_hover, 'brightness-[1.1]': is_hover }"
        ) {{ _.capitalize(props.platform) }}

</template>
<script setup lang="ts">
const open_link = () => window.open(link.value, "_blank")
const props = defineProps({
    platform: { type: String, default: "x" },
})
const link = computed(() => {
    if (props.platform === "x") {
        return "https://x.com/gukihuman"
    } else if (props.platform === "discord") {
        return "https://discord.gg/VFJMmyyE67"
    } else if (props.platform === "patreon") {
        return "https://patreon.com/gukihuman"
    } else if (props.platform === "github") {
        return "https://github.com/gukihuman/spirit-of-lira/blob/main/README.md"
    } else {
        return "https://boosty.to/gukihuman"
    }
})
const hover = ref(false)
const is_hover = computed(() => {
    return hover.value
})
</script>
