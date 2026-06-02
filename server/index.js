import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/websites', async(req, res) => {
    try{
        console.log("mis mitady ny liste ny site o")
        const websites = await prisma.website.findMany({
            include:{
                metrics: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
        return res.status(200).json(websites || []);
    }catch(error){
        console.error("Erreur Prisma:" , error)
        res.status(500).json({ error: "Erreur serveur"})
    }
});

app.post('/api/websites', async(req, res) => {
try{
    const{ name, url} = req.body;
    const newWebsite = await prisma.website.create({
    data: {
        name: name,
        url: url,
        userId: 1
    }
    });
    res.status(201).json(newWebsite);
} catch(error) {
    res.status(500).json({ error: "Impossible d'ajouter"});
}
});

app.delete('/api/websites/:id', async(req, res) =>{
    const siteId = parseInt(req.params.id);
    try{
        await prisma.$executeRawUnsafe('PRAGMA foreign_key = OFF;');
        await prisma.metric.deleteMany({
            where: { websiteId: siteId }
        });
        await prisma.website.delete({
            where: {id: siteId}
        });
        await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;');
        res.status(200).json({message: "Site supprimé avec succès"});
    } catch(error) {
        await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;');
        console.error("Erreur Prisma suppression:", error);
        res.status(500).json({error: "Impossible de suprimer le site"});
    }
})

async function checkWebsites() {
 console.log('Lancement de verification automatique des sites.. ');

 try{
    const websites = await prisma.website.findMany();

     if (!websites || !Array.isArray(websites)) {
      console.log("⚠️ Aucune liste de sites valide récupérée.");
      return;
    }

    for (const site of websites) {
        const startTime = Date.now();
        try{
     const reponse = await fetch(site.url);
     const responseTime = Date.now() - startTime;

     await prisma.metric.create({
        data: {
            websiteId: site.id,
            statut: response.status,
            tempsReponse: responseTime
        }
     });
console.log(` ${site.name} → ${response.status} en ${responseTime}ms`);
        } catch(siteError) {
            const responseTime = Date.now() - startTime;
            await prisma.metric.create({
                data: {
                    websiteId: site.id,
                    statut: 500,
                    tempsReponse: responseTime
                }
            });
            console.log(`${site.name} est inaccesible`)
        }
    } 
 }catch (error) {
   console.error("Erreur global du robot:", error)
 }
}
setInterval(checkWebsites, 600000);
checkWebsites();

app.listen(port, () => {
    console.log(`serveur demaré sur le port ${port}`)
})

