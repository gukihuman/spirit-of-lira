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
  CanvasEntity(
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
</template>
