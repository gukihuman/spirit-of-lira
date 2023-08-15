<template lang="pug">
div(class="z-30 relative")
  //- div(class="absolute w-[1920px] h-[1080px]")
  img(
    :src="INTERFACE.scene.mainImage"
    draggable="false"
    class="absolute"
  )
  img(
    v-for="(value, index) in INTERFACE.scene.additionalImages"
    :key="index"
    :src="ASSETS.webps[value]"
    draggable="false"
    class="absolute"
  )
</template>
<script setup lang="ts">
import { Assets } from "pixi.js"

onMounted(() => {
  console.log(ASSETS.webps)
})
</script>
