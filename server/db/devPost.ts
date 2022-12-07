import { prisma } from "./index";

export const devPost = async (reqData) => {
  const res = await prisma.dev.upsert({
    where: {
      name: reqData.name,
    },
    update: {
      data: reqData.data,
    },
    create: {
      name: reqData.name,
      data: reqData.data,
    },
  });
  return res;
};
