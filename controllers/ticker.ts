export function ticker() {
  before.save()
  pixi.sprites.hero["idle"].visible = true
  l.keys(pixi.sprites.mapChunks).forEach((map) => pixi.moveMap(map))
  if (
    mapFromCo(User().data.hero.x) !== mapFromCo(before.userData.hero.x) ||
    mapFromCo(User().data.hero.y) !== mapFromCo(before.userData.hero.y)
  ) {
    pixi.loadCloseMapChunks()
  }
}
