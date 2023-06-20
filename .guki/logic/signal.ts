class Signal {
  private active: string[] = []
  logic = {
    collision() {
      SYSTEM_DATA.states.collision = !SYSTEM_DATA.states.collision
    },
    collisionEdit() {
      SYSTEM_DATA.states.collisionEdit = !SYSTEM_DATA.states.collisionEdit
    },
    fullscreen() {
      SYSTEM_DATA.states.fullscreen = !SYSTEM_DATA.states.fullscreen
      if (SYSTEM_DATA.refs.fullscreen && !document.fullscreenElement) {
        SYSTEM_DATA.refs.fullscreen.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    },
    attack() {
      if (!GLOBAL.hero.move.targetEntityId) return

      GLOBAL.hero.move.targetAttacked = true
      GLOBAL.hero.move.targetLocked = true

      const move = WORLD.systems.get("move")
      if (move) move.startAttackMS = GPIXI.elapsedMS
    },
    mouseMoveOrAttack() {
      WORLD.systems.get("move")?.mouseMove()

      if (GLOBAL.hoverId) {
        GLOBAL.hero.move.targetEntityId = GLOBAL.hoverId
        GLOBAL.hero.move.targetAttacked = true
        GLOBAL.hero.move.targetLocked = true
      } else {
        GLOBAL.hero.move.targetAttacked = false
      }
    },
    mouseMove() {
      WORLD.systems.get("move")?.mouseMove()
    },
    autoMouseMove() {
      SYSTEM_DATA.states.autoMouseMove = !SYSTEM_DATA.states.autoMouseMove
    },
    gamepadMove() {
      WORLD.systems.get("move")?.gamepadMove()
    },
    inventory() {
      SYSTEM_DATA.states.inventory = !SYSTEM_DATA.states.inventory
    },
    lockTarget() {
      if (!GLOBAL.hero.move.targetEntityId) return

      GLOBAL.hero.move.targetLocked = !GLOBAL.hero.move.targetLocked

      if (!GLOBAL.hero.move.targetLocked) {
        GLOBAL.hero.move.targetEntityId = undefined
        GLOBAL.hero.move.targetAttacked = false
        GLOBAL.hero.move.destination = undefined
        GLOBAL.hero.move.state = "idle"
      }

      // in case lock is used to lock a new target immidiately
      if (WORLD.systems.get("target") && INPUT.lastActiveDevice !== "gamepad") {
        if (!GLOBAL.hoverId) return
        GLOBAL.hero.move.targetEntityId = GLOBAL.hoverId
        GLOBAL.hero.move.targetLocked = true
      }

      // if (!GLOBAL.hoverId && GLOBAL.hero.move.targetLocked) {
      // }
    },
    sendInput() {},
  }
  private runLogic() {
    this.active.forEach((signal) => {
      if (!this.logic[signal]) {
        LIB.logWarning(`Unknown signal: "${signal}" (SIGNAL)`)
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
    GPIXI.tickerAdd(() => {
      this.runLogic()
      this.active = []
    }, "SIGNAL")
  }
}

export const SIGNAL = new Signal()
