class Talk {
  // 📜 add component talk here :)
  updatePosition = false
  process() {
    LIT.processEntity(["talk"], (entity) => {
      if (COORD.distance(entity.position, WORLD.hero.position) < 200) {
        INTERFACE.talk = true
        this.updatePosition = true
        this.debouncedTurnOffUpdatePosition()
      } else {
        INTERFACE.talk = false
      }
      if (this.updatePosition) {
        INTERFACE.talkEntity = entity.name
        INTERFACE.talkPosition = {
          x:
            entity.position.x -
            WORLD.hero.position.x +
            CONFIG.viewport.width / 2 +
            entity.talk.x,
          y:
            entity.position.y -
            WORLD.hero.position.y +
            CONFIG.viewport.height / 2 +
            entity.talk.y,
        }
      }
    })
  }
  debouncedTurnOffUpdatePosition = _.debounce(() => {
    this.updatePosition = false
  }, 500)
}
export const TALK = new Talk()
