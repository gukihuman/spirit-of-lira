<template lang="pug">

div(ref="viewport" class="absolute")

</template>
<script setup lang="ts">
//
const viewport = ref(null)

onMounted((): void => {
  //
  // To initialize pixi with
  ggm.refs.viewport = viewport

  // chrome dev extension
  function hookPixiDev(window?: any, PIXI?: any) {
    window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
      window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })
  }
  hookPixiDev(window, p)
})
</script>
