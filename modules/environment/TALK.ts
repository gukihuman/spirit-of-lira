class Talk {
  component = {
    distance: 200,
    scene: "",
    instantChoices: true, // maybe, just maybe some talk without it :)
    x: -60,
    y: -100,
  }
  updatePosition = false
  talkEntity
  process() {
    MUSEUM.processEntity(["TALK"], (entity) => {
      if (
        COORD.distance(entity.POSITION, SH.hero.POSITION) < entity.TALK.distance
      ) {
        this.talkEntity = entity
      }
    })
    if (!this.talkEntity) return
    if (
      COORD.distance(this.talkEntity.POSITION, SH.hero.POSITION) <
      this.talkEntity.TALK.distance
    ) {
      INTERFACE.talk = true
      this.updatePosition = true
      this.debouncedTurnOff()
    } else {
      INTERFACE.talk = false
    }
    if (this.updatePosition) {
      INTERFACE.talkEntity = this.talkEntity.name
      INTERFACE.talkPosition = {
        x:
          this.talkEntity.POSITION.x -
          SH.hero.POSITION.x +
          CONFIG.viewport.width / 2 +
          this.talkEntity.TALK.x,
        y:
          this.talkEntity.POSITION.y -
          SH.hero.POSITION.y +
          CONFIG.viewport.height / 2 +
          this.talkEntity.TALK.y,
      }
    }
  }
  debouncedTurnOff = _.debounce(() => {
    this.updatePosition = false
    this.talkEntity = null
  }, 500)
  init() {
    EVENTS.onSingle("talk", () => this.emit())
  }
  emit() {
    if (!this.talkEntity) return
    if (SH.hero.STATE.active === "dead") return
    if (GLOBAL.sceneContextChangedMS + 1000 > LOOP.elapsedMS) return
    EVENTS.emit("startScene", {
      name: this.talkEntity.TALK.scene,
      instantChoices: this.talkEntity.TALK.instantChoices,
    })
  }
}
export const TALK = new Talk()
