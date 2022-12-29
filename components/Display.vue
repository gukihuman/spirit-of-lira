<template lang="pug">

div(ref="display" class="absolute")

</template>
<script setup lang="ts">
import type { Ref } from "vue"
import * as PIXI from "pixi.js"

const display: Ref = ref(null)

onMounted((): void => {
  hookPixiDev(window, PIXI) // chrome dev extension

  p().app = new PIXI.Application({
    width: Settings().displayWidth,
    height: Settings().displayHeight,
  })
  display.value.appendChild(p().app?.view)
})
</script>
