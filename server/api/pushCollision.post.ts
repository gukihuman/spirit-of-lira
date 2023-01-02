import { _pushCollision } from "../db/_pushCollision"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
    accessKey: body.accessKey,
    collisionData: body.collisionData,
  }
  const res = await _pushCollision(reqData)
  return res
})
