import { prisma } from "."

export const _updateGameData = async (reqData) => {
  const res = await prisma.user.update({
    where: {
      name: reqData.name,
    },
    data: {
      gameData: reqData.gameData,
    },
  })
  return res
}
