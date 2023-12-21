<template lang="pug">
div(
    mark="preload"
    class="opacity-0 absolute z-[999] w-full h-full overflow-hidden pointer-events-none"
)
    img(
        v-for="(webp_path, i) of exclude_map_paths"
        key="i"
        :src="webp_path"
        draggable="false"
        class="absolute"
    )
</template>
<script setup lang="ts">
const exclude_map_paths = computed(() => {
    const paths: string[] = []
    for (const webp_name in ASSETS.webp_paths) {
        let match_only_map_name: any[] | null = webp_name.match(/^\d{4}$/)
        if (match_only_map_name) continue
        paths.push(ASSETS.webp_paths[webp_name])
    }
    return paths
})
</script>
