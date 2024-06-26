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

import crypto_js from "crypto-js"
export const CRYPTO_JS = crypto_js

import { v4 } from "uuid"
const unique: Unique = { string: v4 }
export const UNIQUE: Unique = unique
type Unique = {
    /** @returns unique string like "6d4ca6fc-9dd7-4822-8324-fc5319c2f71" */
    string: () => string
}
