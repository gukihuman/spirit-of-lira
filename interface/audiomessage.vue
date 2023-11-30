<template lang="pug">
div(v-if="!GLOBAL.firstUserGesture && SCENE_ACTIVE.name !== 'a0-adult-check'"
  class="absolute left-[1150px] top-[80px] w-[680px] h-[60px] pt-2 z-[100]"
  class="bg-slate-800/50 flex justify-center items-center rounded-xl")
  p(class="text-slate-300 text-2xl font-semibold mb-4"
  ) browser audio needs any key press or click to start
</template>
