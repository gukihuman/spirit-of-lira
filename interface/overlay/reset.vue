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
    text-bg(class="z-[-10] ml-[0px] w-[calc(100%+20px)] scale-[1.1] contrast-[0.9]")
    p(class="absolute z-10 text-tan text-[25px] font-semibold mb-2 points-events-none") Reset
  hotkey-icon(class="top-[42px] left-[90px]" inputEvent="reset")
</template>
