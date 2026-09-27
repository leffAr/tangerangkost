import { PrismaClient, Role, GenderType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@tangerangkost.com' },
    update: {},
    create: {
      email: 'admin@tangerangkost.com',
      passwordHash,
      name: 'Super Admin',
      role: Role.ADMIN,
    },
  });

  // 2. Create Owner & Profile
  const owner = await prisma.user.upsert({
    where: { email: 'owner@tangerangkost.com' },
    update: {},
    create: {
      email: 'owner@tangerangkost.com',
      passwordHash,
      name: 'Bapak Kos',
      role: Role.OWNER,
      ownerProfile: {
        create: {
          verificationStatus: 'VERIFIED',
        }
      }
    },
    include: { ownerProfile: true }
  });

  // 3. Create User (Pencari Kos)
  await prisma.user.upsert({
    where: { email: 'user@tangerangkost.com' },
    update: {},
    create: {
      email: 'user@tangerangkost.com',
      passwordHash,
      name: 'Mahasiswa Baru',
      role: Role.USER,
    },
  });

  // 4. Create Dummy Kos for the Owner
  if (owner.ownerProfile) {
    const kos = await prisma.kos.upsert({
      where: { slug: 'kos-bintang-harapan-123' },
      update: {},
      create: {
        name: 'Kos Bintang Harapan',
        slug: 'kos-bintang-harapan-123',
        description: 'Kos eksklusif dekat kampus UMN, fasilitas lengkap, WiFi super cepat.',
        address: 'Jl. Scientia Boulevard No.1',
        village: 'Curug Sangereng',
        district: 'Kelapa Dua',
        regency: 'Kabupaten Tangerang',
        province: 'Banten',
        priceFrom: 1500000,
        priceTo: 2000000,
        genderType: GenderType.CAMPUR,
        ownerId: owner.ownerProfile.id,
      }
    });
    console.log('Seed created successfully!');
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
