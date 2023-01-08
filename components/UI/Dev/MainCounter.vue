<template lang="pug">

div
  DevTitle: div counter
  DevLine
    div frames
    div {{ Game().frame }}
  DevLine
    div creatures
    div {{ creatures }}
  DevLine
    div items
    div {{ items }}
  DevLine
    div projectiles
    div {{ projectiles }}
  DevLine
    div visualEffects
    div {{ visualEffects }}
  DevLine
    div creaturesCache
    div {{ creaturesCache }}
  DevLine
    div itemsCache
    div {{ itemsCache }}

</template>
<script setup lang="ts">
const creatures = computed(() => countType("creature"))
const items = computed(() => countType("item"))
const projectiles = computed(() => countType("projectile"))
const visualEffects = computed(() => countType("visualEffect"))
const creaturesCache = computed(() => countType("creature", "cache"))
const itemsCache = computed(() => countType("item", "cache"))

function countType(
  type: "creature" | "item" | "projectile" | "visualEffect",
  where: "main" | "cache" = "main"
): number {
  let counter: number = 0
  if (where === "main") {
    Game().entities.forEach((entity: any) => {
      if (type === "creature" && entity?.isCreature) counter++
      if (type === "item" && entity?.isItem) counter++
      if (type === "projectile" && entity?.isProjectile) counter++
      if (type === "visualEffect" && entity?.isVisualEffect) counter++
    })
  } else if (where === "cache") {
    Game().entitiesCache.forEach((entity: any) => {
      if (type === "creature" && entity?.isCreature) counter++
      if (type === "item" && entity?.isItem) counter++
      if (type === "projectile" && entity?.isProjectile) counter++
      if (type === "visualEffect" && entity?.isVisualEffect) counter++
    })
  }
  return counter
}
</script>
