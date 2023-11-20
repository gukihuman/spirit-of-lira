<template lang="pug">
div(class="absolute z-10 overflow-hidden w-full h-full")
  bars
  transition(name="fast")
    target(v-show="INTERFACE.target && !INTERFACE.inventory")
  transition: talk(v-show="INTERFACE.talk && !INTERFACE.inventory")
  transition: reset(v-show="INTERFACE.reset && !INTERFACE.inventory")
  transition: damage(v-show="INTERFACE.damage && !INTERFACE.inventory")

  //- bottom left panel
  transition
    div(v-if="GLOBAL.lastActiveDevice === 'gamepad'" class="absolute w-[100px] h-[100px] bottom-[20px] left-[45px] flex items-center justify-center")
      img(:src="ASSETS.webps.gamepad" draggable="false")
  transition
    div(class="absolute w-[330px] h-[100px] bottom-[30px] left-[160px] flex justify-end gap-[10px]")
      gbutton(type="inventory")
      //- girls
  
  transition
    div(class="absolute top-[20px] right-[20px]")
      gbutton(type="fullscreen")

</template>
