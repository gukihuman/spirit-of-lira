// functions that is used by other modules that may conflict with LIBRARY order of usage creating circular dependencies, basically this is more foundational functions used more internally on app building not executing
class Museum {
  processEntity(components: string[], fn: (entity, id?: number) => void) {
    WORLD.entities.forEach((entity, id) => {
      let satisfied = true
      components.forEach((component) => {
        if (!entity[component]) satisfied = false
      })
      if (satisfied) fn(entity, id)
    })
  }
}
export const MUSEUM = new Museum()
