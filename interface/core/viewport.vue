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
    blur: CONTEXT.echo.world?.interface,
    "opacity-0": CONTEXT.echo.scene,
  }
})
onMounted(() => {
  // To init pixi and INPUT with
  REFS.viewport = viewport
})
</script>
