import { _getUserData } from "../db/_getUserData"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
  }
  const res = await _getUserData(reqData)
  return res
})
