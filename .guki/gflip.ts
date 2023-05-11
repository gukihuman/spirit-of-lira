class Flip {
  init() {
    gpixi.tickerAdd(() => {
      gworld.entities.forEach((entity, id) => {
        if (!entity.get("alive")) return

        const previousX = gcache.entities.get(id).get("position").x
        const container = gpixi.getContainer(id)

        if (entity.get("position").x < previousX) {
          if (container) container.scale.x = -1
        } else if (entity.get("position").x > previousX) {
          if (container) container.scale.x = 1
        }

        // 📜 add attack target dependence
      })
    }, "gflip")
  }
}

export const gflip = new Flip()
