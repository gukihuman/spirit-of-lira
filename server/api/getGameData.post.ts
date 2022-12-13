import { getGameData } from "../db/getGameData"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
  }
  const res = await getGameData(reqData)
  return res
})
