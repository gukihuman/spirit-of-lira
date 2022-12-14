import { _updateGameData } from "../db/_updateGameData"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
    gameData: body.gameData,
  }
  const res = await _updateGameData(reqData)
  return res
})
