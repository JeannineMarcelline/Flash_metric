// server/seed.js
// server/seed.js
import { PrismaClient } from '@prisma/client'; // Mettez cette ligne exacte !

const prisma = new PrismaClient();
// Le reste de votre code ne bouge pas...



async function main() {
  console.log("🚀 Début du remplissage de la base de données...");

  // 1. Création d'un utilisateur de test fictif
  // (Utile car votre schéma dit qu'un site web DOIT appartenir à un utilisateur)
  const user = await prisma.user.create({
    data: {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      telephone: '0102030405',
    },
  });
  console.log(`👤 Utilisateur créé avec l'ID : ${user.id}`);

  // 2. Ajout de Google France lié à cet utilisateur
  const google = await prisma.website.create({
    data: {
      name: 'Google France',
      url: 'https://google.fr',
      userId: user.id, // On le lie à Jean Dupont
    },
  });
  console.log(`🌐 Site ajouté : ${google.name}`);

  // 3. Ajout de GitHub Portal lié à cet utilisateur
  const github = await prisma.website.create({
    data: {
      name: 'GitHub Portal',
      url: 'https://github.com',
      userId: user.id, // On le lie à Jean Dupont
    },
  });
  console.log(`🌐 Site ajouté : ${github.name}`);

  console.log("🎉 Base de données initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    // Très important : on ferme la connexion à la base de données quand on a fini
    await prisma.$disconnect();
  });
