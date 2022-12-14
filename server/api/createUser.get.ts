import { _createUser } from "../db/_createUser"

export default defineEventHandler(async () => {
  const res = await _createUser()
  return res
})
