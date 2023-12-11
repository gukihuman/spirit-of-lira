<template lang="pug">
div(v-show="GAME_STATE.echo.world?.interface?.settings" class="z-30")
  div(mark="settings-dim"
  class="absolute w-[1920px] h-[1080px] opacity-[0.4] bg-gray-900")
  img(mark="settings-bg" draggable="false"
  :src="ASSETS.webps['settings-bg']" class="absolute")
  tn: div(mark="settings-gamepad-icons"
  v-if="GLOBAL.lastActiveDevice === 'gamepad'")
    hotkey-icon(static="LB" class="left-[390px] top-[145px]")
    hotkey-icon(static="RB" class="left-[1450px] top-[145px]")
  div(class="flex justify-center items-center w-[1165px] h-[85px] left-[360px] top-[145px] absolute")
    settings-tab(mark="settings-tab"
    v-for="(context, i) in SETTINGS.context_list" :context="context" :key="i")
  div(mark="settings-panel"
  class="absolute w-[1150px] h-[620px] top-[210px] left-[372px]")
    tn(type="swipe"): hotkeys-panel(mark="hotkeys-keyboard" device="keyboard")
    tn(type="swipe"): hotkeys-panel(mark="hetkeys-gamepad" device="gamepad")
</template>
