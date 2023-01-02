import { prisma } from "."
export interface reqData {
  name: string
  accessKey: string
  collisionData: string
}

export const _pushCollision = async (reqData: reqData) => {
  if (process.env.ACCESS_KEY === reqData.accessKey) {
    try {
      let res: any = await prisma.collision.upsert({
        where: {
          name: reqData.name,
        },
        update: {
          collisionData: reqData.collisionData,
        },
        create: {
          name: reqData.name,
          collisionData: reqData.collisionData,
        },
      })
      res = res || "not found"
      return res
    } catch (err) {
      return err
    }
  } else {
    return "no access"
  }
}
