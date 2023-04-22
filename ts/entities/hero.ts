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
        this.x += velocity.x * ratio
        this.y += velocity.y * ratio
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
