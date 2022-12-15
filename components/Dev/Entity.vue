<template lang="pug">
div(class='text-start pt-3 mx-auto text-white \
max-w-md rounded-md px-2 \
bg-gradient-to-r from-slate-500/70 to-slate-500/0')
  p connected: {{ Gamepad().connected }}
  p buttons: {{ Gamepad().buttons }}
  p axes: {{ Gamepad().axes }}
  p(class='text-start mx-auto text-white \
max-w-md' v-for='(value, key, index) in Entity().hero' key=index)
    p(v-if="key == 'X' || key == 'Y'") {{key}}: {{value.toFixed()}}
    p(v-else) {{key}}: {{value}}

</template>
