export default defineNuxtPlugin(async () => {
  const modules = MODELS.modules // for compact view :)
  await load(import.meta.glob("@/modules/**/*"), modules, false, "ts", true)
  await load(import.meta.glob("@/entities/**/*"), MODELS.entities, true)
  await load(import.meta.glob("@/components/**/*"), MODELS.components)
  await load(import.meta.glob("@/data/items/weapons/**/*"), ITEMS.weapons)
  await load(import.meta.glob("@/data/items/clothes/**/*"), ITEMS.clothes)
  await load(import.meta.glob("@/data/skills/**/*"), SKILLS.list)
  await load(import.meta.glob("@/data/scenes/**/*"), SCENE.mds, false, "md")
  await load(import.meta.glob("@/data/scenes/options.ts"), SCENE)
  await load(import.meta.glob("@/assets/**/*"), ASSETS.webps, false, "webp")
  await load(import.meta.glob("@/assets/**/*"), ASSETS.jsons, false, "json")
  await load(import.meta.glob("@/assets/**/*"), ASSETS.audios, false, "mp3")
  // essentially important for proper sprite work
  _.forEach(ASSETS.jsons, (value, name) => {
    if (value.meta && ASSETS.webps[name]) {
      value.meta.image = ASSETS.webps[name]
    }
  })
})
async function load(
  paths,
  savePlace: AnyObject | string[],
  addNameProperty: boolean = false,
  format: LoadFormats = "ts",
  justNames: boolean = false
) {
  for (const path in paths) {
    const name = getFileName(path, format)
    if (!name) continue
    const item = await paths[path]()
    if (justNames) {
      globalThis[name] = item
      savePlace.push(name)
      continue
    }
    savePlace[name] = item.default
    if (addNameProperty) item.default.name = name
  }
}
function getFileName(path: string, format: LoadFormats) {
  let match
  if (format === "ts") {
    match = path.match(/\/([^/]+)\.ts/)
  } else if (format === "webp") {
    match = path.match(/\/([^/]+)\.webp/)
  } else if (format === "json") {
    match = path.match(/\/([^/]+)\.json/)
  } else if (format === "md") {
    match = path.match(/\/([^/]+)\.md/)
  } else if (format === "mp3") {
    match = path.match(/\/([^/]+)\.mp3/)
  }
  if (!match) return
  return `${match[1]}`
}
