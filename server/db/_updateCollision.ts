import { prisma } from "."
export interface reqData {
  name: string
  accessKey: string
  collision: string
}

export const _updateCollision = async (reqData: reqData) => {
  if (process.env.ACCESS_KEY === reqData.accessKey) {
    try {
      const res = await prisma.map.update({
        where: {
          name: reqData.name,
        },
        data: {
          collision: reqData.collision,
        },
      })
      return res
    } catch (err) {
      return err
    }
  } else {
    return "no access"
  }
}
