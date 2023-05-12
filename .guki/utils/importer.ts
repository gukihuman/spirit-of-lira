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
    gcs.entities.set(name, entity.default)
  }
  const systems = import.meta.glob("@/systems/**")
  for (const path in systems) {
    const system = await systems[path]()
    const name = `${_.toLower(system.default.name)}`
    gcs.systems.set(name, system.default)
  }
})
