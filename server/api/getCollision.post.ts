import { _getCollision } from "../db/_getCollision"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
  }
  const res = await _getCollision(reqData)
  return res
})
