import { uniqueNamesGenerator } from "unique-names-generator"
import { adjectives, colors, animals } from "unique-names-generator"
import { prisma } from "."

export const _createUser = async () => {
  const res = await prisma.user.create({
    data: {
      name: uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
      }),
      gameData: "",
    },
  })
  return res
}
