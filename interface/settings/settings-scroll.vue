<template lang="pug">
div(class="absolute h-[75px]")
  img(:src="ASSETS.webps['settings-scroll-shadow']"
  class="absolute h-full w-[88%] left-[6%] opacity-50")
  div(class="absolute h-full w-[80%] overflow-hidden")
    img(:src="ASSETS.webps['settings-scroll-left']"
    class="absolute object-left object-cover h-full")
  div(class="absolute h-full w-[30%] right-0 overflow-hidden")
    img(:src="ASSETS.webps['settings-scroll-right']"
    class="absolute object-right object-cover h-full")
</template>
