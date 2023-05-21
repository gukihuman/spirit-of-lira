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
      const heroEntity = gg.hero
      if (!heroEntity) return
      if (gsd.states.inventory) return

      const distance = glib.distance(glib.centerPoint(), glib.mousePoint())

      if (distance < 10) {
        heroEntity.alive.targetPosition = undefined
        return
      }

      const mousePosition = glib.mousePoint()
      mousePosition.x += gg.hero.position.x - 960
      mousePosition.y += gg.hero.position.y - 540
      heroEntity.alive.targetPosition = mousePosition
    },
    autoMouseMove() {
      gsd.states.autoMouseMove = !gsd.states.autoMouseMove
    },
    gamepadMove() {
      const heroEntity = gworld.entities.get(gg.heroId)
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
    lockTarget() {
      if (!gg.hero.alive.targetEntityId) return
      gg.hero.alive.targetLocked = !gg.hero.alive.targetLocked

      // in case lock is used to lock a new target immidiately
      if (gworld.systems.get("target") && gic.lastActiveDevice !== "gamepad") {
        gworld.systems.get("target").heroTargetByMouse()
        gg.hero.alive.targetLocked = true
      }
    },
    sendInput() {},
  }
  private runLogic() {
    this.active.forEach((signal) => {
      if (!this.logic[signal]) {
        glib.logWarning(`Unknown signal: "${signal}" (gsignal)`)
        return
      }
      this.logic[signal]()
    })
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
