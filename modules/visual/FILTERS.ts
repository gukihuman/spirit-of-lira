class Filters {
  hover
  tracked
  init() {
    this.hover = new PIXI_FILTERS.AdvancedBloomFilter({
      quality: 2,
      bloomScale: 0.23,
      blur: 6,
    })
    // it is offensive track
    this.tracked = new PIXI_FILTERS.AdjustmentFilter({
      red: 1.4,
      saturation: 0.9,
      brightness: 0.7,
    })
    // Preload filters to prevent lag
    const container = SPRITE.getContainer(WORLD.heroId)
    if (container) {
      container.filters = [this.hover, this.tracked]
      setTimeout(() => (container.filters = []), 0)
    }
  }
  lastContainer: Container | undefined
  process() {
    if (this.lastContainer) this.lastContainer.filters = []
    if (!WORLD.hero.TARGET) return
    const id = WORLD.hero.TARGET.id
    const entity = WORLD.entities.get(id)
    if (!id || !entity) return
    const animation = SPRITE.getLayer(id, "animation")
    this.lastContainer = animation
    if (animation) {
      animation.filters = [this.hover]
      // 📜 here cast is always offensive, when other cast added, think how to change that
      if (!WORLD.hero.STATE.track) return
      if (
        GLOBAL.lastActiveDevice !== "gamepad" &&
        GLOBAL.hoverId !== id &&
        !WORLD.hero.STATE.track
      ) {
        return
      }
      animation.filters.push(this.tracked)
    }
  }
}
export const FILTERS = new Filters()
