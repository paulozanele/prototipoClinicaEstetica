import { useState } from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/modules/Dashboard';
import { Agendamentos } from '@/components/modules/Agendamentos';
import { Clientes } from '@/components/modules/Clientes';
import { Estoque } from '@/components/modules/Estoque';
import { Financeiro } from '@/components/modules/Financeiro';
import { Marketing } from '@/components/modules/Marketing';
import { Relatorios } from '@/components/modules/Relatorios';
import { Configuracoes } from '@/components/modules/Configuracoes';

const AdminPanel = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'agendamentos':
        return <Agendamentos />;
      case 'clientes':
        return <Clientes />;
      case 'estoque':
        return <Estoque />;
      case 'financeiro':
        return <Financeiro />;
      case 'marketing':
        return <Marketing />;
      case 'relatorios':
        return <Relatorios />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gradient-background flex">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderModule()}
        </div>
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminPanel />
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default Index;