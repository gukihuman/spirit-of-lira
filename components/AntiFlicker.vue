<template lang="pug">
div(class='absolute opacity-0')
  img(
    v-for="(webp, index) in webp" :key="index"
    :src='webp.src'
  )

</template>
<script setup>
import { webp } from "@/composables/imports/webp"
</script>
