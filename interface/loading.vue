<template lang="pug">
div(class="absolute w-full h-full bg-slate-800 flex justify-center items-center")
  div(class="flex flex-col h-[200px] justify-start items-center")
    div(class="text-red-400 text-lg font-semibold mb-4 -ml-6")
      span(class="text-2xl mr-2") 🔞
      span 18+ only
    p(id="loading-text"
    class="text-slate-300 text-2xl font-semibold mb-4 w-[105px]") loading
    div(class="flex gap-2 mb-4 ml-1")
      p(class="text-slate-400 text-[15px] font-semibold mb-2")
        | gamepad supported
      div(class="-mt-[15px] -ml-[5px]")
        img(:src="ASSETS.webp_paths['gamepad']" draggable="false"
        class="opacity-[.85] w-[60px] saturate-[.2]")

  //- covers loading above to create blank screen
  tn: div(v-show="!CONTEXT.echo.loading" class="absolute w-full h-full bg-slate-800")
</template>
