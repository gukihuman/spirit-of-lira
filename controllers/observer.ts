class Observer {
  //
  mapChunkChanged = false

  update() {
    this.mapChunkChanged =
      c.mapChunkIndex(User().data.hero) !==
      c.mapChunkIndex(before.userData.hero)
  }
}
export const observer = new Observer()
