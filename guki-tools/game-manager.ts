class GameManager {
  private freeId: number = 0
  // nodes populated from all separate node files
  public nodes: Map<string, gUnique | gEnemy> = new Map()
  private entities: Map<number, gEntity> = new Map()

  public async instanceEntity(name) {
    const node = this.nodes.get(name)
    if (!node) return

    let entity: gEntity
    if (gtm.gUnique(node)) {
      entity = {
        ...node,
        id: this.freeId,
        state: "idle",
      }
    } else {
      entity = {
        ...node,
        id: this.freeId,
        // 📜 generete coordinates from mapChunks
        x: 0,
        y: 0,
        state: "idle",
      }
    }
    this.entities.set(this.freeId, entity)
    await gpm.loadEntityContainer(this.freeId, entity)
    const entityContainer = gpm.findEntityContainer(this.freeId)
    if (entityContainer) {
      entityContainer.x = entity.x
      entityContainer.y = entity.y
      gpm.app?.ticker.add(() => {
        const animatedSprite = gpm.findAnimationCantainer(
          entity.id,
          entity.state
        )
        if (animatedSprite) animatedSprite.visible = true
        entity.process()
      })
    }
    this.freeId++
  }
}
export const ggm = new GameManager()
