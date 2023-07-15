class EffectFactory {
  //
  async create(name: string, targetEntityId: number, angle: number = 0) {
    //
    const id = await ENTITY_FACTORY.create(name, {
      sprite: {
        fade: false, // disable soft dissapearence
        initial: {
          randomFlip: false,
          randomFrame: false,
          loop: false,
        },
      },
    })
    if (!id) return

    const sprite = GPIXI.getSprite(id) as AnimatedSprite
    if (!sprite) return

    sprite.rotation = angle
    sprite.visible = true

    const container = GPIXI.getMain(id)
    if (!container) return

    const targetEntity = ENTITIES.get(targetEntityId)
    container.x = 0
    container.y = -(targetEntity.size.height / 2)

    // change default container to the effect container of the entity
    GPIXI.sortable.removeChild(container)
    const parent = GPIXI.getEffect(targetEntityId)
    if (!parent) return
    parent.addChild(container)
  }
}

export const EFFECT_FACTORY = new EffectFactory()
