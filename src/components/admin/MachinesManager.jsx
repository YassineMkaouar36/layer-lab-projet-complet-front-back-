import { useState } from 'react';

const MachinesManager = () => {
  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  };

  const [machines, setMachines] = useState([
    {
      id: 1,
      nom: 'Bambu Lab X1 Carbon #1',
      modele: 'X1 Carbon',
      statut: 'En impression',
      progression: 75,
      tempsRestant: '2h 15min',
      temperature: '220°C',
      projetActuel: 'lampe rétro',
      totalImpressions: 142,
      tempsUtilisation: '320h'
    },
    {
      id: 2,
      nom: 'Bambu Lab A1 mini #1',
      modele: 'A1 mini',
      statut: 'Disponible',
      progression: 0,
      tempsRestant: '-',
      temperature: '25°C',
      projetActuel: '-',
      totalImpressions: 89,
      tempsUtilisation: '180h'
    },
    {
      id: 3,
      nom: 'Bambu Lab X1 Carbon #2',
      modele: 'X1 Carbon',
      statut: 'Maintenance',
      progression: 0,
      tempsRestant: '-',
      temperature: '25°C',
      projetActuel: '-',
      totalImpressions: 203,
      tempsUtilisation: '450h'
    },
    {
      id: 4,
      nom: 'Prusa i3 MK3S+ #1',
      modele: 'MK3S+',
      statut: 'En impression',
      progression: 45,
      tempsRestant: '4h 30min',
      temperature: '210°C',
      projetActuel: 'Crystal Dragon',
      totalImpressions: 156,
      tempsUtilisation: '380h'
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'En impression': return 'bg-blue-100 text-blue-800';
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      case 'Hors ligne': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'En impression': return '🖨️';
      case 'Disponible': return '✅';
      case 'Maintenance': return '🔧';
      case 'Hors ligne': return '❌';
      default: return '❓';
    }
  };

  const MachineCard = ({ machine }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold" style={{ color: palette.navy }}>
            {machine.nom}
          </h3>
          <p className="text-sm" style={{ color: palette.mauve }}>
            {machine.modele}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">{getStatusIcon(machine.statut)}</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(machine.statut)}`}>
            {machine.statut}
          </span>
        </div>
      </div>

      {machine.statut === 'En impression' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: palette.indigo }}>
              {machine.projetActuel}
            </span>
            <span className="text-sm" style={{ color: palette.mauve }}>
              {machine.progression}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${machine.progression}%` }}
            ></div>
          </div>
          <p className="text-xs mt-2" style={{ color: palette.mauve }}>
            Temps restant: {machine.tempsRestant}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p style={{ color: palette.mauve }}>Température</p>
          <p className="font-medium" style={{ color: palette.navy }}>
            {machine.temperature}
          </p>
        </div>
        <div>
          <p style={{ color: palette.mauve }}>Total impressions</p>
          <p className="font-medium" style={{ color: palette.navy }}>
            {machine.totalImpressions}
          </p>
        </div>
        <div>
          <p style={{ color: palette.mauve }}>Temps d'utilisation</p>
          <p className="font-medium" style={{ color: palette.navy }}>
            {machine.tempsUtilisation}
          </p>
        </div>
        <div>
          <p style={{ color: palette.mauve }}>Projet actuel</p>
          <p className="font-medium" style={{ color: palette.navy }}>
            {machine.projetActuel || '-'}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
          Contrôler
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Historique
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: palette.navy }}>
            Gestion des Machines
          </h1>
          <p className="mt-2" style={{ color: palette.mauve }}>
            Surveillez et contrôlez vos imprimantes 3D
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <span>➕</span>
          Ajouter Machine
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Total Machines</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>{machines.length}</p>
            </div>
            <span className="text-2xl">🖨️</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>En impression</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>
                {machines.filter(m => m.statut === 'En impression').length}
              </p>
            </div>
            <span className="text-2xl">🔄</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Disponibles</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>
                {machines.filter(m => m.statut === 'Disponible').length}
              </p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Maintenance</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>
                {machines.filter(m => m.statut === 'Maintenance').length}
              </p>
            </div>
            <span className="text-2xl">🔧</span>
          </div>
        </div>
      </div>

      {/* Machines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>

      {/* Production Queue */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4" style={{ color: palette.navy }}>
          File d'attente de production
        </h2>
        
        <div className="space-y-3">
          {[
            { projet: 'Vases Japandi', client: 'Ahmed Ben Ali', priorite: 'Haute', tempsEstime: '3h 45min' },
            { projet: 'Gym Life Tag x5', client: 'Fatma Trabelsi', priorite: 'Normale', tempsEstime: '2h 30min' },
            { projet: 'Articulated Cat', client: 'Mohamed Sassi', priorite: 'Basse', tempsEstime: '2h 15min' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${
                    item.priorite === 'Haute' ? 'bg-red-500' :
                    item.priorite === 'Normale' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></span>
                  <div>
                    <p className="font-medium" style={{ color: palette.navy }}>
                      {item.projet}
                    </p>
                    <p className="text-sm" style={{ color: palette.mauve }}>
                      Client: {item.client}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: palette.navy }}>
                  {item.tempsEstime}
                </p>
                <p className="text-xs" style={{ color: palette.mauve }}>
                  Priorité {item.priorite}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MachinesManager;