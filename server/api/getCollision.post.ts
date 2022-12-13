import { getCollision } from "../db/getCollision"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
  }
  const res = await getCollision(reqData)
  return res
})
