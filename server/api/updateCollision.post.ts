import { _updateCollision } from "../db/_updateCollision"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
    accessKey: body.accessKey,
    collision: body.collision,
  }
  const res = await _updateCollision(reqData)
  return res
})
