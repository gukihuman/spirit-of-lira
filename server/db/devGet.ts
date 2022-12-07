import { prisma } from ".";

export const devGet = async (reqData) => {
  const save = await prisma.dev.findFirst({
    where: {
      name: reqData.name,
    },
  });
  return save;
};
