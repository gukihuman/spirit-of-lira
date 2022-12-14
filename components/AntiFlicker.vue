<template lang="pug">
div(class='absolute hidden')
  img(
    v-for="(source, index) in sources" :key="index"
    :src='source.src'
  )

</template>
<script setup>
import { sources } from "@/composables/imports/webp"
</script>
