// third-party libs
import GukiInputController from "guki-input-controller"
export const INPUT = new GukiInputController()

import * as pixi from "pixi.js"
export const PIXI = pixi

import * as filters from "pixi-filters"
export const PIXI_FILTERS = filters

import lodash from "lodash"
export const _ = lodash

// fill storage with data from entities/components/systems folders
// as well as webp and json from assets folder
export default defineNuxtPlugin(async () => {
  //
  const entities = import.meta.glob("@/entities/**")
  for (const path in entities) {
    //
    // name of the file
    const match = path.match(/\/([^/]+)\.ts$/)
    if (!match) return
    const name = `${_.toLower(match[1])}`

    const entity = await entities[path]()
    STORE.entities.set(name, entity.default)
    entity.default.name = name
  }

  const components = import.meta.glob("@/components/**")
  for (const path in components) {
    //
    // name of the file
    const match = path.match(/\/([^/]+)\.ts$/)
    if (!match) return
    const name = `${_.toLower(match[1])}`

    const component = await components[path]()
    STORE.components.set(name, component.default)
  }

  const systems = import.meta.glob("@/systems/**")
  for (const path in systems) {
    const system = await systems[path]()

    // here name is parsed from name of the class by using build-in name prop
    const name = `${_.toLower(system.default.name)}`
    STORE.systems.set(name, system.default)
  }

  const webps = import.meta.glob("@/assets/**/*.webp")
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
    STORE.webps.set(name, webp.default)
  }

  const jsons = import.meta.glob("@/assets/**/*.json")
  for (const path in jsons) {
    if (path.includes("miscellaneous")) continue
    const json = await jsons[path]()
    if (!json.default.meta) return
    let name = json.default.meta.image
    if (name.includes(".")) {
      name = name.match(/.*(?=\.)/)
    }
    name = name[0].toLowerCase()

    // inject parsed path of webp file so vite packer understand it
    if (STORE.webps.has(name)) json.default.meta.image = STORE.webps.get(name)

    STORE.jsons.set(name, json.default)
  }
})
