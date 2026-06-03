# Flash Metrix - Dashboard de Surveillance Web

Un outil de "Uptime monitoring" qui surveille la vitesse et la disponibilité des sites web en temps réel

## Technologies utilisées
- Frontend: Reactjs, Tailwind v4, Recharts(Graphiques temporels)
- Backend: Node.js, Express, Prisma(ORM)
- Base de données: SqLite

## Comment lancer le projet en local
1. Installez les dépendances à la racine et dans le dossier server (`npm install`).
2. Dans le dossier `server`, lancez la base de données : `npx prisma db push`.
3. Remplissez la base avec les données de test : `npx prisma db seed`.
4. Démarrez le serveur backend : `node index.js`.
5. Démarrez l'interface frontend à la racine : `npm run dev`.


