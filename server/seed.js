// server/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanAndSeed() {
  console.log(" Nettoyage complet de la base de données...");

  // 1. Supprime TOUTES les métriques et TOUS les sites existants d'un coup
  await prisma.metric.deleteMany({});
  await prisma.website.deleteMany({});
  
  console.log("Tables vidées avec succès !");

  const user = await prisma.user.findFirst();
  const userId = user ? user.id : 1;

  
  await prisma.website.create({
    data: {
      id: 1,
      name: 'Google France',
      url: 'http://localhost:5000/api/websites',
      userId: userId,
    },
  });

  await prisma.website.create({
    data: {
      id: 2,
      name: 'GitHub Portal',
      url: 'http://localhost:5000/api/websites',
      userId: userId,
    },
  });

  console.log("Base de données propre avec uniquement les URLs locales !");
}

cleanAndSeed()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
