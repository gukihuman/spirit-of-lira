export default {
  name: "hero",
  sprite: new URL("/assets/entities/hero.json", import.meta.url).href,
  x: 51000,
  y: 54000,
  speed: 10,

  process: function (delta: number) {
    //
    // mouse movement
    // 📜 add user settings
    if (gic.keyboard.pressed.includes("o")) {
      const angle = glib.angleFromPoints(glib.centerPoint, glib.mousePoint)
      const velocity = glib.vectorFromAngle(angle, (this.speed / 6) * delta)
      this.x += velocity.x
      this.y += velocity.y
    }
  },
} as gUniqueEntity
