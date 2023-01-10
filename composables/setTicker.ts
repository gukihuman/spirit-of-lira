function setMapOffset(name: string): void {
  if (Pixi().sprites.maps[name]) {
    Pixi().sprites.maps[name].x =
      Info().maps[name].x + Settings().displayWidth / 2 - User().data.hero.x
    Pixi().sprites.maps[name].y =
      Info().maps[name].y + Settings().displayHeight / 2 - User().data.hero.y
  }
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
function drawCollision(): void {
  for (let y of l.range(-180, 120 * 9, 120)) {
    let row: Array<PIXI.Graphics> = []
    for (let x of l.range(-120, 120 * 16, 120)) {
      let rect = new PIXI.Graphics()
      rect.lineStyle(2, 0x6d6875)
      rect.beginFill(0xedede9, 0.2)
      rect.drawRect(x, y, 120, 120)
      rect.endFill()
      row.push(rect)
      Pixi().containers.collision.addChild(rect)
    }
    Pixi().graphics.collision.push(row)
  }
  Pixi().containers.collision.visible = false
}
function tintCollision(): void {
  const screen = collision.screen(User().data.hero)
  let diffY = Math.floor(Math.abs(User().data.hero.y / 120)) - 6
  let diffX = Math.floor(Math.abs(User().data.hero.x / 120)) - 9
  diffX < 0 ? (diffX = Math.abs(diffX)) : (diffX = 0)
  diffY < 0 ? (diffY = Math.abs(diffY)) : (diffY = 0)
  screen.forEach((value, y) => {
    value.forEach((value, x) => {
      if (value === 1)
        Pixi().graphics.collision[y + diffY][x + diffX].tint = 0x0096c7
    })
  })
}
export async function setTicker() {
  updateMaps()
  drawCollision()

  Pixi().app.ticker.add(() => {
    padUpdate()
    User().data.hero.move()
    if (eachSec(1, { random: true })) updateMaps()
    l.keys(Pixi().sprites.maps).forEach((name: string) => setMapOffset(name))
    Pixi().sprites.hero["idle"].visible = true

    if (States().collisionEdit) {
      Pixi().containers.collision.visible = true
      Pixi().containers.collision.x = (-User().data.hero.x % 120) + 120
      Pixi().containers.collision.y = (-User().data.hero.y % 120) + 120
      tintCollision()
      updateCollision()
    } else {
      Pixi().containers.collision.visible = false
    }

    Pixi().ticks++
  })

  States().allLoaded = true
}
