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
    mouseMoveOrAttack() {
      gworld.systems.get("move")?.mouseMove()

      if (gg.hero.alive.targetEntityId === gg.hoverId) {
        gg.hero.alive.targetAttacked = true
        gg.hero.alive.targetLocked = true
      } else {
        gg.hero.alive.targetAttacked = false
      }
    },
    mouseMove() {
      gworld.systems.get("move")?.mouseMove()
    },
    autoMouseMove() {
      gsd.states.autoMouseMove = !gsd.states.autoMouseMove
      if (gg.context === "autoMove") gg.context = "default"
      else gg.context = "autoMove"
    },
    gamepadMove() {
      gworld.systems.get("move")?.gamepadMove()
    },
    inventory() {
      gsd.states.inventory = !gsd.states.inventory
    },
    lockTarget() {
      if (!gg.hero.alive.targetEntityId) return

      gg.hero.alive.targetLocked = !gg.hero.alive.targetLocked

      // in case lock is used to lock a new target immidiately
      if (gworld.systems.get("target") && gic.lastActiveDevice !== "gamepad") {
        if (!gg.hoverId) return
        gg.hero.alive.targetEntityId = gg.hoverId
        gg.hero.alive.targetLocked = true
      }

      // if (!gg.hoverId && gg.hero.alive.targetLocked) {
      // }
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
