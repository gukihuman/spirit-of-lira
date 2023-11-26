<template lang="pug">
transition(
  name=name
  :enter-active-class="enterActiveClass"
  :leave-active-class="leaveActiveClass"
  :enter-from-class="enterFromClass"
  :leave-to-class="leaveToClass"
  mode=mode
)
  slot
</template>
<script setup lang="ts">
const props = defineProps({
  name: { type: String, default: "v" },
  mode: { type: String, default: "out-in" },
})

// Setting default `enterActiveClass` value
const enterActiveClass = computed(() => {
  return props.name + "-enter-active"
})
const leaveActiveClass = computed(() => {
  return props.name + "-leave-active"
})
const enterFromClass = computed(() => {
  return props.name + "-enter-from"
})
const leaveToClass = computed(() => {
  return props.name + "-leave-to"
})
</script>
