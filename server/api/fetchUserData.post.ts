import { _fetchUserData } from "../db/_fetchUserData"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
  }
  const res = await _fetchUserData(reqData)
  return res
})
