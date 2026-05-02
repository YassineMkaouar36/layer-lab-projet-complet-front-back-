import { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';
import Dashboard from '../components/admin/Dashboard';
import ProductsManager from '../components/admin/ProductsManager';
import OrdersManager from '../components/admin/OrdersManager';
import ClientsManager from '../components/admin/ClientsManager';
import FilesManager from '../components/admin/FilesManager';
import MachinesManager from '../components/admin/MachinesManager';
import Settings from '../components/admin/Settings';

function Admin() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsManager />;
      case 'orders':
        return <OrdersManager />;
      case 'clients':
        return <ClientsManager />;
      case 'files':
        return <FilesManager />;
      case 'machines':
        return <MachinesManager />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: palette.offwhite }}>
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Admin;
