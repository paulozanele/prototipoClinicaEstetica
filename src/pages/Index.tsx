import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/modules/Dashboard';
import { Agendamentos } from '@/components/modules/Agendamentos';
import { Clientes } from '@/components/modules/Clientes';
import { Estoque } from '@/components/modules/Estoque';
import { Financeiro } from '@/components/modules/Financeiro';

const Index = () => {
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
        return <div className="p-8"><h1 className="text-2xl font-bold">Marketing em desenvolvimento...</h1></div>;
      case 'relatorios':
        return <div className="p-8"><h1 className="text-2xl font-bold">Relatórios em desenvolvimento...</h1></div>;
      case 'configuracoes':
        return <div className="p-8"><h1 className="text-2xl font-bold">Configurações em desenvolvimento...</h1></div>;
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

export default Index;