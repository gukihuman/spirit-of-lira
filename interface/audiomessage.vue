<template lang="pug">

div(
  v-if="ACTIVE_SCENE.name !== 'a0-adult-check'"
  class="absolute left-[1150px] top-[80px] w-[680px] h-[60px] bg-slate-800/50 flex justify-center items-center rounded-xl pt-2 z-[100]"
  )
  p(class="text-slate-300 text-2xl font-semibold mb-4") browser audio needs any key press or click to start

</template>
