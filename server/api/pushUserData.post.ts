import { _pushUserData } from "../db/_pushUserData"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
    userData: body.userData,
  }
  const res = await _pushUserData(reqData)
  return res
})
