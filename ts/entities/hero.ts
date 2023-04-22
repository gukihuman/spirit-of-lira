export default {
  name: "hero",
  sprite: new URL("/assets/entities/hero.json", import.meta.url).href,
  x: 51000,
  y: 54000,
  speed: 10,
  size: 70,

  process: function () {
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

        const distanceFactor = _.clamp(distance / 350, 1)
        const angle = displacement.angle
        const velocity = glib.vectorFromAngle(angle, speedPerTick)
        this.x += velocity.x * distanceFactor
        this.y += velocity.y * distanceFactor
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

        const velocity = glib.vectorFromAngle(angle, speedPerTick)
        this.x += velocity.x * ratio
        this.y += velocity.y * ratio
      }
    }
  },
} as gUniqueEntity
