// third-party libs
import GukiInputController from "guki-input-controller"
export const gic = new GukiInputController()

import * as pixi from "pixi.js"
export const PIXI = pixi

import lodash from "lodash"
export const _ = lodash

// files from outside .guki folder
export default defineNuxtPlugin(async () => {
  const entities = import.meta.glob("@/entities/**")
  for (const path in entities) {
    const entity = await entities[path]()
    const name = `${_.toLower(entity.default.name)}`
    gs.entities.set(name, entity.default)
  }
  const systems = import.meta.glob("@/systems/**")
  for (const path in systems) {
    const system = await systems[path]()
    const name = `${_.toLower(system.default.name)}`
    gs.systems.set(name, system.default)
  }
  const webps = import.meta.glob("@/**/*.webp")
  for (const path in webps) {
    const webp = await webps[path]()
    let name = webp.default.match(/[^\/\\&\?]+(?=\.\w{3,4}(?=([\?&].*$|$)))/)
    if (!name) continue
    if (name[0].includes(".")) {
      name[0] = name[0].match(/.*(?=\.)/)
    }
    if (name[0].includes(".")) {
      name[0] = name[0].match(/.*(?=\.)/)
    }
    if (typeof name[0] !== typeof "") name[0] = name[0][0]
    name = name[0].toLowerCase()
    console.log(name, webp.default)
    gs.webps.set(name, webp.default)
  }
  const jsons = import.meta.glob("@/assets/**/*.json")
  for (const path in jsons) {
    const json = await jsons[path]()
    if (!json.default.meta) return
    let name = json.default.meta.image
    if (name.includes(".")) {
      name = name.match(/.*(?=\.)/)
    }
    name = name[0].toLowerCase()

    // inject webp so vite packer understand it
    if (gs.webps.has(name)) {
      json.default.meta.image = gs.webps.get(name)
    }
    console.log(name, json.default.meta.image)

    gs.jsons.set(name, json.default)
  }
})
