<template lang="pug">
div()
  div(
    v-for="(overlay, index) in INTERFACE.damageOverlays"
    :key="index"
    class="absolute w-[100px] h-[100px] flex justify-center items-center"
    :style="damageStyle(overlay)"
  )
    p(
      v-if="!overlay.hero"
      class="absolute z-10 font-hat text-[36px] font-black blur-[0.6px] brightness-[0.3] saturate-[0.1] opacity-[0.7] "
      :style="textStyle(overlay, true)"
    ) {{ overlay.damage }}
    p(
      v-if="overlay.hero"
      class="absolute z-10 font-hat text-[36px] font-black blur-[1px] brightness-[10] saturate-[0.1] opacity-[0.7]"
      :style="textStyle(overlay, true)"
    ) {{ overlay.damage }}
    p(
      class="absolute z-10 font-hat text-[36px] font-black"
      :style="textStyle(overlay)"
    ) {{ overlay.damage }}
</template>
<script setup lang="ts">
const textStyle = computed(() => {
  return (overlay, shadow = false) => {
    const styleObject = {
      color: "#d6ecec",
    }
    if (shadow) {
      _.merge(styleObject, { "text-stroke": "10px #d6ecec" })
    }
    if (overlay.hero) {
      _.merge(styleObject, {
        color: "#531500",
      })
      if (shadow) {
        _.merge(styleObject, { "text-stroke": "10px #531500" })
      }
    }
    return styleObject
  }
})
const damageStyle = computed(() => {
  return (overlay: DamageOverlay) => {
    const damageHeight = overlay.entityHeight * 1.5
    return {
      left: overlay.screen.x - 50 + "px",
      top: overlay.screen.y - 50 - damageHeight + "px",
      opacity: overlay.screen.opacity,
      transform: `scale(${overlay.screen.scale})`,
    }
  }
})
</script>
