<template lang="pug">

div(class="absolute w-full h-full z-30 p-4 \
\
grid grid-cols-16 grid-rows-9 gap-4 \
\
font-mono text-3xl text-gray-300")

  DevBox(class="col-span-3 row-span-4 col-end-17")
    DevMainCounter

  DevBox(class="col-span-5 row-span-5 row-start-1")
    DevCreaturePicker
    
  DevBox(class="col-span-16 row-span-4 row-start-6")
    DevCreature
  
  DevBox(class="col-span-3 row-span-2 col-start-6 row-start-1")
    DevMonitor
  
  DevButton(class="col-span-2 col-end-15 row-start-5" @click="equipBow()")
    div equip bow
  
  DevButton(class="col-span-2 col-end-17 row-start-5" @click="unequipBow()")
    div unequip bow

</template>
<script setup lang="ts">
function equipBow(): void {
  console.log("equipped")
}
function unequipBow(): void {
  console.log("unequipped")
}
</script>
