<template lang="pug">
div(class="absolute h-[150px]")
  img(:src="ASSETS.webps['settings-frame-shadow']"
  class="absolute h-full opacity-50")
  div(class="absolute h-full w-[80%] overflow-hidden")
    img(:src="ASSETS.webps['settings-frame-left']"
    class="absolute object-left object-cover h-full")
  div(class="absolute h-full w-[30%] right-0 overflow-hidden")
    img(:src="ASSETS.webps['settings-frame-right']"
    class="absolute object-right object-cover h-full bottom-[1px]")
</template>
