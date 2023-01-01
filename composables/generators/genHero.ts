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
    // 📜 make it work while button is pressed
    let distanceRatio = Mouse().distanceToHero / 350
    distanceRatio > 1 ? (distanceRatio = 1) : {}
    if (Mouse().distanceToHero > 50) {
      this.x +=
        ((this.speed * 10) / Pixi().app.ticker.FPS) *
        distanceRatio *
        Math.cos(Mouse().angleToHero) *
        -1
      this.y +=
        ((this.speed * 10) / Pixi().app.ticker.FPS) *
        distanceRatio *
        Math.sin(Mouse().angleToHero) *
        -1
    }
  }
}
export function genHero(): Hero {
  return new Hero()
}
