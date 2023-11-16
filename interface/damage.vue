<template lang="pug">
div(class="damage")
  div(
    v-for="(overlay, index) in INTERFACE.damageOverlays"
    :key="index"
    class="absolute w-[100px] h-[100px] flex justify-center items-center animate-translate-float-damage"
    :style="damageStyle(overlay)"
  )
    p(
      class="absolute z-10 font-fira text-[36px] font-bold"
      :style="textStyle(overlay)"
    ) {{ overlay.damage }}
</template>
<script setup lang="ts">
const textStyle = computed(() => {
  return (overlay) => {
    const styleObject = {
      "text-shadow": "0px 0px 6px rgba(0, 0, 0, 0.15)",
      color: "#c9e2e2",
    }
    if (overlay.hero) {
      _.merge(styleObject, {
        "text-shadow": "0px 0px 6px rgba(255, 205, 205, 0.15)",
        color: "#752308",
        fontSize: "46px",
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
      opacity: overlay.opacity,
    }
  }
})
</script>
