import StatCard from './StatCard';

const Dashboard = () => {
  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  };

  const stats = [
    { title: 'Commandes Totales', value: '247', change: '+12%', icon: '📦', color: 'blue' },
    { title: 'Revenus du Mois', value: '3,240 DT', change: '+8%', icon: '💰', color: 'green' },
    { title: 'Impressions en Cours', value: '18', change: '+3', icon: '/other/3d printer', color: 'purple' },
    { title: 'Produits Populaires', value: '42', change: '+5%', icon: '⭐', color: 'orange' },
  ];

  const recentOrders = [
    { id: '#LL-001', client: 'Ahmed Ben Ali', produit: 'Vases Japandi', statut: 'En impression', montant: '60 DT' },
    { id: '#LL-002', client: 'Fatma Trabelsi', produit: 'Crystal Dragon', statut: 'Terminé', montant: '18 DT' },
    { id: '#LL-003', client: 'Mohamed Sassi', produit: 'lampe rétro', statut: 'En attente', montant: '80 DT' },
    { id: '#LL-004', client: 'Leila Karray', produit: 'Articulated Cat', statut: 'Livré', montant: '12 DT' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'En impression': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Livré': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: palette.navy }}>
          Dashboard
        </h1>
        <p className="mt-2" style={{ color: palette.mauve }}>
          Vue d'ensemble de votre activité LayerLab
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: palette.navy }}>
              Commandes Récentes
            </h2>
            <button className="text-sm font-medium" style={{ color: palette.indigo }}>
              Voir tout →
            </button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm" style={{ color: palette.indigo }}>
                      {order.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.statut)}`}>
                      {order.statut}
                    </span>
                  </div>
                  <p className="font-medium mt-1" style={{ color: palette.navy }}>
                    {order.client}
                  </p>
                  <p className="text-sm" style={{ color: palette.mauve }}>
                    {order.produit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={{ color: palette.navy }}>
                    {order.montant}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6" style={{ color: palette.navy }}>
            Actions Rapides
          </h2>
          
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
              <span className="text-xl">➕</span>
              <div>
                <p className="font-medium" style={{ color: palette.navy }}>
                  Ajouter un Produit
                </p>
                <p className="text-sm" style={{ color: palette.mauve }}>
                  Créer un nouveau produit 3D
                </p>
              </div>
            </button>
            
            <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
              <span className="text-xl">📤</span>
              <div>
                <p className="font-medium" style={{ color: palette.navy }}>
                  Upload Fichier STL
                </p>
                <p className="text-sm" style={{ color: palette.mauve }}>
                  Importer un nouveau modèle 3D
                </p>
              </div>
            </button>
            
            <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
              <img src="/other/3d printer" alt="3D Printer" className="text-xl w-6 h-6" />
              <div>
                <p className="font-medium" style={{ color: palette.navy }}>
                  Gérer les Machines
                </p>
                <p className="text-sm" style={{ color: palette.mauve }}>
                  Statut des imprimantes 3D
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;