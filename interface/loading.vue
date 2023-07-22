<template lang="pug">

div(class="absolute w-full h-full bg-slate-800 flex justify-center items-center")
  //- svg-loading(class="scale-50")
  div(class="flex flex-col h-[100px] justify-start items-center")
    p(class="text-slate-300 text-2xl font-semibold mb-4") loading...
    p(class="text-slate-300 font-semibold mb-2") this game supports gamepad
    img(
      src="@/assets/inventory/gamepad.webp"
      draggable="false"
      class="w-[60px]"
    )


</template>
