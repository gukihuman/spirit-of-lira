<template lang="pug">
div(
  class="relative w-[90px] hover:brightness-[1.15] transition duration-150 ease-in-out opacity-[0.8]"
)
    div(
        class="relative flex justify-center items-center hover:scale-[1.1] transition duration-150 ease-in-out h-[45px] bg-space-cadet rounded-lg saturate-[.80] hue-rotate-[0deg] brightness-[1] opacity-[0.9] shadow"
        @click="EVENTS.emitSingle('close novel')"
        @mouseover="INTERFACE.buttonHover = true"
        @mouseleave="INTERFACE.buttonHover = false"
        )
        p(
        class="absolute z-10 text-tan text-[23px] mt-[6px] font-semibold mb-2 points-events-none transition duration-1000 ease-in-out opacity-[1]"
        :class="CONTEXT.echo.novel ? { 'hue-rotate-180': true } : {}"
        ) Close
    hotkey-icon(class="top-[10px] left-[76px]" inputEvent="close novel")
</template>
