class Hero {
  x: number
  y: number
  size: number
  speed: number

  constructor() {
    this.x = 660
    this.y = 110
    this.size = 50
    this.speed = 14
  }

  move() {
    function mouseMove(hero: any) {
      if (
        Keyboard().buttons.includes(
          User().data.settings.control.keyboard.heroMove
        ) ||
        Mouse().buttons.includes(User().data.settings.control.mouse.heroMove) ||
        States().autoHeroMove
      ) {
        let distanceRatio = Mouse().distanceToHero / 350
        distanceRatio = l.clamp(distanceRatio, 1)
        if (Mouse().distanceToHero > 50) {
          hero.x +=
            ((hero.speed * 10) / Pixi().app.ticker.FPS) *
            distanceRatio *
            Math.cos(Mouse().angleToHero) *
            -1
          hero.y +=
            ((hero.speed * 10) / Pixi().app.ticker.FPS) *
            distanceRatio *
            Math.sin(Mouse().angleToHero) *
            -1
        }
      }
    }
    let gamepadActive = false
    // LS X-axis
    if (
      Math.abs(Pad().axes[0]) >= User().data.settings.control.gamepad.deadZone
    ) {
      this.x += ((this.speed * 10) / Pixi().app.ticker.FPS) * Pad().axes[0]
      gamepadActive = true
      States().autoHeroMove = false
    }
    // LS Y-axis
    if (
      Math.abs(Pad().axes[1]) >= User().data.settings.control.gamepad.deadZone
    ) {
      this.y += ((this.speed * 10) / Pixi().app.ticker.FPS) * Pad().axes[1]
      gamepadActive = true
      States().autoHeroMove = false
    }
    if (!gamepadActive) mouseMove(this)
  }
}
export function genHero(): Hero {
  return new Hero()
}
