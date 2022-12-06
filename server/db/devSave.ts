import { prisma } from ".";

export const putData = async (data) => {
  const x = await prisma.devSave.upsert({
    where: {
      dataName: data.dataName,
    },
    update: {
      data: data.data,
    },
    create: {
      dataName: data.dataName,
      data: data.data,
    },
  });
  return x;
};
