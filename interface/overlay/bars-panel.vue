<template lang="pug">
div(
    class="absolute relative top-[950px] left-[520px]"
    :class="{ 'blur': CONTEXT.echo.confirm }"
)
    img(:src="ASSETS.webp_paths['bars-panel-bg']" class="absolute" draggable="false")
    img(
        v-show="HERO.ent.STATE && HERO.ent.STATE.active !== 'dead'"
        :src="ASSETS.webp_paths['bars-panel-health']" draggable="false"
        class="absolute right-[1522px] top-3 h-[60px] object-right object-cover hue-rotate-[-20deg] brightness-[0.09] saturate-[5] opacity-[0.4] blur-[0.5px]"
        :style="health_delayed"
    )
    img(
        v-show="HERO.ent.STATE && HERO.ent.STATE.active !== 'dead'"
        :src="ASSETS.webp_paths['bars-panel-health']" draggable="false"
        class="absolute right-[1522px] top-3 h-[60px] object-right object-cover transition-all duration-[70ms] ease-in-out"
        :style="health"
    )
    img(
        v-show="HERO.ent.STATE && HERO.ent.STATE.active !== 'dead'"
        :src="ASSETS.webp_paths['bars-panel-energy']" draggable="false"
        class="absolute left-[460px] top-3 h-[60px] object-left object-cover transition-all duration-[70ms] ease-in-out"
        :style="energy"
    )
    //- img(:src="ASSETS.webp_paths['bars-panel-exp']" draggable="false" class="absolute")
    div(class="absolute z-10 w-[60px] h-[60px] top-[11px] left-[399px] flex items-center justify-center")
        p(class="absolute font-hat text-chestnut text-[30px] font-black blur-[3px] brightness-[2.8] saturate-[0.4] scale-[1.1] ") 1
        p(class="font-hat text-chestnut text-[30px] font-black brightness-[0.7]") 1
</template>
<script setup lang="ts">
const health_delayed = computed(() => {
    return {
        width:
            (INTERFACE.hero_health_delayed / INTERFACE.heroMaxHealth) * 380 +
            "px",
    }
})
const health = computed(() => {
    return {
        width: (INTERFACE.heroHealth / INTERFACE.heroMaxHealth) * 380 + "px",
    }
})
const energy = computed(() => {
    return {
        width: (INTERFACE.heroEnergy / INTERFACE.heroMaxEnergy) * 380 + "px",
    }
})
</script>
