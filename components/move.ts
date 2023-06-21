export default {
  move: {
    faction: "peaceful",
    speed: 5,
    health: 10,
    state: "idle",
    destination: undefined,

    // 📜 move to visual cuz non-move might need flip too like projectiles
    // may be not but it seems like better practice
    lastFlipMS: 0,
    lastAutoTargetPositionMS: 0,

    // 🔧
    depend: ["visual", "size"],
    trigger: ["target"],
    init(entity, id, name, value) {
      //
      // draw shadow
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

      const container = GPIXI.getMain(id)
      if (!container) return
      const back = container.children[0] as Container
      back.addChild(shadow)
    },
  },
}
