<template lang="pug">
div(
    mark="preload"
    class="absolute z-[999] w-full h-full overflow-hidden opacity-0"
)
    img(
        v-for="(webp_path, i) in ASSETS.webp_paths"
        key="i"
        :src="webp_path"
        draggable="false"
        class="absolute"
    )
    p preload
</template>
