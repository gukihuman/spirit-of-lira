export default {
  alive: {
    faction: "peaceful",
    width: 10,
    height: 10,

    speed: 5,
    state: "idle",
    targetPosition: undefined,
    targetEntityId: 0,
    targetLocked: false,
    targetAttacked: false,

    lastFlipMS: 0,
    lastStateSwitchMS: 0,
    lastTargetPositionMS: 0,

    depend: ["visual"],
    init(entity, id, name, value) {
      //
      // draw shadow
      const shadow = new PIXI.Graphics()
      shadow.beginFill(0x000000)

      const width = entity.alive.width / 2

      shadow.drawCircle(0, 0, width)
      shadow.endFill()
      shadow.scale = { x: 1, y: 0.5 }
      shadow.alpha = 0.08
      shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY

      const blurFilter = new PIXI.filters.BlurFilter()
      blurFilter.blur = 10

      shadow.filters = [blurFilter]

      const container = PIXI_GUKI.getContainer(id)
      if (!container) return
      const back = container.children[0] as Container
      back.addChild(shadow)
    },
  },
}
