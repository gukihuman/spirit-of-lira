<template lang="pug">

div(ref="viewportRef" class="absolute")

</template>
<script setup lang="ts">
//
const viewportRef = ref(null)

onMounted((): void => {
  // chrome dev extension
  function hookPixiDev(window?: any, PIXI?: any) {
    window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
      window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })
  }
  hookPixiDev(window, p)
  Refs().viewport = viewportRef
})
</script>
