class Observer {
  //
  mapChunkChanged = false

  update() {
    this.mapChunkChanged =
      mapFromCo(User().data.hero.x) !== mapFromCo(before.userData.hero.x) ||
      mapFromCo(User().data.hero.y) !== mapFromCo(before.userData.hero.y)
  }
}
export const observer = new Observer()
