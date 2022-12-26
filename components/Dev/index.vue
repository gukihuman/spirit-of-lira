<template lang="pug">

div(class="absolute w-full h-full z-30 p-4 pt-0 \
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
  //- DevEntity
  //- DevKeyboard(v-if="States().bobcat")
  //- DevPerformance
  //- DevButtonEquip



</template>
