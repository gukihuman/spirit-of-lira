<template lang="pug">
div(class="z-30")
  div(class="absolute w-[1920px] h-[1080px] bg-gray-900 opacity-[0.4]")
  img(
    :src="ASSETS.webps['settings-bg']"
    draggable="false"
    class="absolute"
  )
  div(class="absolute w-[1165px] h-[85px] left-[366px] top-[145px] flex justify-center items-center")
    settings-tab(v-for="i in [0, 1, 2, 3]" key="i" :index="i")
</template>
<script setup lang="ts"></script>
