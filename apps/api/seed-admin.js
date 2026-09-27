const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@tangerangkost.com';
  const password = 'password123';
  
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: adminEmail },
      data: { passwordHash: hashedPassword, role: 'ADMIN' }
    });
    console.log('Admin password reset to: password123');
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        name: 'Super Admin',
        phone: '080000000000',
        role: 'ADMIN',
      }
    });
    console.log('Admin created: admin@tangerangkost.com / password123');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
