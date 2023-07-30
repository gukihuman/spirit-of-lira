class EffectFactory {
  //
  async create(name: string, targetEntityId: number, angle: number = 0) {
    //
    const id = await ENTITY_FACTORY.create(name, {
      sprite: {
        initial: {
          randomFlip: false,
          randomFrame: false,
          loop: false,
        },
      },
    })
    if (!id) return

    const sprite = SPRITE.getAnimation(id) as AnimatedSprite
    if (!sprite) return

    sprite.rotation = angle
    sprite.visible = true

    const container = SPRITE.getContainer(id)
    if (!container) return

    const targetEntity = WORLD.entities.get(targetEntityId)
    container.x = 0
    container.y = -(targetEntity.size.height / 2)

    // change default container to the effect container of the entity
    WORLD.sortable.removeChild(container)
    const parent = SPRITE.getLayer(targetEntityId, "frontEffect")
    if (!parent) return
    parent.addChild(container)
  }
}

export const EFFECT_FACTORY = new EffectFactory()
