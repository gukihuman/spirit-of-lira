import { prisma } from "."
export interface reqData {
  name: string
  userData: string
}

export const _updateUserData = async (reqData: reqData) => {
  try {
    const res = await prisma.user.update({
      where: {
        name: reqData.name,
      },
      data: {
        userData: reqData.userData,
      },
    })
    return res
  } catch (err) {
    return err
  }
}
