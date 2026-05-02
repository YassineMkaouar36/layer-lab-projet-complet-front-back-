import { useState } from 'react';

const OrdersManager = () => {
  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  };

  const [orders, setOrders] = useState([
    {
      id: '#LL-001',
      client: 'Ahmed Ben Ali',
      email: 'ahmed@email.com',
      produits: ['Vases Japandi', 'lampe rétro'],
      montant: '140 DT',
      statut: 'En impression',
      date: '2024-01-20',
      adresse: 'Tunis, Tunisie'
    },
    {
      id: '#LL-002',
      client: 'Fatma Trabelsi',
      email: 'fatma@email.com',
      produits: ['Crystal Dragon'],
      montant: '18 DT',
      statut: 'Terminé',
      date: '2024-01-19',
      adresse: 'Sfax, Tunisie'
    },
    {
      id: '#LL-003',
      client: 'Mohamed Sassi',
      email: 'mohamed@email.com',
      produits: ['Gym Life Tag', 'Turbo Fan Key'],
      montant: '14 DT',
      statut: 'En attente',
      date: '2024-01-18',
      adresse: 'Sousse, Tunisie'
    },
    {
      id: '#LL-004',
      client: 'Leila Karray',
      email: 'leila@email.com',
      produits: ['Articulated Cat'],
      montant: '12 DT',
      statut: 'Livré',
      date: '2024-01-17',
      adresse: 'Monastir, Tunisie'
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'En attente', label: 'En attente' },
    { value: 'En impression', label: 'En impression' },
    { value: 'Terminé', label: 'Terminé' },
    { value: 'Livré', label: 'Livré' },
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

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, statut: newStatus } : order
    ));
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.statut === filterStatus);

  const OrderDetails = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: palette.navy }}>
            Détails de la Commande {order.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3" style={{ color: palette.indigo }}>
              Informations Client
            </h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nom:</span> {order.client}</p>
              <p><span className="font-medium">Email:</span> {order.email}</p>
              <p><span className="font-medium">Adresse:</span> {order.adresse}</p>
              <p><span className="font-medium">Date:</span> {order.date}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3" style={{ color: palette.indigo }}>
              Détails Commande
            </h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Montant:</span> {order.montant}</p>
              <p><span className="font-medium">Statut:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(order.statut)}`}>
                  {order.statut}
                </span>
              </p>
              <div>
                <span className="font-medium">Produits:</span>
                <ul className="mt-1 ml-4">
                  {order.produits.map((produit, index) => (
                    <li key={index} className="text-sm">• {produit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold mb-3" style={{ color: palette.indigo }}>
            Changer le Statut
          </h4>
          <div className="flex gap-2 flex-wrap">
            {['En attente', 'En impression', 'Terminé', 'Livré'].map(status => (
              <button
                key={status}
                onClick={() => updateOrderStatus(order.id, status)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  order.statut === status 
                    ? getStatusColor(status)
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
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
            Gestion des Commandes
          </h1>
          <p className="mt-2" style={{ color: palette.mauve }}>
            Suivez et gérez toutes les commandes LayerLab
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono text-sm font-medium" style={{ color: palette.indigo }}>
                      {order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium" style={{ color: palette.navy }}>
                        {order.client}
                      </div>
                      <div className="text-sm" style={{ color: palette.mauve }}>
                        {order.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {order.produits.slice(0, 2).map((produit, index) => (
                        <div key={index} style={{ color: palette.navy }}>
                          {produit}
                        </div>
                      ))}
                      {order.produits.length > 2 && (
                        <div className="text-xs" style={{ color: palette.mauve }}>
                          +{order.produits.length - 2} autres
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium" style={{ color: palette.navy }}>
                    {order.montant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.statut)}`}>
                      {order.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: palette.mauve }}>
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersManager;