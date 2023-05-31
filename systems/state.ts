export default class state {
  process() {
    gworld.entities.forEach((entity, id) => {
      if (!entity.alive || !entity.visual) return
      if (gpixi.elapsedMS - entity.alive.lastStateSwitchMS < 200) return
      if (entity.alive.leaveStateConditions) {
        if (
          entity.alive.state === "move" &&
          !entity.alive.leaveStateConditions.move(entity, id)
        )
          return
      }

      // idle, walk, run or move
      this.checkMove(entity, id)

      this.checkAttack(entity, id)

      const lastEntity = gcache.entities.get(id)
      if (!lastEntity) return
      if (entity.alive.state !== lastEntity.alive.state) {
        entity.alive.lastStateSwitchMS = gpixi.elapsedMS
      }
    })
  }

  checkAttack(entity, id) {
    if (!entity.alive.targetEntityId || !entity.attack) return
    if (!entity.alive.targetAttacked) return

    const targetEntity = gworld.entities.get(entity.alive.targetEntityId)
    const distance = glib.distance(entity.position, targetEntity.position)

    if (distance < targetEntity.alive.width / 2 + entity.attack.distance) {
      if (id === gg.heroId) {
        entity.alive.state = "sword-attack"
      }
    }
  }

  checkMove(entity, id) {
    const lastEntity = gcache.entities.get(id)
    if (!lastEntity) return
    const displacement = glib.vectorFromPoints(
      entity.position,
      lastEntity.position
    )
    const distance = displacement.distance
    const speedPerTick = glib.speedPerTick(entity)

    if (distance / speedPerTick < 0.1) {
      entity.alive.state = "idle"
      return
    }

    if (gpixi.getAnimationSprite(id, "walk")) {
      if (distance / speedPerTick < 0.8) {
        entity.alive.state = "walk"
      } else {
        entity.alive.state = "run"
      }
    } else {
      entity.alive.state = "move"
    }
  }
}
