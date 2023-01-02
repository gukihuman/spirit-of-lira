import { prisma } from "."
export interface reqData {
  name: string
}

export const _fetchCollision = async (reqData: reqData) => {
  try {
    let res: any = await prisma.collision.findFirst({
      where: {
        name: reqData.name,
      },
    })
    res = res || "not found"
    return res
  } catch (err) {
    return err
  }
}
