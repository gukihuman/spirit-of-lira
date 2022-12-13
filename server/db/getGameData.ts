import { prisma } from "."

export const getGameData = async (reqData) => {
  const res = await prisma.user.findFirst({
    where: {
      name: reqData.name,
    },
  })
  return res
}
