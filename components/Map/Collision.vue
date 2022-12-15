<template lang="pug">
div(v-for='({}, y) in 40' :key='y' class='h-[120px]')
  div(
    v-for='({}, x) in 40' :key='x'
    class='opacity-50 w-[120px] h-[120px] \
    border-2 border-gray-800 inline-block'
    :style="{background: collision[y][x] ? '#14213d' : ''}"
    )

</template>
<script setup>
const collision = computed(() => {
  return Map().collision
})
</script>
