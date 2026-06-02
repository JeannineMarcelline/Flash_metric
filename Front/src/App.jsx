import React, { useState, useEffect } from 'react';

export default function App() {
  const [websites, setWebsites] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  
  const fetchWebsites = async () => {
    try{
      const response = await fetch('http://localhost:5000/api/websites'); 
      const data = await response.json();
      setWebsites(data);
    }catch(error) {
      console.error('Erreur lors de la recuperationdes sites');
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleSubmit = async (e) =>{
    e.preventDefault(); 
    if (!name || !url) return alert("Remplis tous les champs !");
    try{
      const response = await fetch('http://localhost:5000/api/websites',{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({name,url}),
      });
      if(response.ok){
        setName('');
        setUrl('');
        fetchWebsites();
      }
    }catch (error){
      console.error("Erreur lors de l'ajout:" , error);
    }
  }

  const handleDelete = async (id) => {
    if(!confirm("veut-tu vraiment supprimer ce site ?")) return;
    try{
      const response = await fetch(`http://localhost:5000/api/websites/${id}`,{
        method: 'DELETE',
      });
      if (response.ok){
        fetchWebsites();
      }
    }catch(error) {
      console.error("Erreur lors de la suppression:", error)
    }
  };
 
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* En-tête du Dashboard */}
      <header className="mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Flash Metrix Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Surveillance en temps réel — {websites.length} site(s) actif(s)
        </p>
      </header>

      {/* Formulaire ajout */}
      <form onSubmit={handleSubmit} className="mb-10 bg-slate-800 p-6 rounded-2xl border border-slate-700 max-w-2xl flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">Nom du site</label>
          <input 
            type="text" 
            placeholder="Ex: Mon Blog" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex-1 w-full space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">URL du site</label>
          <input 
            type="url" 
            placeholder="Ex: https://..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)} 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <button 
          type="submit" 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:scale-95 text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 cursor-pointer h-[42px]"
        >
          Ajouter
        </button>
      </form>

      {/* Grille pour afficher les cartes des sites */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((site) => {
          // ==========================================
          // ZONE DE CALCUL DE TA MÉTRIQUE (AJOUTÉE ICI)
          // ==========================================
          
          // 1. On extrait la première ligne du tableau "metrics" renvoyé par Express
          const lastMetric = site.metrics && site.metrics[0];
          
          // 2. Si le statut de la métrique vaut 200, le site est en ligne (true), sinon (false)
          // S'il n'y a pas encore de métrique en base, on le considère en ligne par défaut
          const isOnline = lastMetric ? lastMetric.statut === 200 : true;
          
          // 3. On récupère le temps de réponse ou on affiche "..." s'il n'a pas encore été calculé
          const responseTime = lastMetric ? `${lastMetric.tempsReponse} ms` : '...';

          // ==========================================

          return (
            <div 
              key={site.id} 
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4 hover:border-slate-600 transition-colors"
            >
              {/* Haut de la carte : Nom et Statut */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">{site.name}</h2>
                  <span className="text-xs text-slate-400 font-mono block truncate max-w-[200px] mt-1">
                    {site.url}
                  </span>
                </div>
                
                {/* Badge d'état dynamique (Vert si isOnline est vrai, Rouge si faux) */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${
                  isOnline 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                  {isOnline ? 'En ligne' : 'En panne'}
                </span>
              </div>
              
              {/* Bas de la carte */}
         <div className="pt-4 border-t border-slate-700/50 flex justify-between text-sm">
                <span className="text-slate-400">Temps de réponse</span>
                <span className="font-medium text-blue-400 font-mono">{responseTime}</span>
              </div>

                          <div className="pt-2 flex justify-end">
  <button
    onClick={() => handleDelete(site.id)} // On passe l'ID du site cliqué à notre fonction
    className="text-xs bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-lg border border-red-500/20 transition-all font-medium cursor-pointer"
  >
    Supprimer le site
  </button>
</div>
     
            </div>
            
          );
        })}
      </main>
    </div>
  );
}


