<template lang="pug">
div(class="z-30")
  div(name="dim"
      class="absolute w-[1920px] h-[1080px] opacity-[0.4] bg-gray-900")
  img(name="settings-bg"
      :src="ASSETS.webps['settings-bg']"
      draggable="false"
      class="absolute")
  transition: div(v-if="GLOBAL.lastActiveDevice === 'gamepad'")
    img(:src="ASSETS.webps['gamepad-key-lb']" draggable="false" class="absolute object-none left-[396px] top-[145px]")
    img(:src="ASSETS.webps['gamepad-key-rb']" draggable="false" class="absolute object-none left-[1456px] top-[145px]")
  div(class="absolute w-[1165px] h-[85px] left-[366px] top-[145px] flex justify-center items-center")
    settings-tab(v-for="i in [0, 1, 2, 3]" key="i" :index="i")
</template>
<script setup lang="ts"></script>
