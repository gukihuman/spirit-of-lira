<template lang="pug">
div( class='absolute left-0 w-fit h-9 text-3xl leading-8 max-w-[280px] \
  flex items-start flex-col px-2 m-2 font-mono text-gray-300 z-30')

  div(class='w-fit bg-slate-600/70 px-2 rounded-md') {{ Frame().current }}
  DevEntity
  DevKeyboard(v-if='States().bobcat')

</template>
