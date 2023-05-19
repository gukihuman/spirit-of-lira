class Signal {
  private active: string[] = []
  private logic = {
    collision() {
      gsd.states.collision = !gsd.states.collision
    },
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
      const heroEntity = gworld.entities.get(gconst.heroId)
      if (!heroEntity) return

      const displacement = glib.vectorFromPoints(
        glib.centerPoint(),
        glib.mousePoint()
      )
      const distance = displacement.distance
      if (distance < heroEntity.alive.size) {
        heroEntity.alive.targetPosition = undefined
        return
      }

      const mousePosition = glib.mousePoint()
      mousePosition.x += gconst.hero.position.x - 960
      mousePosition.y += gconst.hero.position.y - 540
      heroEntity.alive.targetPosition = mousePosition
    },
    autoMouseMove() {
      gsd.states.autoMouseMove = !gsd.states.autoMouseMove
    },
    gamepadMove() {
      const heroEntity = gworld.entities.get(gconst.heroId)
      if (!heroEntity) return

      heroEntity.alive.targetPosition = undefined
      const speedPerTick = glib.speedPerTick(heroEntity)

      const axesVector = glib.vector(gic.gamepad.axes[0], gic.gamepad.axes[1])
      const angle = axesVector.angle
      let ratio = axesVector.distance
      ratio = _.clamp(ratio, 1)

      const velocity = glib.vectorFromAngle(angle, speedPerTick)

      gworld.systems
        .get("move")
        .checkCollisionAndMove(heroEntity, velocity, ratio)
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

  init() {
    gpixi.tickerAdd(() => {
      this.runLogic()
      this.active = []
    }, "gsignal")
  }
}

export const gsignal = new Signal()
