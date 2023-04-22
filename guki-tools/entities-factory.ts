import { PiniaPluginContext } from "pinia"
import { Sprite } from "pixi.js"

class EntitiesFactory {
  private freeId: number = 0
  public instanciatedHero: gInstanciatedEntity | undefined
  // entities populated from all separate entity files
  public entities: Map<string, gUniqueEntity | gCommonEntity> = new Map()
  public instanciatedEntities: Map<number, gInstanciatedEntity> = new Map()

  public async instanceEntity(name) {
    const entity = this.entities.get(name)
    if (!entity) return

    let instanciatedEntity: gInstanciatedEntity
    if (gtm.gUniqueEntity(entity)) {
      instanciatedEntity = {
        ...entity,
        id: this.freeId,
        state: "idle",
      }
    } else {
      instanciatedEntity = {
        ...entity,
        id: this.freeId,
        // 📜 generete coordinates from mapChunks
        x: 0,
        y: 0,
        state: "idle",
      }
    }
    // one time instanciatedHero assignment
    if (!this.instanciatedHero && instanciatedEntity.name === "hero") {
      this.instanciatedHero = instanciatedEntity
    }

    this.instanciatedEntities.set(this.freeId, instanciatedEntity)
    await gpm.loadEntityContainer(this.freeId, instanciatedEntity)
    const entityContainer = gpm.findEntityContainer(this.freeId)
    if (entityContainer) {
      gpm.app?.ticker.add(() => {
        if (this.instanciatedHero) {
          entityContainer.x =
            instanciatedEntity.x - this.instanciatedHero.x + 960
          entityContainer.y =
            instanciatedEntity.y - this.instanciatedHero.y + 540
        }

        // set visibility of animations
        entityContainer
          .getChildByName("animations")
          .children?.forEach((child) => {
            if (
              child instanceof PIXI.Sprite &&
              child.name === instanciatedEntity.state
            ) {
              child.visible = true
            } else if (child instanceof PIXI.Sprite) {
              child.visible = false
            }
          })

        instanciatedEntity.process()
      })
    }
    this.freeId++
  }
}
export const gef = new EntitiesFactory()
