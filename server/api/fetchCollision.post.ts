import { _fetchCollision } from "../db/_fetchCollision"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
  }
  const res = await _fetchCollision(reqData)
  return res
})
