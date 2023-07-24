//
class Events {
  //
  active: [string, AnyObject][] = []
  activeSingle: string[] = []

  add(event: string, fn: (options: AnyObject) => void) {
    //
    this.list[event] = fn
  }
  addSingle(event: string, fn: () => void) {
    //
    this.listOfSingle[event] = fn
  }
  emit(event: string, options: AnyObject) {
    //
    this.active.push([event, options])
  }
  emitSingle(event: string) {
    //
    if (this.activeSingle.includes(event)) return

    this.activeSingle.push(event)
  }
  init() {
    //
    WORLD.loop.add(() => {
      //
      this.executeEvents()
      this.active = []
      this.activeSingle = []
      //
    }, "EVENTS")
  }
  private executeEvents() {
    this.active.forEach((eventTuple) => {
      //
      const event = eventTuple[0]
      const options = eventTuple[1]

      if (!this.list[event]) {
        LIB.logWarning(`Unknown event: "${event}" (EVENTS)`)
        return
      }
      this.list[event](options)
    })
    this.activeSingle.forEach((event) => {
      if (!this.listOfSingle[event]) {
        LIB.logWarning(`Unknown event: "${event}" (EVENTS)`)
        return
      }
      this.listOfSingle[event]()
    })
  }
  list: { [event: string]: (AnyObject) => void } = {}
  listOfSingle: { [event: string]: () => void } = {
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
        hero.state.activeSingle = "idle"
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
}

export const EVENTS = new Events()
