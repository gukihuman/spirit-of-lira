<template lang="pug">
div(class='text-start pt-3 mx-auto text-white \
max-w-md rounded-md px-2 \
bg-gradient-to-r from-slate-500/70 to-slate-500/0')
  p connected: {{ Gamepad().connected }}
  p buttons: {{ Gamepad().buttons }}
  p(class='mb-2') axes: {{ Gamepad().axes }}
  p(
    class='text-start mx-auto text-white w-[350px]'
    v-for="(value, key, index) in Game().entities.find(e => e.name == 'hero')"
    :key='index'
  )
    p(v-if="key == 'x' || key == 'y' || key == 'prevX' || key == 'prevY'")
      | {{key}}: {{value.toFixed()}}
    p(v-else) {{key}}: {{value}}

</template>
