class Signal {
  private active: string[] = []
  private logic = {
    collisionEdit() {
      gsd.states.collisionEdit = !gsd.states.collisionEdit
    },
    fullscreen() {
      gsd.states.fullscreen = !gsd.states.fullscreen
      if (gsd.refs.background && !document.fullscreenElement) {
        gsd.refs.background.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    },
    mouseMove() {
      const heroEntity = gworld.entities.get(gsd.states.heroId)
      if (!heroEntity) return

      const displacement = glib.vectorFromPoints(
        glib.centerPoint(),
        glib.mousePoint()
      )
      const distance = displacement.distance
      if (distance < heroEntity.get("alive").size) {
        heroEntity.get("alive").targetPosition = undefined
        return
      }

      const mousePosition = glib.mousePoint()
      mousePosition.x += heroEntity.get("position").x - 960
      mousePosition.y += heroEntity.get("position").y - 540
      heroEntity.get("alive").targetPosition = mousePosition
    },
    autoMouseMove() {
      gsd.states.autoMouseMove = !gsd.states.autoMouseMove
    },
    gamepadMove() {
      const heroEntity = gworld.entities.get(gsd.states.heroId)
      if (!heroEntity) return

      heroEntity.get("alive").targetPosition = undefined
      const speedPerTick = glib.speedPerTick(heroEntity)

      const axesVector = glib.vector(gic.gamepad.axes[0], gic.gamepad.axes[1])
      const angle = axesVector.angle
      let ratio = axesVector.distance
      ratio = _.clamp(ratio, 1)

      const velocity = glib.vectorFromAngle(angle, speedPerTick)
      heroEntity.get("position").x += velocity.x * ratio
      heroEntity.get("position").y += velocity.y * ratio

      // if (glib.isWalkable(nextX, nextY)) {
      //   this.x = nextX
      //   this.y = nextY
      // } else {
      //   if (glib.isWalkable(nextX, this.y)) {
      //     this.x = nextX
      //     return
      //   }
      //   if (glib.isWalkable(this.x, nextY)) {
      //     this.y = nextY
      //     return
      //   }
      //   return
      // }
    },
    inventory() {
      gsd.states.inventory = !gsd.states.inventory
    },
    sendInput() {},
  }
  private runLogic() {
    this.active.forEach((signal) => this.logic[signal]())
  }
  emit(signal: string) {
    if (this.active.includes(signal)) return
    this.active.push(signal)
  }

  public init() {
    gpixi.tickerAdd(() => {
      this.runLogic()
      this.active = []
    }, "gsignal")
  }
}

export const gsignal = new Signal()