export default defineNuxtPlugin(async () => {
  const modules = import.meta.glob("@/ts/**")
  for (const path in modules) {
    const mod = await modules[path]()
    gef.entities.set(mod.default.name, mod.default)
  }
})
