<template lang="pug">

div(
  ref="viewport"
  class="absolute transition time-200"
  :class="{ 'blur': REACTIVE.states.inventory }"
)

</template>
<script setup lang="ts">
//
const viewport = ref(null)

onMounted(() => {
  //
  // To init pixi and INPUT with
  REACTIVE.refs.viewport = viewport
})
</script>
