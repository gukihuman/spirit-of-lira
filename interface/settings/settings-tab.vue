<template lang="pug">
div(@click="CONTEXT.set('world', 'interface', 'settings', context)"
class="relative w-[250px] h-[85px] overflow-hidden transition-all duration-[200ms] ease-in-out z-50" :class="tab_style")
  div(class="mt-[-15px] w-full h-full")
    img(mark="settings-tab-bg" draggable="false"
    :src="ASSETS.webps['settings-tab-bg']" class="absolute")
    img(mark="settings-tab-list" draggable="false"
    :src="ASSETS.webps['settings-tab-list']" :class="list_style"
    class="absolute transition-all duration-[200ms] ease-in-out mt-0")
    img(mark="settings-tab-shadow" draggable="false"
    :src="ASSETS.webps['settings-tab-shadow']" class="absolute")
    div(mark="settings-tab-text"
    class="flex items-center justify-center w-full h-full pt-[22px]")
      p(class="z-10 text-royal-brown text-[25px] font-bold transition-all duration-[200ms] ease-in-out" :class="text_style"
      ) {{ _.capitalize(context) }}
</template>
<script setup lang="ts">
const props = defineProps(["context"]) // SETTINGS.context_list
let inactive = computed(() => {
  return !CONTEXT.echo.world?.interface?.settings?.[props.context]
})
const tab_style = computed(() => {
  return {
    "opacity-[0.5]": inactive.value,
    "hover:brightness-[1.15]": inactive.value,
    "hover:opacity-[0.6]": inactive.value,
  }
})
const list_style = computed(() => {
  return { "mt-[-12px]": inactive.value }
})
const text_style = computed(() => {
  return { "mt-[-24px]": inactive.value }
})
</script>
