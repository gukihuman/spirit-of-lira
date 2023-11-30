<template lang="pug">
div
  div(
    v-for="(overlay, index) in INTERFACE.damageOverlays" :key="index"
    class="absolute w-[100px] h-[100px] flex justify-center items-center"
    :style="damageStyle(overlay)"
  )
    p(
      class="absolute z-10 font-hat font-black blur-[1px] opacity-[0.35]"
      :style="textShadowStyle(overlay)"
    ) {{ overlay.damage }}
    p(
      class="absolute z-10 font-hat font-black"
      :style="textStyle(overlay)"
    ) {{ overlay.damage }}
</template>
<script setup lang="ts">
const textShadowStyle = computed(() => {
  return (overlay, shadow = false) => {
    const styleObject = {
      "font-size": "32px",
      "text-stroke": "10px #d6ecec",
      "text-stroke-color": "black",
    }
    if (overlay.hero) {
      _.merge(styleObject, {
        "font-size": "34px",
        "text-stroke": "10px #531500",
        "text-stroke-color": "white",
      })
    }
    return styleObject
  }
})
const textStyle = computed(() => {
  return (overlay) => {
    const styleObject = {
      "font-size": "32px",
      color: "#d6ecd9",
    }
    if (overlay.hero) {
      _.merge(styleObject, {
        "font-size": "34px",
        color: "#531500",
      })
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
