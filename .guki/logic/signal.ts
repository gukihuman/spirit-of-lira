class Signal {
  private active: string[] = []
  logic = {
    collision() {
      REACTIVE.states.collision = !REACTIVE.states.collision
    },
    collisionEdit() {
      REACTIVE.states.collisionEdit = !REACTIVE.states.collisionEdit
    },
    fullscreen() {
      REACTIVE.states.fullscreen = !REACTIVE.states.fullscreen
      if (REACTIVE.refs.fullscreen && !document.fullscreenElement) {
        REACTIVE.refs.fullscreen.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    },
    attack() {
      if (!REACTIVE.world.hero.target.id) return

      REACTIVE.world.hero.target.attacked = true
      REACTIVE.world.hero.target.locked = true

      const move = WORLD.systems.get("move")
      if (move) move.startAttackMS = GPIXI.elapsedMS
    },
    mouseMoveOrAttack() {
      WORLD.systems.get("move")?.mouseMove()

      if (REACTIVE.world.hoverId) {
        REACTIVE.world.hero.target.id = REACTIVE.world.hoverId
        REACTIVE.world.hero.target.attacked = true
        REACTIVE.world.hero.target.locked = true
      } else {
        REACTIVE.world.hero.target.attacked = false
      }
    },
    mouseMove() {
      WORLD.systems.get("move")?.mouseMove()
    },
    autoMouseMove() {
      REACTIVE.states.autoMouseMove = !REACTIVE.states.autoMouseMove
    },
    gamepadMove() {
      WORLD.systems.get("move")?.gamepadMove()
    },
    inventory() {
      REACTIVE.states.inventory = !REACTIVE.states.inventory
    },
    lockTarget() {
      const hero = REACTIVE.world.hero
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
        if (!REACTIVE.world.hoverId) return
        hero.target.id = REACTIVE.world.hoverId
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
