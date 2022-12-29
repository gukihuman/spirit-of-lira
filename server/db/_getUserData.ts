import { prisma } from "."
export interface reqData {
  name: string
}

export const _getUserData = async (reqData: reqData) => {
  try {
    const res = await prisma.user.findFirst({
      where: {
        name: reqData.name,
      },
    })
    return res
  } catch (err) {
    return err
  }
}
