export default defineNuxtPlugin(async () => {
  const modules = import.meta.glob("@/models/**")
  for (const path in modules) {
    const mod = await modules[path]()
    gef.entityModels.set(mod.default.name, mod.default)
  }
})
