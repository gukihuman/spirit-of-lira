import { prisma } from "."

export const _getCollision = async (reqData) => {
  const res = await prisma.map.findFirst({
    where: {
      name: reqData.name,
    },
  })
  return res
}
