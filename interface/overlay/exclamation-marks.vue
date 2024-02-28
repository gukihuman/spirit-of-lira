<template>
    <div>
        <div
            v-for="(POS, i) in INTERFACE.talk_POSs"
            :key="i"
            @mouseover="resolve_mouseover(i)"
            @mouseleave="resolve_mouseleave(i)"
            class="absolute w-[140px] h-[140px] z-[-10] transition duration-[200ms] ease-in-out rounded-full"
            :class="{
                'hover:brightness-[1.15] hover:scale-[1.08]':
                    INTERFACE.talk && i === INTERFACE.closest_talk_ent_i,
            }"
            :style="style(i)"
            @click="TALK.emit()"
        >
            <img
                :src="ASSETS.webp_paths['exclamation-mark']"
                draggable="false"
                class="absolute contrast-[1.05] scale-1 transition-all duration-[300ms] ease-in-out"
                :class="{
                    'saturate-[0.6] scale-[0.7]': !INTERFACE.talk,
                }"
            />
            <tn name="medium">
                <hotkey-icon
                    v-show="INTERFACE.talk"
                    class="top-[78px] left-[90px]"
                    inputEvent="talk"
                />
            </tn>
        </div>
    </div>
</template>
<script setup lang="ts">
const resolve_mouseover = (i) => {
    if (!INTERFACE.talk || i !== INTERFACE.closest_talk_ent_i) return
    INTERFACE.buttonHover = true
}
const resolve_mouseleave = (i) => {
    if (!INTERFACE.talk || i !== INTERFACE.closest_talk_ent_i) return
    INTERFACE.buttonHover = false
}
const style = computed(() => {
    return (i: number) => {
        return {
            left: INTERFACE.talk_POSs[i].x + "px",
            top: INTERFACE.talk_POSs[i].y + "px",
        }
    }
})
</script>
