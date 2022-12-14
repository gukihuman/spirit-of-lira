import { _getGameData } from "../db/_getGameData"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
  }
  const res = await _getGameData(reqData)
  return res
})
