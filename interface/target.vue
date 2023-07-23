<template lang="pug">

div(class="absolute relative top-[-20px] left-[757px]")

  img(src="@/assets/inventory/target.webp" class="absolute" draggable="false")
  img(
    src="@/assets/inventory/target-health.webp"
    class="absolute left-0 w-[400px] h-[150px] object-left object-cover"
    draggable="false"
    :style="health"
  )
  transition(name="fast")
    img(src="@/assets/inventory/target-lock.webp" class="absolute" draggable="false" v-show="INTERFACE.targetLocked")

  div(class="absolute top-[56px] left-[80px] w-[205px] h-[40px] pl-[30px] flex justify-center")
    p(class="text-sand-100 text-2xl font-semibold mb-4") Bunbo


</template>
<script setup lang="ts">
//

const health = computed(() => {
  return {
    width: INTERFACE.targetHealth * 4 + "px",
  }
})

onMounted(() => {})
</script>
