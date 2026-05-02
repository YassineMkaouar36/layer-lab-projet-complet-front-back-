import { useState } from 'react';

const Settings = () => {
  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  };

  const [settings, setSettings] = useState({
    siteName: 'LayerLab',
    siteDescription: 'Impression 3D de qualité en Tunisie',
    currency: 'DT',
    taxRate: 19,
    shippingCost: 15,
    freeShippingThreshold: 200,
    emailNotifications: true,
    smsNotifications: false,
    autoApproveOrders: false,
    maintenanceMode: false,
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: '⚙️' },
    { id: 'payment', label: 'Paiement', icon: '💳' },
    { id: 'shipping', label: 'Livraison', icon: '🚚' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'advanced', label: 'Avancé', icon: '🔧' },
  ];

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: palette.indigo }}>
          Nom du site
        </label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => handleSettingChange('siteName', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: palette.indigo }}>
          Description du site
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: palette.indigo }}>
          Devise
        </label>
        <select
          value={settings.currency}
          onChange={(e) => handleSettingChange('currency', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="DT">Dinar Tunisien (DT)</option>
          <option value="EUR">Euro (€)</option>
          <option value="USD">Dollar US ($)</option>
        </select>
      </div>
    </div>
  );

  const PaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: palette.indigo }}>
          Taux de TVA (%)
        </label>
        <input
          type="number"
          value={settings.taxRate}
          onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3" style={{ color: palette.navy }}>
          Méthodes de paiement acceptées
        </h4>
        <div className="space-y-2">
          {['Carte bancaire', 'Virement bancaire', 'Paiement à la livraison', 'PayPal'].map(method => (
            <label key={method} className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">{method}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const ShippingSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: palette.indigo }}>
          Coût de livraison standard (DT)
        </label>
        <input
          type="number"
          value={settings.shippingCost}
          onChange={(e) => handleSettingChange('shippingCost', parseFloat(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: palette.indigo }}>
          Seuil de livraison gratuite (DT)
        </label>
        <input
          type="number"
          value={settings.freeShippingThreshold}
          onChange={(e) => handleSettingChange('freeShippingThreshold', parseFloat(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3" style={{ color: palette.navy }}>
          Zones de livraison
        </h4>
        <div className="space-y-2">
          {['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Autres gouvernorats'].map(zone => (
            <div key={zone} className="flex items-center justify-between">
              <span className="text-sm">{zone}</span>
              <input 
                type="number" 
                placeholder="Coût"
                className="w-20 p-1 border border-gray-300 rounded text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <div>
            <span className="font-medium" style={{ color: palette.navy }}>
              Notifications par email
            </span>
            <p className="text-sm" style={{ color: palette.mauve }}>
              Recevoir les notifications de commandes par email
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            className="rounded"
          />
        </label>
        
        <label className="flex items-center justify-between">
          <div>
            <span className="font-medium" style={{ color: palette.navy }}>
              Notifications par SMS
            </span>
            <p className="text-sm" style={{ color: palette.mauve }}>
              Recevoir les notifications urgentes par SMS
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
            className="rounded"
          />
        </label>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3" style={{ color: palette.navy }}>
          Types de notifications
        </h4>
        <div className="space-y-2">
          {[
            'Nouvelle commande',
            'Paiement reçu',
            'Impression terminée',
            'Commande expédiée',
            'Maintenance requise'
          ].map(type => (
            <label key={type} className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const AdvancedSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <div>
            <span className="font-medium" style={{ color: palette.navy }}>
              Approbation automatique des commandes
            </span>
            <p className="text-sm" style={{ color: palette.mauve }}>
              Approuver automatiquement les nouvelles commandes
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoApproveOrders}
            onChange={(e) => handleSettingChange('autoApproveOrders', e.target.checked)}
            className="rounded"
          />
        </label>
        
        <label className="flex items-center justify-between">
          <div>
            <span className="font-medium" style={{ color: palette.navy }}>
              Mode maintenance
            </span>
            <p className="text-sm" style={{ color: palette.mauve }}>
              Activer le mode maintenance du site
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
            className="rounded"
          />
        </label>
      </div>
      
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <h4 className="font-medium text-red-800 mb-2">Zone de danger</h4>
        <p className="text-sm text-red-600 mb-3">
          Ces actions sont irréversibles. Procédez avec prudence.
        </p>
        <div className="space-y-2">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
            Réinitialiser les paramètres
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm ml-2">
            Exporter les données
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return <GeneralSettings />;
      case 'payment': return <PaymentSettings />;
      case 'shipping': return <ShippingSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'advanced': return <AdvancedSettings />;
      default: return <GeneralSettings />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: palette.navy }}>
          Paramètres
        </h1>
        <p className="mt-2" style={{ color: palette.mauve }}>
          Configurez les paramètres de votre boutique LayerLab
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? palette.navy : 'transparent',
                    color: activeTab === tab.id ? 'white' : palette.indigo,
                  }}
                >
                  <span>{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {renderTabContent()}
            
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sauvegarder
              </button>
              <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;