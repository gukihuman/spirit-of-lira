<template lang="pug">
CanvasWrapper
  CanvasDisplay(
    v-for='(entity, index) in Game().entities'
    :key='index'
    :updateEach='Game().frame'

    :name='entity.name'
    :state='entity.state'
    :stateFrame='entity.stateFrame'
    :x='entity.x',
    :y='entity.y',
    :mirrored='entity.mirrored',
  )
</template>
