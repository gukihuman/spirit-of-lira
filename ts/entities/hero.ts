export default {
  name: "hero",
  sprite: new URL("/assets/entities/hero.json", import.meta.url).href,
  x: 51000,
  y: 54000,
  speed: 12,
  size: 70,

  process: function () {
    this.state = "idle"

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

        const nextTileIndex = glib.tileIndexFromCoordinates(nextX, nextY)
        if (
          gce.collisionArray[nextTileIndex] === 2 ||
          gce.collisionArray[nextTileIndex] === 3
        ) {
          //
          const nextTileIndexByX = glib.tileIndexFromCoordinates(nextX, this.y)
          if (
            gce.collisionArray[nextTileIndexByX] !== 2 &&
            gce.collisionArray[nextTileIndexByX] !== 3
          ) {
            this.x = nextX
            return
          }

          const nextTileIndexByY = glib.tileIndexFromCoordinates(this.x, nextY)
          if (
            gce.collisionArray[nextTileIndexByY] !== 2 &&
            gce.collisionArray[nextTileIndexByY] !== 3
          ) {
            this.y = nextY
            return
          }

          this.state = "idle"
          return
        }

        this.x = nextX
        this.y = nextY
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
        this.x += velocity.x * ratio
        this.y += velocity.y * ratio
      }
    }
  },
} as gUniqueEntity
