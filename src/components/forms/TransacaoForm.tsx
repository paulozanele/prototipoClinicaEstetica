import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface TransacaoFormProps {
  onClose: () => void;
  onSubmit: (transacao: any) => void;
}

export const TransacaoForm = ({ onClose, onSubmit }: TransacaoFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tipo: '',
    descricao: '',
    cliente: '',
    valor: '',
    formaPagamento: '',
    data: new Date().toISOString().split('T')[0],
    categoria: '',
    observacoes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo || !formData.descricao || !formData.valor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const novaTransacao = {
      id: Date.now(),
      ...formData,
      valor: parseFloat(formData.valor),
      status: 'pago'
    };

    onSubmit(novaTransacao);
    toast({
      title: "Sucesso",
      description: "Transação criada com sucesso!",
    });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo *</Label>
          <Select value={formData.tipo} onValueChange={(value) => handleChange('tipo', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor">Valor *</Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.valor}
            onChange={(e) => handleChange('valor', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição *</Label>
        <Input
          id="descricao"
          placeholder="Ex: Limpeza de pele, Compra de produtos..."
          value={formData.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cliente">Cliente/Fornecedor</Label>
        <Input
          id="cliente"
          placeholder="Nome do cliente ou fornecedor"
          value={formData.cliente}
          onChange={(e) => handleChange('cliente', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
          <Select value={formData.formaPagamento} onValueChange={(value) => handleChange('formaPagamento', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a forma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="cartao">Cartão</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="boleto">Boleto</SelectItem>
              <SelectItem value="transferencia">Transferência</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => handleChange('data', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria">Categoria</Label>
        <Select value={formData.categoria} onValueChange={(value) => handleChange('categoria', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="servico">Serviço</SelectItem>
            <SelectItem value="produto">Produto</SelectItem>
            <SelectItem value="estoque">Estoque</SelectItem>
            <SelectItem value="operacional">Operacional</SelectItem>
            <SelectItem value="pacote">Pacote</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          placeholder="Observações adicionais..."
          value={formData.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-gradient-primary">
          Salvar Transação
        </Button>
      </div>
    </form>
  );
};