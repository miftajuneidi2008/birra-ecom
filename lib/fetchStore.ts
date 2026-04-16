import prisma from "./prisma";

export async function getStoreByUserId(userId: string) {
  return await prisma.store.findFirst({
    where: { userId }
  });
}