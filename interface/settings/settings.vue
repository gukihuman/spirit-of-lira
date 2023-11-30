<template lang="pug">
div(v-show="CONTEXT.echo.world?.interface?.settings" class="z-30")
  div(mark="settings-dim"
    class="absolute w-[1920px] h-[1080px] opacity-[0.4] bg-gray-900")
  img(mark="settings-bg" :src="ASSETS.webps['settings-bg']" class="absolute")
  tn: div(mark="settings-gamepad-icons"
    v-if="GLOBAL.lastActiveDevice === 'gamepad'")
    hotkey-icon(static="LB" class="left-[390px] top-[145px]")
    hotkey-icon(static="RB" class="left-[1450px] top-[145px]")
  div(mark="settings-tabs" class="flex justify-center items-center"
    class="absolute w-[1165px] h-[85px] left-[360px] top-[145px]")
    settings-tab(mark="settings-tab"
      v-for="i in [0, 1, 2, 3]" key="i" :index="i")
  div(mark="settings-panel"
    class="absolute w-[1150px] h-[620px] top-[210px] left-[372px]")
    tn(type="swipe"): hotkeys(mark="hotkeys-keyboard" device="keyboard"
      v-if="SETTINGS.echo.showPanel")
    tn(type="swipe"): hotkeys(mark="hetkeys-gamepad" device="gamepad"
      v-if="SETTINGS.echo.showPanel")
</template>
