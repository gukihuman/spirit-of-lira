<template lang="pug">
div(
  v-if="condition"
  class="absolute left-[780px] top-[80px] w-[450px] h-[55px] pt-2 z-[100]"
  class="bg-slate-800/50 flex justify-center items-center rounded-xl"
)
  p(
    class="text-slate-300 text-2xl font-semibold mb-4"
  )
    | audio waits for any player action
</template>
<script setup lang="ts">
const condition = computed(() => {
    return (
        AUDIO.echo.state === "suspended" && NOVEL.echo.active_scene !== "adult"
    )
})
</script>
