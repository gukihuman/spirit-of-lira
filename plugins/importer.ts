export default defineNuxtPlugin(async () => {
  const modules = import.meta.glob("@/ts/*.ts")
  for (const path in modules) {
    const mod = await modules[path]()
    ggm.nodes.set(mod.default.name, mod.default)
  }
})
