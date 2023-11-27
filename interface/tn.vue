<template lang="pug">
transition(
  name=type
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
  type: { type: String, default: "default" },
  mode: { type: String, default: "in-out" },
})

// Setting default `enterActiveClass` value
const enterActiveClass = computed(() => {
  return props.type + "-enter-active"
})
const leaveActiveClass = computed(() => {
  return props.type + "-leave-active"
})
const enterFromClass = computed(() => {
  return props.type + "-enter-from"
})
const leaveToClass = computed(() => {
  return props.type + "-leave-to"
})
</script>
