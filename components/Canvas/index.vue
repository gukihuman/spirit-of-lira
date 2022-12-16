<template lang="pug">
CanvasWrapper
  CanvasEntities(
    v-for='(entity, index) in Game().entities'
    :key='index'
    :updateEach='Frame().current'

    :name='entity.name'
    :anim='entity.anim'
    :animFrame='entity.animFrame'
    :x='entity.x',
    :y='entity.y',
    :mirrored='entity.mirrored',
  )
</template>
