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
        stableFlip: true,
      },
    })
    if (!id) return
    const effect = WORLD.entities.get(id)

    const animationsContainer = PIXI_GUKI.getAnimationContainer(id)
    if (!animationsContainer) return
    const sprite = animationsContainer.children[0] as AnimatedSprite

    sprite.rotation = angle
    sprite.loop = false
    sprite.gotoAndPlay(0)
    sprite.visible = true

    const container = PIXI_GUKI.getContainer(id)
    if (!container) return

    PIXI_GUKI.sortable.removeChild(container)
    const targetFrontContiainer = PIXI_GUKI.getFrontContainer(targetEntityId)
    if (!targetFrontContiainer) return
    targetFrontContiainer.addChild(container)

    const parentContainer = PIXI_GUKI.getContainer(targetEntityId)
    this.effects.set(id, {
      deleteMS: PIXI_GUKI.elapsedMS + effect.duration.time,
      container,
      parentContainer,
    })
  }

  init() {
    PIXI_GUKI.tickerAdd(() => {
      this.effects.forEach((value, id) => {
        const deleteMS = value.deleteMS
        const container = value.container
        const parentContainer = value.parentContainer

        const effect = WORLD.entities.get(id)
        container.x = effect.position.x
        container.y = effect.position.y
        if (parentContainer.scale.x === -1) {
          container.scale.x = -1
        } else {
          container.scale.x = 1
        }

        if (PIXI_GUKI.elapsedMS > deleteMS) {
          this.effects.delete(id)
          WORLD.entities.delete(id)

          container.parent.removeChild(container)
        }
      })
    }, "EFFECT_FACTORY")
  }
}

export const EFFECT_FACTORY = new EffectFactory()
