export default {
  // 🔧
  depend: ["sprite", "size"],
  inject(entity, id) {
    const shadow = new PIXI.Graphics()
    shadow.beginFill(0x000000)
    const width = entity.size.width / 2
    shadow.drawCircle(0, 0, width)
    shadow.endFill()
    shadow.scale = { x: 1, y: 0.5 }
    shadow.alpha = 0.08
    shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY
    const blurFilter = new PIXI.filters.BlurFilter()
    blurFilter.blur = 10
    shadow.filters = [blurFilter]
    addShadow(shadow, id)
  },
}
const limit = 250
let counter = 0
function addShadow(shadow, id) {
  if (counter > limit) return
  const shadowLayer = SPRITE.getLayer(id, "shadow") as Container
  if (!shadowLayer) {
    // wait until sprite is loaded
    setTimeout(() => addShadow(shadow, id), 100)
    counter++
    return
  }
  shadowLayer.addChild(shadow)
}
