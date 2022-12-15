<template lang="pug">
CanvasWrapper
  CanvasRanges(
    v-for='(entity, index) in Canvas().entities'
    :key='index'
    :updateEach='Frame().current'

    :breed='entity.breed'
    :animState='entity.animState'
    :animStateStartFrame='entity.animStateStartFrame'
    :x='entity.x',
    :y='entity.y',
    :mirrored='entity.mirrored',

    :range='entity.range'
  )
  CanvasEntities(
    v-for='(entity, index) in Canvas().entities'
    :key='index'
    :updateEach='Frame().current'

    :name='entity.breed'
    :anim='entity.animState'
    :animFrame='entity.animStateStartFrame'
    :x='entity.x',
    :y='entity.y',
    :mirrored='entity.mirrored',
  )
</template>
