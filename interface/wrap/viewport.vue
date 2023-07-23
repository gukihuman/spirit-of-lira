<template lang="pug">

div(
  ref="viewport"
  class="absolute transition time-200"
  :class="{ 'blur': INTERFACE.inventory }"
)

</template>
<script setup lang="ts">
//
const viewport = ref(null)

onMounted(() => {
  //
  // To init pixi and INPUT with
  REFS.viewport = viewport
})
</script>
