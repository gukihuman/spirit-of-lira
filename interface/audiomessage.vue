<template lang="pug">
div(
  v-if="condition"
  class="absolute left-[1100px] top-[80px] w-[640px] h-[60px] pt-2 z-[100]"
  class="bg-slate-800/50 flex justify-center items-center rounded-xl"
)
  p(
    class="text-slate-300 text-2xl font-semibold mb-4"
  )
    | browser audio waits for press any key or click
</template>
<script setup lang="ts">
const condition = computed(() => {
  return (
    AUDIO.echo.context_state === "suspended" &&
    SCENE_ACTIVE.name !== "a0-adult-check"
  )
})
</script>
