<template lang="pug">
div(class="absolute w-full h-full bg-fuchsia-900/30"
ref="view")

</template>
<script setup lang="ts">
import * as p from "pixi.js"
const view = ref(null)

onMounted(async () => {
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
    window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: p })

  const app = new p.Application({ backgroundAlpha: 0.2 })
  const imgUrl = new URL("@/assets/animation/hero.json", import.meta.url).href
  const sheet = await p.Assets.load(imgUrl)
  const hero = new p.AnimatedSprite(sheet.animations["walk"])
  console.log(app)
  view.value?.appendChild(app.view)
  hero.x = app.renderer.width / 2
  hero.y = app.renderer.height / 2
  // const o: keyof typeof sheet.animations

  hero.anchor.x = 0.5
  hero.anchor.y = 0.5
  app.stage.addChild(hero)
  hero.animationSpeed = 1 / 8
  hero.play()

  // app.ticker.add(() => {
  //   // hero.rotation += 0.01
  // })
})
</script>
