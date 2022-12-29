import { _updateUserData } from "../db/_updateUserData"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
    userData: body.userData,
  }
  const res = await _updateUserData(reqData)
  return res
})
