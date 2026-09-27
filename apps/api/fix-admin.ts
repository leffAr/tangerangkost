import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  await prisma.user.update({
    where: { email: 'admin@tangerangkost.com' },
    data: { passwordHash }
  });
  
  console.log('Admin password updated successfully');
}

main().finally(() => prisma.$disconnect());
