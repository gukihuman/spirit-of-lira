<template lang="pug">
div(class="z-30")
  div(mark="settings-dim"
    class="absolute w-[1920px] h-[1080px] opacity-[0.4] bg-gray-900")
  img(mark="settings-bg" :src="ASSETS.webps['settings-bg']" class="absolute")
  tn: div(mark="settings-gamepad-icons"
    v-if="GLOBAL.lastActiveDevice === 'gamepad'")
    img(:src="ASSETS.webps['gamepad-key-lb']"
      class="absolute object-none left-[396px] top-[145px]")
    img(:src="ASSETS.webps['gamepad-key-rb']"
      class="absolute object-none left-[1456px] top-[145px]")
  div(mark="settings-tabs" class="flex justify-center items-center"
    class="absolute w-[1165px] h-[85px] left-[366px] top-[145px]")
    settings-tab(mark="settings-tab"
      v-for="i in [0, 1, 2, 3]" key="i" :index="i")
</template>
