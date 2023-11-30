<template lang="pug">
div(v-show="CONTEXT.echo.world?.interface?.inventory" class="z-30")
  div(class="absolute w-[1920px] h-[1080px] bg-gray-900 opacity-[0.4]")
  img(
    :src="ASSETS.webps['inventory-bg']"
    draggable="false"
    class="absolute"
  )
</template>
