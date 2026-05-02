import { useState } from 'react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
    Parchment:'#eef0eb'
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Produits 3D', icon: '🎯' },
    { id: 'orders', label: 'Commandes', icon: '📦' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'files', label: 'Fichiers STL/3MF', icon: '📁' },
    { id: 'machines', label: 'Machines', icon: '🖨️' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' },
  ];

  return (
    <div 
      className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      style={{ backgroundColor: palette.Parchment  }}
    >
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src="/LL b.png" alt="LayerLab" className="w-8 h-8" />
            <span className="font-bold text-lg" style={{ color: palette.navy }}>
              LayerLab Admin
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'text-white'
                    : 'hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: activeSection === item.id ? palette.navy : 'transparent',
                  color: activeSection === item.id ? 'white' : palette.indigo,
                }}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;