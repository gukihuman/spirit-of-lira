import { _createMapIfNotExist } from "../db/_createMapIfNotExist"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
    accessKey: body.accessKey,
    collision: body.collision,
  }
  const res = await _createMapIfNotExist(reqData)
  return res
})
