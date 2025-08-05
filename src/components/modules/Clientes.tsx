import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Edit,
  Eye,
  Phone,
  Mail,
  Calendar,
  Star,
  MapPin
} from 'lucide-react';

export const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Mock data - em produção viria do localStorage
  const clientes = [
    {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '(11) 99999-9999',
      dataNascimento: '1985-03-15',
      ultimoAtendimento: '2024-01-15',
      totalGasto: 1580,
      status: 'ativo',
      endereco: 'São Paulo, SP',
      observacoes: 'Pele sensível, prefere horários matutinos',
      atendimentos: 12,
      categoria: 'VIP'
    },
    {
      id: 2,
      nome: 'Ana Costa',
      email: 'ana@email.com',
      telefone: '(11) 88888-8888',
      dataNascimento: '1990-07-22',
      ultimoAtendimento: '2024-01-10',
      totalGasto: 850,
      status: 'ativo',
      endereco: 'São Paulo, SP',
      observacoes: '',
      atendimentos: 6,
      categoria: 'Regular'
    },
    {
      id: 3,
      nome: 'Julia Santos',
      email: 'julia@email.com',
      telefone: '(11) 77777-7777',
      dataNascimento: '1988-12-08',
      ultimoAtendimento: '2023-11-20',
      totalGasto: 320,
      status: 'inativo',
      endereco: 'Guarulhos, SP',
      observacoes: 'Alergia a produtos com fragrância',
      atendimentos: 3,
      categoria: 'Novo'
    },
    {
      id: 4,
      nome: 'Roberto Lima',
      email: 'roberto@email.com',
      telefone: '(11) 66666-6666',
      dataNascimento: '1975-05-30',
      ultimoAtendimento: '2024-01-12',
      totalGasto: 2100,
      status: 'ativo',
      endereco: 'São Paulo, SP',
      observacoes: 'Cliente há 3 anos, muito pontual',
      atendimentos: 18,
      categoria: 'Premium'
    }
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      ativo: { variant: 'default' as const, color: 'bg-success' },
      inativo: { variant: 'secondary' as const, color: 'bg-muted' },
      bloqueado: { variant: 'destructive' as const, color: 'bg-destructive' }
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants]?.variant || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const CategoryBadge = ({ categoria }: { categoria: string }) => {
    const colors = {
      'Premium': 'bg-gradient-primary text-primary-foreground',
      'VIP': 'bg-gradient-secondary text-secondary-foreground',
      'Regular': 'bg-muted text-muted-foreground',
      'Novo': 'bg-accent text-accent-foreground'
    };
    
    return (
      <Badge className={colors[categoria as keyof typeof colors] || colors.Regular}>
        <Star className="w-3 h-3 mr-1" />
        {categoria}
      </Badge>
    );
  };

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    return idade;
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.telefone.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'todos' || cliente.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie o cadastro de clientes</p>
        </div>
        <Button className="bg-gradient-primary shadow-elegant">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{clientes.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {clientes.filter(c => c.status === 'ativo').length}
                </p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {clientes.filter(c => c.status === 'inativo').length}
                </p>
                <p className="text-sm text-muted-foreground">Inativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-secondary-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {clientes.filter(c => ['Premium', 'VIP'].includes(c.categoria)).length}
                </p>
                <p className="text-sm text-muted-foreground">VIPs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="todos">Todos</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
              </select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clientes List */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Lista de Clientes
            <Badge variant="secondary" className="ml-2">
              {filteredClientes.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredClientes.map((cliente) => (
            <div 
              key={cliente.id}
              className="p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-secondary-accent">
                        {cliente.nome.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{cliente.nome}</h3>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={cliente.status} />
                        <CategoryBadge categoria={cliente.categoria} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{cliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{cliente.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{calcularIdade(cliente.dataNascimento)} anos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{cliente.endereco}</span>
                    </div>
                  </div>

                  {cliente.observacoes && (
                    <div className="mt-3 p-2 bg-accent/50 rounded text-sm">
                      <span className="font-medium text-accent-foreground">Observações: </span>
                      <span className="text-accent-foreground">{cliente.observacoes}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col lg:items-end gap-3">
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 text-center lg:text-right">
                    <div>
                      <p className="text-lg font-bold text-foreground">R$ {cliente.totalGasto.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-muted-foreground">Total gasto</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{cliente.atendimentos}</p>
                      <p className="text-xs text-muted-foreground">Atendimentos</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Último atendimento</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(cliente.ultimoAtendimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};