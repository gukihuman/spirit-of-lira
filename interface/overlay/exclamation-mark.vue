<template lang="pug">
div(
    class="absolute w-[140px] h-[140px] z-[10] transition duration-[200ms] ease-in-out rounded-full"
    :class="{ 'hover:brightness-[1.15] hover:scale-[1.03]': INTERFACE.talk }"
    :style="style"
    @mouseover="INTERFACE.buttonHover = true"
    @mouseleave="INTERFACE.buttonHover = false"
    @click="TALK.emit()"
)
    img(
        :src="ASSETS.webp_paths['exclamation-mark']"
        draggable="false"
        class="absolute contrast-[1.05] scale-[1] transition-all duration-[300ms] ease-in-out"
        :class="{'saturate-[0.6] scale-[0.9]': !INTERFACE.talk}"
    )
    tn: hotkey-icon(
        v-show="INTERFACE.talk"
        class="top-[78px] left-[90px]" inputEvent="talk"
    )
</template>
<script setup lang="ts">
const style = computed(() => {
    return {
        left: INTERFACE.talkPOS.x + "px",
        top: INTERFACE.talkPOS.y + "px",
    }
})
</script>
