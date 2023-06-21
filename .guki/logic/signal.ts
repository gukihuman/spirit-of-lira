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
      if (!GLOBAL.hero.target.id) return

      GLOBAL.hero.target.attacked = true
      GLOBAL.hero.target.locked = true

      const move = WORLD.systems.get("move")
      if (move) move.startAttackMS = GPIXI.elapsedMS
    },
    mouseMoveOrAttack() {
      WORLD.systems.get("move")?.mouseMove()

      if (GLOBAL.hoverId) {
        GLOBAL.hero.target.id = GLOBAL.hoverId
        GLOBAL.hero.target.attacked = true
        GLOBAL.hero.target.locked = true
      } else {
        GLOBAL.hero.target.attacked = false
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
      const hero = GLOBAL.hero
      if (!hero.target.id) return

      hero.target.locked = !hero.target.locked

      // reset destination if it is on the target
      if (
        !hero.target.locked &&
        hero.target.entity.position.x === hero.move.destination.x &&
        hero.target.entity.position.y === hero.move.destination.y
      ) {
        hero.move.destination = undefined
        hero.state.main = "idle"
      }
      if (!hero.target.locked) {
        hero.target.id = undefined
        hero.target.attacked = false
      }

      // in case lock is used to lock a new target immidiately
      if (WORLD.systems.get("target") && INPUT.lastActiveDevice !== "gamepad") {
        if (!GLOBAL.hoverId) return
        hero.target.id = GLOBAL.hoverId
        hero.target.locked = true
      }
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
