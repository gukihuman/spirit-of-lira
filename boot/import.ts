import GukiInputController from "guki-input-controller"
export const INPUT = new GukiInputController()

import * as pixi from "pixi.js"
export const PIXI = pixi

import * as pixiFilters from "pixi-filters"
export const PIXI_FILTERS = pixiFilters

import lodash from "lodash"
export const _ = lodash

import * as mathjs from "mathjs"
export const MATHJS = mathjs

import { v4 as uuidv4 } from "uuid"
const unique = { string: uuidv4 }
type Unique = {
  /** @returns unique string like "6d4ca6fc-9dd7-4822-8324-fc5319c2f71" */
  string: () => string
}
export const UNIQUE: Unique = unique
