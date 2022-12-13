import { prisma } from "."

export const updateCollision = async (reqData) => {
  if (process.env.ACCESS_KEY === reqData.accessKey) {
    const res = await prisma.map.upsert({
      where: {
        name: reqData.name,
      },
      update: {
        collision: reqData.collision,
      },
      create: {
        name: reqData.name,
        collision: reqData.collision,
      },
    })
    return res
  }
}
