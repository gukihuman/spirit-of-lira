class Filters {
    hover
    hover_2
    tracked
    init() {
        // this.hover = new PIXI_FILTERS.AdvancedBloomFilter({
        //     quality: 2,
        //     bloomScale: 0.23,
        //     blur: 6,
        // })
        this.hover_2 = new PIXI_FILTERS.OutlineFilter(5, 0xc0c1b8, 1, 0.5)
        // this.hover = new PIXI_FILTERS.AdjustmentFilter({
        //     red: 1.1,
        //     blue: 1.1,
        //     saturation: 0.9,
        //     brightness: 1.1,
        // })
        // it is offensive track
        this.tracked = new PIXI_FILTERS.OutlineFilter(5, 0x9e2300, 1, 0.5)
        // this.tracked = new PIXI_FILTERS.AdjustmentFilter({
        //     red: 1.4,
        //     saturation: 0.7,
        //     brightness: 0.8,
        // })
        // Preload filters to prevent lag
        const container = SPRITE.getContainer(HERO.id)
        if (container) {
            container.filters = [this.hover_2, this.tracked]
            setTimeout(() => (container.filters = []), 0)
        }
    }
    lastContainer: Container | undefined
    process() {
        if (this.lastContainer) this.lastContainer.filters = []
        if (!HERO.ent.TARGET) return
        const id = HERO.ent.TARGET.id
        const ent = WORLD.entities.get(id)
        if (!id || !ent) return
        const animation = SPRITE.getLayer(id, "animation")
        this.lastContainer = animation
        if (animation) {
            animation.filters = [this.hover_2]
            // 📜 here cast is always offensive, when other cast added, think how to change that
            if (!HERO.ent.STATE.track) return
            if (
                GLOBAL.lastActiveDevice !== "gamepad" &&
                GLOBAL.hoverId !== id &&
                !HERO.ent.STATE.track
            ) {
                return
            }
            // animation.filters.push(this.tracked)
            animation.filters = [this.tracked]
        }
    }
}
export const FILTERS = new Filters()
