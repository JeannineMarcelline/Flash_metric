import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Utilisation de vos classes CSS nettoyées */}
      <div className="card-metrix max-w-sm w-full text-center space-y-4">
        
        <div className="flex justify-center items-center gap-2">
          <span className="badge-flash">Flash Metrix Actif</span>
        </div>

        <button className="btn-primary">
          Lancer un Ping Prisma
        </button>
      </div>
    </div>
  );
}
