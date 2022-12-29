import { uniqueNamesGenerator as gen } from "unique-names-generator"
import { adjectives, colors, animals } from "unique-names-generator"
import { prisma } from "."

export const _createUser = async () => {
  let name: string = ""
  let freeNameFound: boolean = false
  while (!freeNameFound) {
    const tryName = gen({ dictionaries: [colors, adjectives, animals] })
    const nameFound = await prisma.user.findFirst({
      where: {
        name: tryName,
      },
    })
    if (!nameFound) {
      name = tryName
      freeNameFound = true
    }
  }

  try {
    const res = await prisma.user.create({
      data: {
        name: name,
        userData: "{}",
      },
    })
    return res
  } catch (err) {
    return err
  }
}
