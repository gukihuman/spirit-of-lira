<template lang="pug">
div(
  class="absolute w-[120px] hover:brightness-[1.15] transition duration-150 ease-in-out top-[550px] left-[890px]"
)
  div(
    class="relative flex justify-center items-center hover:scale-[1.05] transition duration-150 ease-in-out h-[80px]"
    @click="EVENTS.emitSingle('reset')"
    @mouseover="INTERFACE.buttonHover = true"
    @mouseleave="INTERFACE.buttonHover = false"
    )
    img(
      :src="ASSETS.webps.talk"
      draggable="false"
      class="absolute object-none"
    )
    p(class="absolute z-10 text-tan text-[25px] font-semibold mb-2 points-events-none") Reset
  keys(class="top-[30px] left-[87px]" inputEvent="reset")
</template>
