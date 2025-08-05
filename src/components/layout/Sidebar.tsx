import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Users, 
  Package, 
  CreditCard, 
  BarChart3, 
  Settings,
  Menu,
  Home,
  MessageCircle,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'estoque', label: 'Estoque', icon: Package },
  { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
  { id: 'marketing', label: 'Marketing', icon: MessageCircle },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export const Sidebar = ({ activeModule, onModuleChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-gradient-card border-r border-border/50 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-foreground">Beleza Clinic</h1>
                <p className="text-xs text-muted-foreground">Gestão Completa</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 h-8 w-8"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11 text-left font-medium transition-all",
                isActive && "bg-gradient-primary shadow-elegant",
                isCollapsed && "justify-center px-0"
              )}
              onClick={() => onModuleChange(item.id)}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-secondary-accent">A</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@beleza.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};