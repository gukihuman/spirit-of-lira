import * as PIXI from "pixi.js"

function setContainers(): void {
  Pixi().app.stage.addChild(Pixi().cons.map)
  Pixi().app.stage.addChild(Pixi().cons.sortable)
  Pixi().cons.sortable.addChild(Pixi().cons.hero)
}
async function loadHeroSprites(): Promise<void> {
  let heroUrl = await PIXI.Assets.load(Info().hero.json)
  l.forOwn(heroUrl.animations, (value, key) => {
    Pixi().sprites.hero[key] = new PIXI.AnimatedSprite(value)
    Pixi().sprites.hero[key].anchor.x = 0.5
    Pixi().sprites.hero[key].anchor.y = 0.7
    Pixi().sprites.hero[key].animationSpeed = 1 / 8
    Pixi().sprites.hero[key].play()
    Pixi().sprites.hero[key].visible = false
    Pixi().cons.hero.x = Settings().displayWidth / 2
    Pixi().cons.hero.y = Settings().displayHeight / 2
    Pixi().cons.hero.addChild(Pixi().sprites.hero[key])
  })
}
function setMapOffset(name: string): void {
  if (Pixi().sprites.maps[name]) {
    Pixi().sprites.maps[name].x =
      Info().maps[name].x + Settings().displayWidth / 2 - User().data.hero.x
    Pixi().sprites.maps[name].y =
      Info().maps[name].y + Settings().displayHeight / 2 - User().data.hero.y
  }
}
async function loadMapSprite(name: string): Promise<void> {
  let mapUrl = await PIXI.Assets.load(Info().maps[name].url)
  Pixi().sprites.maps[name] = new PIXI.Sprite(mapUrl)
  Game().activeMaps.push(name)
  Pixi().sprites.maps[name].cullable = false
  Pixi().cons.map.addChild(Pixi().sprites.maps[name])
}
function updateMaps(): void {
  l.forOwn(Info().maps, (value, name) => {
    if (intersect(User().data.hero, value, { extend: 2000 })) {
      if (!Game().activeMaps.includes(name)) {
        loadMapSprite(name)
        Game().activeMaps.push(name)
      }
    }
  })
  // console.log(Game().activeMaps)
}
export async function setTicker(): Promise<void> {
  setContainers()
  await loadHeroSprites()
  updateMaps()

  Pixi().app.ticker.add(() => {
    padUpdate()
    User().data.hero.move()
    if (eachSec(1, { random: true })) updateMaps()
    l.keys(Pixi().sprites.maps).forEach((name: string) => setMapOffset(name))
    Pixi().sprites.hero["idle"].visible = true

    Pixi().ticks++
  })

  States().allLoaded = true
}
