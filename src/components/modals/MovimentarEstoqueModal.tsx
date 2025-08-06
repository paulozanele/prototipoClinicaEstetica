import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface MovimentarEstoqueModalProps {
  open: boolean;
  onClose: () => void;
  produto: any;
  onConfirm: (movimentacao: any) => void;
}

export const MovimentarEstoqueModal = ({ 
  open, 
  onClose, 
  produto, 
  onConfirm 
}: MovimentarEstoqueModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    quantidade: 0,
    motivo: '',
    observacoes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.quantidade <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero.",
        variant: "destructive"
      });
      return;
    }

    if (formData.tipo === 'saida' && formData.quantidade > produto.quantidade) {
      toast({
        title: "Erro",
        description: "Quantidade de saída não pode ser maior que o estoque atual.",
        variant: "destructive"
      });
      return;
    }

    onConfirm({
      ...formData,
      quantidade: Number(formData.quantidade),
      data: new Date().toISOString().split('T')[0],
      produtoId: produto.id
    });

    toast({
      title: "Sucesso",
      description: "Movimentação registrada com sucesso!",
    });

    setFormData({ tipo: 'entrada', quantidade: 0, motivo: '', observacoes: '' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Movimentar Estoque</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <h4 className="font-semibold">{produto?.nome}</h4>
          <p className="text-sm text-muted-foreground">
            Estoque atual: {produto?.quantidade} unidades
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tipo">Tipo de Movimentação</Label>
            <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              min="1"
              value={formData.quantidade}
              onChange={(e) => setFormData({...formData, quantidade: Number(e.target.value)})}
              placeholder="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="motivo">Motivo</Label>
            <Select value={formData.motivo} onValueChange={(value) => setFormData({...formData, motivo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {formData.tipo === 'entrada' ? (
                  <>
                    <SelectItem value="compra">Compra</SelectItem>
                    <SelectItem value="devolucao">Devolução</SelectItem>
                    <SelectItem value="ajuste_inventario">Ajuste de Inventário</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="uso_interno">Uso Interno</SelectItem>
                    <SelectItem value="perda">Perda</SelectItem>
                    <SelectItem value="vencimento">Vencimento</SelectItem>
                    <SelectItem value="ajuste_inventario">Ajuste de Inventário</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Informações adicionais..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-gradient-primary flex-1">
              Confirmar
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};