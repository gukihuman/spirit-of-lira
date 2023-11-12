class Talk {
  component = {
    distance: 200,
    scene: "",
    instantChoices: true, // maybe, just maybe some talk without it :)
    x: -60,
    y: -100,
  }
  updatePosition = false
  entity
  process() {
    MUSEUM.processEntity(["TALK"], (entityToCheck) => {
      if (
        COORD.distance(entityToCheck.POSITION, WORLD.hero.POSITION) <
        entityToCheck.TALK.distance
      ) {
        this.entity = entityToCheck
      }
    })
    if (!this.entity) return
    if (
      COORD.distance(this.entity.POSITION, WORLD.hero.POSITION) <
      this.entity.TALK.distance
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
          this.entity.POSITION.x -
          WORLD.hero.POSITION.x +
          CONFIG.viewport.width / 2 +
          this.entity.TALK.x,
        y:
          this.entity.POSITION.y -
          WORLD.hero.POSITION.y +
          CONFIG.viewport.height / 2 +
          this.entity.TALK.y,
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
      name: this.entity.TALK.scene,
      instantChoices: this.entity.TALK.instantChoices,
    })
  }
}
export const TALK = new Talk()
