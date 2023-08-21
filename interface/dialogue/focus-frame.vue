<template lang="pug">
div(
  v-if="index === ACTIVE_SCENE.focusedChoiceIndex"
  class="absolute w-[104%] h-full ml-[-2%] -z-50"
)
  div(
    class="absolute rounded-2xl w-[104%] ml-[-2%] h-full bg-gradient-to-b from-dark-gunmetal to-space-cadet opacity-[0.20]"
  )
  div(
    class="absolute border-x-[8px] rounded-2xl w-full h-full border-blue-300 opacity-50"
  )
</template>
<script setup lang="ts">
const props = defineProps(["index"])
</script>
