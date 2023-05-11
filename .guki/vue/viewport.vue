<template lang="pug">

div(
  ref="viewport"
  class="absolute transition duration-200"
  :class="{ 'blur': gsd.states.inventory }"
)

</template>
<script setup lang="ts">
//
const viewport = ref(null)

onMounted(() => {
  //
  // To init pixi and gic with
  gsd.refs.viewport = viewport
})
</script>
