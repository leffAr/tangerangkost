import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const images = await prisma.kosImage.findMany({ 
    orderBy: { kos: { createdAt: 'desc' } }, 
    take: 10 
  });
  console.log(images);
}
main().finally(() => prisma.$disconnect());
