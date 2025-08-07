import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  Package, 
  CreditCard, 
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const Dashboard = () => {
  // Obtém dados do localStorage para atualização dinâmica
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');

  const hoje = new Date().toISOString().split('T')[0];
  
  const stats = {
    agendamentosHoje: agendamentos.filter((a: any) => a.data === hoje || !a.data).length,
    clientesAtivos: clientes.filter((c: any) => c.status === 'ativo').length,
    produtosBaixoEstoque: produtos.filter((p: any) => p.status === 'baixo' || p.status === 'critico').length,
    receitaMes: 15420, // Pode ser calculado baseado em transações
    proximosAgendamentos: agendamentos
      .filter((a: any) => a.status === 'confirmado' || a.status === 'pendente')
      .slice(0, 3)
      .map((a: any) => ({
        id: a.id,
        cliente: a.cliente,
        servico: a.servico,
        horario: a.horario,
        status: a.status
      })),
    alertasEstoque: produtos
      .filter((p: any) => p.status === 'baixo' || p.status === 'critico')
      .slice(0, 3)
      .map((p: any) => ({
        produto: p.nome,
        quantidade: p.quantidade,
        minimo: p.estoqueMinimo
      }))
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      confirmado: { variant: 'default' as const, color: 'bg-success' },
      pendente: { variant: 'secondary' as const, color: 'bg-warning' },
      cancelado: { variant: 'destructive' as const, color: 'bg-destructive' }
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants]?.variant || 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua clínica</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agendamentos Hoje
            </CardTitle>
            <Calendar className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.agendamentosHoje}</div>
            <p className="text-xs text-success">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +2 desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Ativos
            </CardTitle>
            <Users className="w-5 h-5 text-secondary-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.clientesAtivos}</div>
            <p className="text-xs text-success">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12 este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alertas Estoque
            </CardTitle>
            <Package className="w-5 h-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.produtosBaixoEstoque}</div>
            <p className="text-xs text-warning">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Produtos baixo estoque
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita do Mês
            </CardTitle>
            <CreditCard className="w-5 h-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {stats.receitaMes.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-success">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +15% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Agendamentos */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.proximosAgendamentos.map((agendamento) => (
              <div 
                key={agendamento.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{agendamento.cliente}</h4>
                  <p className="text-sm text-muted-foreground">{agendamento.servico}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium text-foreground">{agendamento.horario}</p>
                  <StatusBadge status={agendamento.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertas de Estoque */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Alertas de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.alertasEstoque.map((alerta, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{alerta.produto}</h4>
                  <p className="text-sm text-muted-foreground">
                    Mínimo: {alerta.minimo} unidades
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-warning">{alerta.quantidade}</p>
                  <p className="text-xs text-warning">em estoque</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};