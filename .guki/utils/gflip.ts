class Flip {
  init() {
    gpixi.tickerAdd(() => {
      gworld.entities.forEach((entity, id) => {
        if (!entity.alive) return
        if (gpixi.elapsedMS - entity.alive.lastFlipMS < 200) return

        if (!gcache.entities.get(id)) return
        const previousX = gcache.entities.get(id).position.x
        const container = gpixi.getContainer(id)

        if (entity.position.x < previousX) {
          if (container) container.scale.x = -1
          entity.alive.lastFlipMS = gpixi.elapsedMS
        } else if (entity.position.x > previousX) {
          if (container) container.scale.x = 1
          entity.alive.lastFlipMS = gpixi.elapsedMS
        }

        // 📜 add attack target dependence
      })
    }, "gflip")
  }
}

export const gflip = new Flip()
