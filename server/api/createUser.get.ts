import { createUser } from "../db/createUser"

export default defineEventHandler(async () => {
  const res = await createUser()
  return res
})
