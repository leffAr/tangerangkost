const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const areas = [
  "Balaraja", "Cikupa", "Cisauk", "Cisoka", "Curug", "Gunung Kaler", 
  "Jambe", "Jayanti", "Kelapa Dua", "Kemiri", "Kosambi", "Kresek", 
  "Kronjo", "Legok", "Mauk", "Mekar Baru", "Pagedangan", "Pakuhaji", 
  "Panongan", "Pasar Kemis", "Rajeg", "Sepatan", "Sepatan Timur", 
  "Sindang Jaya", "Solear", "Sukadiri", "Sukamulya", "Teluknaga", "Tigaraksa"
];

async function main() {
  const count = await prisma.popularArea.count();
  if (count === 0) {
    console.log("Seeding Popular Areas...");
    for (let i = 0; i < areas.length; i++) {
      await prisma.popularArea.create({
        data: {
          name: `Kost ${areas[i]}`,
          imageUrl: `https://picsum.photos/seed/${areas[i].toLowerCase().replace(/\s/g, '')}/600/400`,
          order: i + 1
        }
      });
    }
    console.log("Done seeding!");
  } else {
    console.log(`Already has ${count} areas.`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
