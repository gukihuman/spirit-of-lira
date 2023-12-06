<template lang="pug">
div(class="absolute z-10 overflow-hidden w-full h-full"
v-show="CONTEXT.echo.world")
  div(v-show="CONTEXT.echo.world.gameplay")
    float-damage(mark="float-damage" v-if="INTERFACE.floatDamage")
    tn: talk(mark="talk" v-show="INTERFACE.talk")
    tn: reset(mark="reset" v-show="INTERFACE.reset")
    tn(type="fast"): target(mark="target" v-show="INTERFACE.target")
  bars-panel(mark="bars-panel")
  tn: div(mark="button-settings" class="absolute top-[7px] left-[7px]")
    gbutton(type="settings")
  tn: div(mark="button-fullscreen" class="absolute top-[7px] right-[7px]")
    gbutton(type="fullscreen")
  //- div(mark="buttons-panel-left" class="absolute w-[500px] h-[150px] bottom-0"
  //-   class="flex items-center justify-end gap-3")
  //-     gbutton(type="girls")
  div(mark="gamepad-icon"
    v-if="GLOBAL.lastActiveDevice === 'gamepad'"
    class="absolute w-[100px] h-[100px] bottom-[20px] left-[45px]"
    class="flex items-center justify-center")
    img(:src="ASSETS.webps.gamepad" draggable="false")
</template>
