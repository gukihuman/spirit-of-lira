type Format = "ts" | "webp" | "json" | "md" | "mp3"
export default defineNuxtPlugin(async () => {
  await loadModules(import.meta.glob("@/modules/**/*"))
  await load(import.meta.glob("@/assets/**/*"), ASSETS.mds, "md")
  await load(import.meta.glob("@/assets/**/*"), ASSETS.audios, "mp3")
  await load(import.meta.glob("@/assets/**/*"), ASSETS.webps, "webp")
  await load(import.meta.glob("@/assets/**/*"), ASSETS.jsons, "json")
  // update image path for sprite jsons, essentially important
  _.forEach(ASSETS.jsons, (value, name) => {
    if (value.meta && ASSETS.webps[name]) value.meta.image = ASSETS.webps[name]
  })
})
async function loadModules(
  paths: Record<string, () => Promise<Record<string, any>>>
) {
  for (const path in paths) {
    const name = getFileName(path, "ts")
    if (!name) continue
    const item = await paths[path]()
    if (!item[name]) continue
    globalThis[name] = item[name] // to automatically init modules in start.ts
    CONFIG.modules.push(name)
    if (item[name].component) CONFIG.components.push(name)
  }
}
async function load(
  paths: Record<string, () => Promise<Record<string, any>>>,
  savePlace: AnyObject,
  format: Format
) {
  for (const path in paths) {
    const name = getFileName(path, format)
    if (!name) continue
    const item = await paths[path]()
    // for webp and mp3 item.default is just a string of path to the file
    savePlace[name] = item.default
  }
}
function getFileName(path: string, format: Format) {
  let match: any[] | null = null
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
