export default {
  id: 0,
  _locked: false,
  // 🔧
  inject(entity, id) {
    Object.defineProperty(entity.target, "entity", {
      get() {
        return WORLD.entities.get(entity.target.id)
      },
    })
    Object.defineProperty(entity.target, "locked", {
      get() {
        if (!entity.target.id) return
        return entity.target._locked
      },
      set(value: boolean) {
        if (value && !entity.target.id) return
        return (entity.target._locked = value)
      },
    })
  },
}
