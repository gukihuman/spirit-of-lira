<template lang="pug">

transition: div(
  ref="viewport"
  class="absolute transition duration-[200ms] opacity-100"
  :class="classes"
)

</template>
<script setup lang="ts">
const viewport = ref(null)
const classes = computed(() => {
  return {
    blur: INTERFACE.inventory,
    "opacity-0": GLOBAL.context === "scene",
  }
})
onMounted(() => {
  // To init pixi and INPUT with
  REFS.viewport = viewport
})
</script>
