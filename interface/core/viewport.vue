<template lang="pug">
div(ref="viewport" :class="class_object"
  v-show="CONTEXT.echo.world || CONTEXT.echo.scene"
  class="absolute transition duration-[200ms] opacity-100")
</template>
<script setup lang="ts">
const viewport = ref(null)
const class_object = computed(() => {
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
