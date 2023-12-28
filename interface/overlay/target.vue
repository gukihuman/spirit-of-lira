<template lang="pug">
div(class="absolute relative top-[20px] left-[757px]")
    img(:src="ASSETS.webp_paths.target" class="absolute" draggable="false")
    img(
        :src="ASSETS.webp_paths['target-health']"
        class="absolute left-0 w-[400px] h-[100px] object-left object-cover hue-rotate-[-20deg] brightness-[0.09] saturate-[5] opacity-[0.4] blur-[0.5px]"
        draggable="false"
        :style="health_delayed"
    )
    img(
        :src="ASSETS.webp_paths['target-health']"
        class="absolute left-0 w-[400px] h-[100px] object-left object-cover transition-all duration-[70ms] ease-in-out"
        draggable="false"
        :style="health"
    )
    tn( type="fast" ): img(
        :src="ASSETS.webp_paths['target-lock']"
        class="absolute"
        draggable="false"
        v-show="INTERFACE.targetLocked"
    )
    div(class="absolute top-[13px] left-[84px] w-[205px] h-[40px] pl-[30px] flex justify-center")
        p(class="text-tan text-2xl font-semibold mb-4") Bunbo
</template>
<script setup lang="ts">
const health_delayed = computed(() => {
    return {
        width:
            (INTERFACE.target_health_delayed / INTERFACE.targetMaxHealth) *
                400 +
            "px",
    }
})
const health = computed(() => {
    return {
        width:
            (INTERFACE.targetHealth / INTERFACE.targetMaxHealth) * 400 + "px",
    }
})
</script>
