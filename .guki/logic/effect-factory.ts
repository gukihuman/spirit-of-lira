class EffectFactory {
  //
  // key is id of the effect, value is the delete time
  private effects: Map<number, any> = new Map()

  async createEffect(name: string, targetEntityId: number, angle: number = 0) {
    //
    const targetEntity = WORLD.entities.get(targetEntityId)
    const id = await ENTITY_FACTORY.createEntity(name, {
      //
      // position here is relative to use with entity container
      position: {
        x: 0,
        y: -(targetEntity.size.height / 2),
      },
      visual: {
        initialRandomFlip: false,
      },
    })
    if (!id) return

    const animationsContainer = GPIXI.getAnimation(id)
    if (!animationsContainer) return
    const sprite = animationsContainer.children[0] as AnimatedSprite

    sprite.rotation = angle
    sprite.loop = false
    sprite.gotoAndPlay(0)
    sprite.visible = true

    const container = GPIXI.getMain(id)
    if (!container) return

    GPIXI.sortable.removeChild(container) // mock default creation
    const targetFrontContiainer = GPIXI.getFront(targetEntityId)
    if (!targetFrontContiainer) return
    targetFrontContiainer.addChild(container)

    const entityContainer = GPIXI.getMain(targetEntityId)
    this.effects.set(id, {
      container,
      entityContainer,
    })
  }

  init() {
    GPIXI.tickerAdd(() => {
      this.effects.forEach((value, id) => {
        if (!WORLD.entities.get(id)) {
          this.effects.delete(id)
          return
        }
        const container = value.container
        const entityContainer = value.entityContainer

        const effect = WORLD.entities.get(id)
        container.x = effect.position.x
        container.y = effect.position.y

        // anti-flip
        if (entityContainer.scale.x === -1) {
          container.scale.x = -1
        } else {
          container.scale.x = 1
        }
      })
    }, "EFFECT_FACTORY")
  }
}

export const EFFECT_FACTORY = new EffectFactory()
