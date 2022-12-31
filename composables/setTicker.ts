import * as PIXI from "pixi.js"

function setContainers(): void {
  Pixi().app.stage.addChild(Pixi().containers.map)
  Pixi().app.stage.addChild(Pixi().containers.sortable)
  Pixi().containers.sortable.addChild(Pixi().containers.hero)
}
async function loadHeroSprites(): Promise<void> {
  let heroUrl = await PIXI.Assets.load(Info().hero.json)
  l.forOwn(heroUrl.animations, (value, key) => {
    Pixi().sprites.hero[key] = new PIXI.AnimatedSprite(value)
    Pixi().sprites.hero[key].anchor.x = 0.5
    Pixi().sprites.hero[key].anchor.y = 0.6
    Pixi().sprites.hero[key].animationSpeed = 1 / 8
    Pixi().sprites.hero[key].play()
    Pixi().sprites.hero[key].visible = false
    Pixi().containers.hero.addChild(Pixi().sprites.hero[key])
  })
}
function loadMapSprite(name: string): void {
  let mapUrl = new URL(`/assets/maps/${name}.webp`, import.meta.url).href
  let texture = PIXI.Texture.from(mapUrl)
  Pixi().sprites.maps[name] = new PIXI.Sprite(texture)
  Pixi().containers.map.addChild(Pixi().sprites.maps[name])
}
export async function setTicker(): Promise<void> {
  setContainers()
  loadMapSprite("greenForest")
  await loadHeroSprites()

  Pixi().app.ticker.add(() => {
    Pixi().sprites.hero["idle"].visible = true
    Pixi().sprites.maps["greenForest"].x = 0
    Pixi().sprites.maps["greenForest"].y = 0
    Pixi().containers.hero.x = User().data.hero.x
    Pixi().containers.hero.y = User().data.hero.y
    padUpdate()

    Pixi().ticks++
  })

  States().allLoaded = true
}
