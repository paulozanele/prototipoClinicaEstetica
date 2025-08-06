import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AgendamentoFormProps {
  agendamento?: any;
  onSave: (agendamento: any) => void;
  onCancel: () => void;
}

export const AgendamentoForm = ({ agendamento, onSave, onCancel }: AgendamentoFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    cliente: agendamento?.cliente || '',
    servico: agendamento?.servico || '',
    profissional: agendamento?.profissional || 'Dra. Ana',
    horario: agendamento?.horario || '',
    duracao: agendamento?.duracao || 60,
    valor: agendamento?.valor || 0,
    telefone: agendamento?.telefone || '',
    observacoes: agendamento?.observacoes || '',
    status: agendamento?.status || 'pendente'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente || !formData.servico || !formData.horario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const agendamentoData = {
      ...formData,
      id: agendamento?.id || Date.now(),
      duracao: Number(formData.duracao),
      valor: Number(formData.valor)
    };

    onSave(agendamentoData);
    toast({
      title: "Sucesso",
      description: agendamento ? "Agendamento atualizado!" : "Agendamento criado!",
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {agendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente">Cliente *</Label>
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                placeholder="Nome do cliente"
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="servico">Serviço *</Label>
              <Select value={formData.servico} onValueChange={(value) => setFormData({...formData, servico: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Limpeza de Pele">Limpeza de Pele</SelectItem>
                  <SelectItem value="Botox">Botox</SelectItem>
                  <SelectItem value="Preenchimento">Preenchimento</SelectItem>
                  <SelectItem value="Peeling Químico">Peeling Químico</SelectItem>
                  <SelectItem value="Microagulhamento">Microagulhamento</SelectItem>
                  <SelectItem value="Consultoria">Consultoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="profissional">Profissional</Label>
              <Select value={formData.profissional} onValueChange={(value) => setFormData({...formData, profissional: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dra. Ana">Dra. Ana</SelectItem>
                  <SelectItem value="Dra. Carol">Dra. Carol</SelectItem>
                  <SelectItem value="Dra. Maria">Dra. Maria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="horario">Horário *</Label>
              <Input
                id="horario"
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({...formData, horario: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="duracao">Duração (min)</Label>
              <Input
                id="duracao"
                type="number"
                value={formData.duracao}
                onChange={(e) => setFormData({...formData, duracao: Number(e.target.value)})}
                placeholder="60"
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: Number(e.target.value)})}
                placeholder="150"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-gradient-primary">
              {agendamento ? 'Atualizar' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};