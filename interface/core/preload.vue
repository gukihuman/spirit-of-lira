<template lang="pug">
div(class="absolute opacity-0")
    img(
        v-for="(webp_path, i) in ASSETS.webp_paths"
        key="i"
        :src="webp_path"
        draggable="false"
        class="absolute opacity-0"
    )
</template>
