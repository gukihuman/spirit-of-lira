<template lang="pug">

div
  DevTitle
    div creature
  div(class="grid grid-rows-8 grid-cols-5 grid-flow-col gap-x-2 \
  text-2xl")
    DevLine(
      v-if="Dev().selectedCreature"
      v-for="(value, key, index) in selectedCreature()" :key="index"
    )
      div {{ key }}
      div {{ typeof value === "number" ? value.toFixed() : value }}

</template>
<script setup lang="ts">
function selectedCreature() {
  return Game().entities.find((e) => e.id === Dev().selectedCreature)
}
</script>
