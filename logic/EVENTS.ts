class Signal {
  active: string[] = []
  logic: { [signal: string]: () => void } = {
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
      if (!SYSTEM_DATA.world.hero.target.id) return

      SYSTEM_DATA.world.hero.target.attacked = true
      SYSTEM_DATA.world.hero.target.locked = true

      WORLD.systems.move.startMoveToAttackMS = WORLD.loop.elapsedMS
    },
    mouseMoveOrAttack() {
      WORLD.systems.move.mouseMove()

      if (SYSTEM_DATA.world.hoverId) {
        SYSTEM_DATA.world.hero.target.id = SYSTEM_DATA.world.hoverId
        SYSTEM_DATA.world.hero.target.attacked = true
        SYSTEM_DATA.world.hero.target.locked = true
      } else {
        SYSTEM_DATA.world.hero.target.attacked = false
      }
    },
    mouseMove() {
      WORLD.systems.move.mouseMove()
    },
    autoMouseMove() {
      SYSTEM_DATA.states.autoMouseMove = !SYSTEM_DATA.states.autoMouseMove
    },
    gamepadMove() {
      WORLD.systems.move.gamepadMove()
    },
    inventory() {
      SYSTEM_DATA.states.inventory = !SYSTEM_DATA.states.inventory
    },
    lockTarget() {
      const hero = SYSTEM_DATA.world.hero
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
        if (!SYSTEM_DATA.world.hoverId) return
        hero.target.id = SYSTEM_DATA.world.hoverId
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
