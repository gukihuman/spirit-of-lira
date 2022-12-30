import { _createMapIfNotExist } from "../db/_createMapIfNotExist"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    accessKey: body.accessKey,
    name: body.name,
    collision: body.collision,
  }
  const res = await _createMapIfNotExist(reqData)
  return res
})
