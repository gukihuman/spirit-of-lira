<template lang="pug">
div( class="w-[75px] h-[75px] absolute" )
    img(
        :src="resolve_source"
        class="absolute object-none"
        draggable="false"
    )
</template>
<script setup lang="ts">
const props = defineProps(["state"])
const resolve_source = computed(() => {
    if (props.state) return ASSETS.get_webp_path("settings-trigger-on")
    else return ASSETS.get_webp_path("settings-trigger-off")
})
</script>
