// functions that is used by other modules that may conflict with LIBRARY order of usage creating circular dependencies, basically this is a place to put shared functions if there is some order conflict
class Museum {
  processEntity(
    components: string[] | string,
    fn: (entity, id: number) => void
  ) {
    WORLD.entities.forEach((entity, id) => {
      let satisfied = true
      if (typeof components === "string") {
        if (!entity[components]) satisfied = false
      } else {
        components.forEach((component) => {
          if (!entity[component]) satisfied = false
        })
      }
      if (satisfied) fn(entity, id)
    })
  }
}
export const MUSEUM = new Museum()
