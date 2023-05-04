<template lang="pug">

div(
  ref="viewport"
  class="absolute transition duration-200"
  :class="{ 'blur': gsd.states.context !== 'gameplay' }"
)

</template>
<script setup lang="ts">
//
const viewport = ref(null)

onMounted(() => {
  //
  // To initialize pixi and gic with
  gsd.refs.viewport = viewport
})
</script>
