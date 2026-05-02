import { useState } from 'react';

const ClientsManager = () => {
  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  };

  const [clients, setClients] = useState([
    {
      id: 1,
      nom: 'Ahmed Ben Ali',
      email: 'ahmed@email.com',
      telephone: '+216 20 123 456',
      ville: 'Tunis',
      dateInscription: '2024-01-15',
      totalCommandes: 5,
      totalDepense: '340 DT',
      statut: 'Actif'
    },
    {
      id: 2,
      nom: 'Fatma Trabelsi',
      email: 'fatma@email.com',
      telephone: '+216 25 789 012',
      ville: 'Sfax',
      dateInscription: '2024-01-10',
      totalCommandes: 3,
      totalDepense: '180 DT',
      statut: 'Actif'
    },
    {
      id: 3,
      nom: 'Mohamed Sassi',
      email: 'mohamed@email.com',
      telephone: '+216 22 345 678',
      ville: 'Sousse',
      dateInscription: '2024-01-08',
      totalCommandes: 8,
      totalDepense: '520 DT',
      statut: 'VIP'
    },
    {
      id: 4,
      nom: 'Leila Karray',
      email: 'leila@email.com',
      telephone: '+216 28 901 234',
      ville: 'Monastir',
      dateInscription: '2024-01-05',
      totalCommandes: 1,
      totalDepense: '45 DT',
      statut: 'Nouveau'
    },
  ]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Nouveau': return 'bg-blue-100 text-blue-800';
      case 'Inactif': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (nom) => {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ClientDetails = ({ client, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: palette.navy }}>
            Profil Client
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {getInitials(client.nom)}
            </span>
          </div>
          <div>
            <h4 className="text-xl font-bold" style={{ color: palette.navy }}>
              {client.nom}
            </h4>
            <p style={{ color: palette.mauve }}>{client.email}</p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.statut)}`}>
              {client.statut}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold mb-3" style={{ color: palette.indigo }}>
              Informations Personnelles
            </h5>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Téléphone:</span> {client.telephone}</p>
              <p><span className="font-medium">Ville:</span> {client.ville}</p>
              <p><span className="font-medium">Date d'inscription:</span> {client.dateInscription}</p>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-3" style={{ color: palette.indigo }}>
              Statistiques
            </h5>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Total commandes:</span> {client.totalCommandes}</p>
              <p><span className="font-medium">Total dépensé:</span> {client.totalDepense}</p>
              <p><span className="font-medium">Panier moyen:</span> {
                Math.round(parseInt(client.totalDepense) / client.totalCommandes)
              } DT</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h5 className="font-semibold mb-3" style={{ color: palette.indigo }}>
            Actions Rapides
          </h5>
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Envoyer Email
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Voir Commandes
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Promouvoir VIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: palette.navy }}>
            Gestion des Clients
          </h1>
          <p className="mt-2" style={{ color: palette.mauve }}>
            Gérez votre base de clients LayerLab
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Total Clients</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>{clients.length}</p>
            </div>
            <span className="text-2xl">👥</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Clients VIP</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>
                {clients.filter(c => c.statut === 'VIP').length}
              </p>
            </div>
            <span className="text-2xl">⭐</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Nouveaux ce mois</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>
                {clients.filter(c => c.statut === 'Nouveau').length}
              </p>
            </div>
            <span className="text-2xl">🆕</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Revenus Totaux</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>
                {clients.reduce((sum, c) => sum + parseInt(c.totalDepense), 0)} DT
              </p>
            </div>
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commandes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Dépensé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {getInitials(client.nom)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: palette.navy }}>
                          {client.nom}
                        </div>
                        <div className="text-sm" style={{ color: palette.mauve }}>
                          Inscrit le {client.dateInscription}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div style={{ color: palette.navy }}>{client.email}</div>
                      <div style={{ color: palette.mauve }}>{client.telephone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: palette.mauve }}>
                    {client.ville}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: palette.navy }}>
                    {client.totalCommandes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: palette.navy }}>
                    {client.totalDepense}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.statut)}`}>
                      {client.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Voir profil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <ClientDetails
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
};

export default ClientsManager;