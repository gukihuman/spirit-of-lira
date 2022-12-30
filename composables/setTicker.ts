import * as PIXI from "pixi.js"

export async function setTicker(): Promise<void> {
  Pixi().assets.hero = await PIXI.Assets.load(User().data.hero.json)
  Pixi().sprites.hero = {}
  l.forOwn(Pixi().assets.hero.animations, (value, key) => {
    Pixi().sprites.hero[key] = new PIXI.AnimatedSprite(value)
  })

  Pixi().sprites.hero["idle"].anchor.x = 0.5
  Pixi().sprites.hero["idle"].anchor.y = 0.7
  Pixi().app?.stage.addChild(Pixi().sprites.hero["idle"])
  Pixi().sprites.hero["idle"].animationSpeed = 1 / 8
  Pixi().sprites.hero["idle"].play()

  let tick = 0
  Pixi().app?.ticker.add((delta) => {
    Pixi().sprites.hero["idle"].x = User().data.hero.x
    Pixi().sprites.hero["idle"].y = User().data.hero.y
    tick++
  })

  // 📜 maybe add end hook for loading here
}
