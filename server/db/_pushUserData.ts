import { prisma } from "."
export interface reqData {
  name: string
  userData: string
}

export const _pushUserData = async (reqData: reqData) => {
  try {
    let res: any = await prisma.user.update({
      where: {
        name: reqData.name,
      },
      data: {
        userData: reqData.userData,
      },
    })
    res = res || "not found"
    return res
  } catch (err) {
    return err
  }
}
