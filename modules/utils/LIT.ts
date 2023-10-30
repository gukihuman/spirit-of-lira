class Lit {
  processEntity(components: string[], fn: (entity, id?) => void) {
    WORLD.entities.forEach((entity, id) => {
      let satisfied = true
      components.forEach((component) => {
        if (!entity[component]) satisfied = false
      })
      if (satisfied) fn(entity, id)
    })
  }
}
export const LIT = new Lit()
