<template lang="pug">
div(class="absolute z-10 overflow-hidden w-full h-full")
  bars
  transition(name="fast"): target(v-show="INTERFACE.target && !INTERFACE.inventory")
  transition: talk(v-show="INTERFACE.talk")
</template>
