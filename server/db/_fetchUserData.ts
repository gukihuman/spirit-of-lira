import { prisma } from "."
export interface reqData {
  name: string
}

export const _fetchUserData = async (reqData: reqData) => {
  try {
    let res: any = await prisma.user.findFirst({
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
