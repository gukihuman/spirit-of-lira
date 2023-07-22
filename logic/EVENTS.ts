class Signal {
  active: string[] = []
  logic: { [signal: string]: () => void } = {
    collision() {
      STATES.collision = !STATES.collision
    },
    collisionEdit() {
      STATES.collisionEdit = !STATES.collisionEdit
    },
    fullscreen() {
      STATES.fullscreen = !STATES.fullscreen
      if (REFS.fullscreen && !document.fullscreenElement) {
        REFS.fullscreen.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    },
    attack() {
      if (!STATES.hero.target.id) return

      STATES.hero.target.attacked = true
      STATES.hero.target.locked = true

      WORLD.systems.move.startMoveToAttackMS = WORLD.loop.elapsedMS
    },
    mouseMoveOrAttack() {
      WORLD.systems.move.mouseMove()

      if (STATES.hoverId) {
        STATES.hero.target.id = STATES.hoverId
        STATES.hero.target.attacked = true
        STATES.hero.target.locked = true
      } else {
        STATES.hero.target.attacked = false
      }
    },
    mouseMove() {
      WORLD.systems.move.mouseMove()
    },
    autoMouseMove() {
      STATES.autoMouseMove = !STATES.autoMouseMove
    },
    gamepadMove() {
      WORLD.systems.move.gamepadMove()
    },
    inventory() {
      STATES.inventory = !STATES.inventory
    },
    lockTarget() {
      const hero = STATES.hero
      if (!hero.target.id) return

      hero.target.locked = !hero.target.locked

      // reset finaldestination if it is on the target
      // it might be undefined with gamepad so first check if it exists
      if (
        hero.move.finaldestination &&
        !hero.target.locked &&
        hero.target.entity.position.x === hero.move.finaldestination.x &&
        hero.target.entity.position.y === hero.move.finaldestination.y
      ) {
        hero.move.finaldestination = undefined
        hero.state.main = "idle"
      }
      if (!hero.target.locked) {
        hero.target.id = undefined
        hero.target.attacked = false
      }

      // in case lock is used to lock a new target immidiately
      // 📜 does checking target system existance is needed here?
      if (WORLD.systems.target && INPUT.lastActiveDevice !== "gamepad") {
        if (!STATES.hoverId) return
        hero.target.id = STATES.hoverId
        hero.target.locked = true
      }
    },
    sendInput() {
      REMOTE.sendInput()
    },
  }
  private runLogic() {
    this.active.forEach((signal) => {
      if (!this.logic[signal]) {
        LIB.logWarning(`Unknown signal: "${signal}" (EVENTS)`)
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
    WORLD.loop.add(() => {
      this.runLogic()
      this.active = []
    }, "EVENTS")
  }
}

export const EVENTS = new Signal()
