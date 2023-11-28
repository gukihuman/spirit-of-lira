<template lang="pug">
div(
  class="relative w-[250px] h-[85px] overflow-hidden transition-all duration-[200ms] ease-in-out z-50"
  :class="tabStyle"
  @click="SETTINGS.echo.tabIndex = index"
)
  div(class="mt-[-15px] w-full h-full")
    img(:src="ASSETS.webps['settings-tab-bg']"
      draggable="false" class="absolute")
    img(:src="ASSETS.webps['settings-tab-list']"
      draggable="false" class="absolute transition-all duration-[200ms] ease-in-out mt-0" :class="listStyle")
    img(:src="ASSETS.webps['settings-tab-shadow']"
      draggable="false" class="absolute")
    div(class="flex items-center justify-center w-full h-full pt-[22px]")
      p(class="z-10 text-royal-brown text-[25px] font-bold transition-all duration-[200ms] ease-in-out" :class="listTextStyle") {{ _.capitalize(SETTINGS.tabList[index]) }}
</template>
<script setup lang="ts">
const props = defineProps(["index"])
const tabStyle = computed(() => {
  return {
    "opacity-[0.5]": props.index !== SETTINGS.echo.tabIndex,
    "hover:brightness-[1.15]": props.index !== SETTINGS.echo.tabIndex,
    "hover:opacity-[0.6]": props.index !== SETTINGS.echo.tabIndex,
  }
})
const listStyle = computed(() => {
  return {
    "mt-[-12px]": props.index !== SETTINGS.echo.tabIndex,
  }
})
const listTextStyle = computed(() => {
  return {
    "mt-[-24px]": props.index !== SETTINGS.echo.tabIndex,
  }
})
</script>
