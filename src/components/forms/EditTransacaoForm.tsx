import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface EditTransacaoFormProps {
  onClose: () => void;
  onSubmit: (transacao: any) => void;
  transacao: any;
}

export const EditTransacaoForm = ({ onClose, onSubmit, transacao }: EditTransacaoFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    tipo: transacao.tipo || 'receita',
    descricao: transacao.descricao || '',
    valor: transacao.valor || '',
    cliente: transacao.cliente || '',
    formaPagamento: transacao.formaPagamento || 'cartao',
    data: transacao.data || '',
    categoria: transacao.categoria || 'servico',
    status: transacao.status || 'pendente',
    observacoes: transacao.observacoes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.valor || !formData.cliente || !formData.data) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedTransacao = {
      ...transacao,
      ...formData,
      valor: parseFloat(formData.valor.toString().replace(',', '.')),
    };

    onSubmit(updatedTransacao);
    
    toast({
      title: "Transação atualizada",
      description: "A transação foi atualizada com sucesso!",
    });
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tipo">Tipo da Transação *</Label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
            required
          >
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>

        <div>
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
            required
          >
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="atrasado">Atrasado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="descricao">Descrição *</Label>
        <Input
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Ex: Limpeza de Pele"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="valor">Valor (R$) *</Label>
          <Input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={handleChange}
            placeholder="0,00"
            required
          />
        </div>

        <div>
          <Label htmlFor="cliente">Cliente/Fornecedor *</Label>
          <Input
            id="cliente"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            placeholder="Nome do cliente ou fornecedor"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
          <select
            id="formaPagamento"
            name="formaPagamento"
            value={formData.formaPagamento}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
            required
          >
            <option value="cartao">Cartão</option>
            <option value="pix">PIX</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="boleto">Boleto</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>

        <div>
          <Label htmlFor="data">Data *</Label>
          <Input
            id="data"
            name="data"
            type="date"
            value={formData.data}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
        >
          <option value="servico">Serviço</option>
          <option value="produto">Produto</option>
          <option value="estoque">Estoque</option>
          <option value="operacional">Operacional</option>
          <option value="marketing">Marketing</option>
          <option value="pacote">Pacote</option>
          <option value="outros">Outros</option>
        </select>
      </div>

      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          placeholder="Observações adicionais..."
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};