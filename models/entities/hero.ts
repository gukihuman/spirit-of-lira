export default {
  name: "hero",
  sprite: new URL("/assets/entities/hero.json", import.meta.url).href,
  x: 51000,
  y: 54000,
  speed: 12,
  size: 70,

  process() {
    this.state = "idle"

    if (gsd.states.context !== "gameplay") return
    if (!this.size || !this.x || !this.y) return

    const speedPerTick = (this.speed / 6) * (gpm.deltaMS / 16.66)
    //
    // mouse move
    if (gim.states.activeDevice === "keyboard-mouse") {
      if (gim.states.heroMouseMove) {
        const displacement = glib.vectorFromPoints(
          glib.centerPoint,
          glib.mousePoint
        )
        const distance = displacement.distance
        if (distance < this.size) return

        const ratio = _.clamp(distance / 350, 1)
        if (ratio < 0.9) this.state = "walk"
        else this.state = "run"

        const angle = displacement.angle
        const velocity = glib.vectorFromAngle(angle, speedPerTick)

        const nextX = this.x + velocity.x * ratio
        const nextY = this.y + velocity.y * ratio

        if (glib.isWalkable(nextX, nextY)) {
          this.x = nextX
          this.y = nextY
        } else {
          if (glib.isWalkable(nextX, this.y)) {
            this.x = nextX
            return
          }
          if (glib.isWalkable(this.x, nextY)) {
            this.y = nextY
            return
          }

          this.state = "idle"
          return
        }
      }
    }

    // gamepad move
    if (gim.states.activeDevice === "gamepad") {
      if (
        gic.gamepad.axes[0] > gud.settings.input.gamepadDeadZone ||
        gic.gamepad.axes[0] < -gud.settings.input.gamepadDeadZone ||
        gic.gamepad.axes[1] > gud.settings.input.gamepadDeadZone ||
        gic.gamepad.axes[1] < -gud.settings.input.gamepadDeadZone
      ) {
        const axesVector = glib.vector(gic.gamepad.axes[0], gic.gamepad.axes[1])
        const angle = axesVector.angle
        let ratio = axesVector.distance
        ratio = _.clamp(ratio, 1)
        if (ratio < 0.9) this.state = "walk"
        else this.state = "run"

        const velocity = glib.vectorFromAngle(angle, speedPerTick)

        const nextX = this.x + velocity.x * ratio
        const nextY = this.y + velocity.y * ratio

        if (glib.isWalkable(nextX, nextY)) {
          this.x = nextX
          this.y = nextY
        } else {
          if (glib.isWalkable(nextX, this.y)) {
            this.x = nextX
            return
          }
          if (glib.isWalkable(this.x, nextY)) {
            this.y = nextY
            return
          }

          this.state = "idle"
          return
        }
      }
    }
  },

  firstAnimationFrames: {
    idle: 11,
    walk: 4,
    run: 4,
  },
} as gEntity
