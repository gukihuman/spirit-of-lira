<template lang="pug">
div(
  class="relative w-[82px] hover:brightness-[1.15] transition duration-150 ease-in-out opacity-[0.8]"
)
  div(
    class="relative flex justify-center items-center hover:scale-[1.05] transition duration-150 ease-in-out h-[45px] bg-space-cadet rounded-lg saturate-[.80] brightness-[1.1] opacity-[0.9] border-4 border-slate-700"
    @click="EVENTS.emitSingle('skipScene')"
    @mouseover="INTERFACE.skipHover = true"
    @mouseleave="INTERFACE.skipHover = false"
    )
    p(
      class="absolute z-10 text-tan text-[23px] mt-[6px] font-semibold mb-2 points-events-none transition duration-1000 ease-in-out opacity-[.9]"
      :class="GLOBAL.context === 'scene' ? { 'hue-rotate-180': true } : {}"
    ) Skip
  keys(class="top-[10px] left-[66px]" inputEvent="skipScene")
</template>
