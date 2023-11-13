<template lang="pug">

div(class="absolute relative top-[950px] left-[520px]")
  img(:src="ASSETS.webps.bars" class="absolute" draggable="false")
  img(
    v-show="SH.hero.STATE && SH.hero.STATE.active !== 'dead'"
    :src="ASSETS.webps['bars-health']" draggable="false"
    class="absolute right-[1522px] top-3 h-[60px] object-right object-cover transition-all duration-150 ease-in-out"
    :style="health"
  )
  img(
    v-show="SH.hero.STATE && SH.hero.STATE.active !== 'dead'"
    :src="ASSETS.webps['bars-energy']" draggable="false"
    class="absolute left-[460px] top-3 h-[60px] object-left object-cover transition-all duration-150 ease-in-out"
    :style="energy"
  )
  //- img(:src="ASSETS.webps['bars-exp']" class="absolute" draggable="false" )

</template>
<script setup lang="ts">
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
