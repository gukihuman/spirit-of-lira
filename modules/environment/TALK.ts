class Talk {
  // 📜 add component talk here :)
  updatePosition = false
  entity
  process() {
    MUSEUM.processEntity(["talk"], (entityToCheck) => {
      if (
        COORD.distance(entityToCheck.position, WORLD.hero.position) <
        entityToCheck.talk.distance
      ) {
        this.entity = entityToCheck
      }
    })
    if (!this.entity) return
    if (
      COORD.distance(this.entity.position, WORLD.hero.position) <
      this.entity.talk.distance
    ) {
      INTERFACE.talk = true
      this.updatePosition = true
      this.debouncedTurnOff()
    } else {
      INTERFACE.talk = false
    }
    if (this.updatePosition) {
      INTERFACE.talkEntity = this.entity.name
      INTERFACE.talkPosition = {
        x:
          this.entity.position.x -
          WORLD.hero.position.x +
          CONFIG.viewport.width / 2 +
          this.entity.talk.x,
        y:
          this.entity.position.y -
          WORLD.hero.position.y +
          CONFIG.viewport.height / 2 +
          this.entity.talk.y,
      }
    }
  }
  debouncedTurnOff = _.debounce(() => {
    this.updatePosition = false
    this.entity = null
  }, 500)
  init() {
    EVENTS.onSingle("talk", () => this.emit())
  }
  emit() {
    if (!this.entity) return
    EVENTS.emit("startScene", {
      name: this.entity.talk.scene,
      instantChoices: this.entity.talk.instantChoices,
    })
  }
}
export const TALK = new Talk()
