import { prisma } from "."
interface reqData {
  name: string
  accessKey: string
  collision: string
}
export const _createMapIfNotExist = async (reqData: reqData) => {
  if (process.env.ACCESS_KEY === reqData.accessKey) {
    const nameFound = await prisma.map.findFirst({
      where: {
        name: reqData.name,
      },
    })
    if (!nameFound) {
      try {
        const res = await prisma.map.create({
          data: {
            name: reqData.name,
            collision: reqData.collision,
          },
        })
        return res
      } catch (err) {
        return err
      }
    } else {
      return "map already exists"
    }
  } else {
    return "no access"
  }
}
