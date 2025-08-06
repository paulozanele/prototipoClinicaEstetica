import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { AgendamentoForm } from '@/components/forms/AgendamentoForm';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search,
  Filter,
  Users,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const Agendamentos = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState<any>(null);
  const [deletingAgendamento, setDeletingAgendamento] = useState<any>(null);

  // Mock data inicial
  const initialAgendamentos = [
    {
      id: 1,
      cliente: 'Maria Silva',
      servico: 'Limpeza de Pele',
      profissional: 'Dra. Ana',
      horario: '09:00',
      duracao: 60,
      status: 'confirmado',
      valor: 180,
      telefone: '(11) 99999-9999'
    },
    {
      id: 2,
      cliente: 'Ana Costa',
      servico: 'Botox',
      profissional: 'Dra. Ana',
      horario: '10:30',
      duracao: 90,
      status: 'pendente',
      valor: 450,
      telefone: '(11) 88888-8888'
    },
    {
      id: 3,
      cliente: 'Julia Santos',
      servico: 'Peeling Químico',
      profissional: 'Dra. Carol',
      horario: '14:00',
      duracao: 45,
      status: 'confirmado',
      valor: 220,
      telefone: '(11) 77777-7777'
    },
    {
      id: 4,
      cliente: 'Roberto Lima',
      servico: 'Preenchimento',
      profissional: 'Dra. Ana',
      horario: '16:00',
      duracao: 75,
      status: 'cancelado',
      valor: 380,
      telefone: '(11) 66666-6666'
    }
  ];

  const [agendamentos, setAgendamentos] = useLocalStorage('agendamentos', initialAgendamentos);

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      confirmado: { variant: 'default' as const, icon: CheckCircle, color: 'text-success' },
      pendente: { variant: 'secondary' as const, icon: Clock, color: 'text-warning' },
      cancelado: { variant: 'destructive' as const, icon: XCircle, color: 'text-destructive' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pendente;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const filteredAgendamentos = agendamentos.filter(agendamento =>
    agendamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agendamento.servico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveAgendamento = (agendamentoData: any) => {
    if (editingAgendamento) {
      setAgendamentos(prev => prev.map(a => 
        a.id === editingAgendamento.id ? agendamentoData : a
      ));
    } else {
      setAgendamentos(prev => [...prev, agendamentoData]);
    }
    setShowForm(false);
    setEditingAgendamento(null);
  };

  const handleEditAgendamento = (agendamento: any) => {
    setEditingAgendamento(agendamento);
    setShowForm(true);
  };

  const handleDeleteAgendamento = (agendamento: any) => {
    setDeletingAgendamento(agendamento);
  };

  const confirmDelete = () => {
    if (deletingAgendamento) {
      setAgendamentos(prev => prev.filter(a => a.id !== deletingAgendamento.id));
      toast({
        title: "Sucesso",
        description: "Agendamento excluído com sucesso!",
      });
    }
    setDeletingAgendamento(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie os agendamentos da clínica</p>
        </div>
        <Button 
          className="bg-gradient-primary shadow-elegant"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por cliente ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agenda Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Horários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 12 }, (_, i) => {
                const hour = 8 + i;
                const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                return (
                  <div 
                    key={timeSlot}
                    className="text-sm text-muted-foreground py-2 border-b border-border/30 last:border-0"
                  >
                    {timeSlot}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Agendamentos List */}
        <div className="lg:col-span-3">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Agendamentos do Dia
                <Badge variant="secondary" className="ml-2">
                  {filteredAgendamentos.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredAgendamentos.map((agendamento) => (
                <div 
                  key={agendamento.id}
                  className="p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-secondary-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{agendamento.cliente}</h3>
                          <p className="text-sm text-muted-foreground">{agendamento.telefone}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Serviço:</span>
                          <p className="font-medium text-foreground">{agendamento.servico}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Profissional:</span>
                          <p className="font-medium text-foreground">{agendamento.profissional}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valor:</span>
                          <p className="font-medium text-foreground">R$ {agendamento.valor}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-3">
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-bold text-foreground">{agendamento.horario}</p>
                          <p className="text-xs text-muted-foreground">{agendamento.duracao}min</p>
                        </div>
                        <StatusBadge status={agendamento.status} />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditAgendamento(agendamento)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteAgendamento(agendamento)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal do Formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AgendamentoForm
            agendamento={editingAgendamento}
            onSave={handleSaveAgendamento}
            onCancel={() => {
              setShowForm(false);
              setEditingAgendamento(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        open={!!deletingAgendamento}
        onClose={() => setDeletingAgendamento(null)}
        onConfirm={confirmDelete}
        title="Excluir Agendamento"
        description={`Tem certeza que deseja excluir o agendamento de ${deletingAgendamento?.cliente}? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};