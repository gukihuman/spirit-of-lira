<template lang="pug">
div(class="absolute z-10 overflow-hidden w-full h-full")
  bars
  transition(name="fast")
    target(v-show="INTERFACE.target && GLOBAL.context === 'world'")
  transition: talk(v-show="INTERFACE.talk && GLOBAL.context === 'world'")
  transition: reset(v-show="INTERFACE.reset && GLOBAL.context === 'world'")
  transition: damage(v-show="INTERFACE.floatDamage && GLOBAL.context === 'world'")

  //- bottom left panel
  transition
    div(v-if="GLOBAL.lastActiveDevice === 'gamepad'" class="absolute w-[100px] h-[100px] bottom-[20px] left-[45px] flex items-center justify-center")
      img(:src="ASSETS.webps.gamepad" draggable="false")
  //- transition
  //-   div(class="absolute w-[330px] h-[100px] bottom-[30px] left-[160px] flex justify-end gap-[10px]")
  //-     gbutton(type="inventory")

      //- girls button
  
  transition
    div(class="absolute top-[7px] right-[7px]")
      gbutton(type="fullscreen")
  transition
    div(class="absolute top-[7px] left-[7px]")
      gbutton(type="settings")

</template>
