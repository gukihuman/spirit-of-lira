<template lang="pug">
div(class="z-30 relative")
  img(
    v-for="(value, index) in ACTIVE_SCENE.images"
    :key="index"
    :src="ASSETS.webps[value]"
    draggable="false"
    class="absolute"
  )
  dialogue
</template>
