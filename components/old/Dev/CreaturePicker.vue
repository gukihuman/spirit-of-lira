<template lang="pug">

div
  DevTitle
    div creature picker
  div(class="grid grid-rows-10 grid-cols-3 grid-flow-col gap-x-2")
    DevLine(
      v-for="(value, index) in Game().entities.filter(e => e.isCreature)"
      :key="index"
      @click="setSelectedCreature(value.id)"
      class="cursor-pointer"
    )
      div {{ value.name }}
      div {{ value.id }}

</template>
<script setup lang="ts">
function setSelectedCreature(id: number) {
  Dev().selectedCreature = id
  localStorage.setItem("selectedCreature", id.toString())
}
onMounted(() => {
  const selectedCreature = localStorage.getItem("selectedCreature")
  if (selectedCreature) Dev().selectedCreature = parseInt(selectedCreature)
})
</script>
