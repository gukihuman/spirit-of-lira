<template lang="pug">

div(class="absolute relative top-[950px] left-[520px]")
  img(:src="ASSETS.webps.bars" class="absolute" draggable="false")
  img(
    :src="ASSETS.webps['bars-health']" draggable="false"
    class="absolute left-0 w-[858px] h-[141px] object-left object-cover"
    :style="health"
  )
  img(:src="ASSETS.webps['bars-mana']" class="absolute" draggable="false")
  //- img(:src="ASSETS.webps['bars-exp']" class="absolute" draggable="false" )

</template>
<script setup lang="ts">
const health = computed(() => {
  return {
    width: (INTERFACE.heroHealth / INTERFACE.heroMaxHealth) * 400 + "px",
  }
})
</script>
