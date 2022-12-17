<template lang="pug">
CanvasWrapper
  CanvasEntities(
    v-for='(entity, index) in Game().entities'
    :key='index'
    :updateEach='Frame().current'

    :name='entity.name'
    :status='entity.status'
    :statusFrame='entity.statusFrame'
    :x='entity.x',
    :y='entity.y',
    :mirrored='entity.mirrored',
  )
</template>
