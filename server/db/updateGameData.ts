import { prisma } from "."

export const updateGameData = async (reqData) => {
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
