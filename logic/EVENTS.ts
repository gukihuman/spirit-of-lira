class Signal {
  active: string[] = []
  logic: { [signal: string]: () => void } = {
    collision() {
      GLOBAL.collision = !GLOBAL.collision
    },
    collisionEdit() {
      GLOBAL.collisionEdit = !GLOBAL.collisionEdit
    },
    fullscreen() {
      GLOBAL.fullscreen = !GLOBAL.fullscreen
      if (REFS.fullscreen && !document.fullscreenElement) {
        REFS.fullscreen.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    },
    attack() {
      if (!WORLD.hero.target.id) return

      WORLD.hero.target.attacked = true
      WORLD.hero.target.locked = true

      WORLD.systems.move.startMoveToAttackMS = WORLD.loop.elapsedMS
    },
    mouseMoveOrAttack() {
      WORLD.systems.move.mouseMove()

      if (WORLD.hoverId) {
        WORLD.hero.target.id = WORLD.hoverId
        WORLD.hero.target.attacked = true
        WORLD.hero.target.locked = true
      } else {
        WORLD.hero.target.attacked = false
      }
    },
    mouseMove() {
      WORLD.systems.move.mouseMove()
    },
    autoMouseMove() {
      GLOBAL.autoMouseMove = !GLOBAL.autoMouseMove
    },
    gamepadMove() {
      WORLD.systems.move.gamepadMove()
    },
    inventory() {
      INTERFACE.inventory = !INTERFACE.inventory
    },
    lockTarget() {
      const hero = WORLD.hero
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
        if (!WORLD.hoverId) return
        hero.target.id = WORLD.hoverId
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
