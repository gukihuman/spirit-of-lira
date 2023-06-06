<template lang="pug">

div(
  ref="viewport"
  class="absolute transition duration-200"
  :class="{ 'blur': SYSTEM_DATA.states.inventory }"
)

</template>
<script setup lang="ts">
//
const viewport = ref(null)

onMounted(() => {
  //
  // To init pixi and INPUT with
  SYSTEM_DATA.refs.viewport = viewport
})
</script>
