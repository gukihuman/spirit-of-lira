import { updateGameData } from "../db/updateGameData"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reqData = {
    name: body.name,
    gameData: body.gameData,
  }
  const res = await updateGameData(reqData)
  return res
})
