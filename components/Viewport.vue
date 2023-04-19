<template lang="pug">

div(ref="viewport" class="absolute")

</template>
<script setup lang="ts">
//
const viewport = ref(null)

onMounted((): void => {
  //
  // To initialize pixi and gic with
  gsd.refs.viewport = viewport
})
</script>
