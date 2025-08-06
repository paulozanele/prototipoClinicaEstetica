import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ProdutoFormProps {
  produto?: any;
  onSave: (produto: any) => void;
  onCancel: () => void;
}

export const ProdutoForm = ({ produto, onSave, onCancel }: ProdutoFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: produto?.nome || '',
    categoria: produto?.categoria || 'cosmético',
    sku: produto?.sku || '',
    quantidade: produto?.quantidade || 0,
    estoqueMinimo: produto?.estoqueMinimo || 1,
    precoCompra: produto?.precoCompra || 0,
    precoVenda: produto?.precoVenda || 0,
    fornecedor: produto?.fornecedor || '',
    lote: produto?.lote || '',
    validade: produto?.validade || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.sku || !formData.fornecedor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const status = formData.quantidade === 0 ? 'zerado' : 
                  formData.quantidade <= formData.estoqueMinimo ? 'baixo' : 'normal';

    const produtoData = {
      ...formData,
      id: produto?.id || Date.now(),
      quantidade: Number(formData.quantidade),
      estoqueMinimo: Number(formData.estoqueMinimo),
      precoCompra: Number(formData.precoCompra),
      precoVenda: Number(formData.precoVenda),
      ultimaMovimentacao: produto?.ultimaMovimentacao || new Date().toISOString().split('T')[0],
      status
    };

    onSave(produtoData);
    toast({
      title: "Sucesso",
      description: produto ? "Produto atualizado!" : "Produto criado!",
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {produto ? 'Editar Produto' : 'Novo Produto'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Ex: Ácido Hialurônico 2ml"
                required
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                placeholder="Ex: AH-2ML-001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="injetavel">Injetáveis</SelectItem>
                  <SelectItem value="cosmético">Cosméticos</SelectItem>
                  <SelectItem value="descartavel">Descartáveis</SelectItem>
                  <SelectItem value="equipamento">Equipamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Input
                id="fornecedor"
                value={formData.fornecedor}
                onChange={(e) => setFormData({...formData, fornecedor: e.target.value})}
                placeholder="Nome do fornecedor"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                min="0"
                value={formData.quantidade}
                onChange={(e) => setFormData({...formData, quantidade: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
              <Input
                id="estoqueMinimo"
                type="number"
                min="1"
                value={formData.estoqueMinimo}
                onChange={(e) => setFormData({...formData, estoqueMinimo: Number(e.target.value)})}
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="precoCompra">Preço de Compra (R$)</Label>
              <Input
                id="precoCompra"
                type="number"
                min="0"
                step="0.01"
                value={formData.precoCompra}
                onChange={(e) => setFormData({...formData, precoCompra: Number(e.target.value)})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="precoVenda">Preço de Venda (R$)</Label>
              <Input
                id="precoVenda"
                type="number"
                min="0"
                step="0.01"
                value={formData.precoVenda}
                onChange={(e) => setFormData({...formData, precoVenda: Number(e.target.value)})}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lote">Lote</Label>
              <Input
                id="lote"
                value={formData.lote}
                onChange={(e) => setFormData({...formData, lote: e.target.value})}
                placeholder="Ex: AH240115"
              />
            </div>
            <div>
              <Label htmlFor="validade">Validade</Label>
              <Input
                id="validade"
                type="date"
                value={formData.validade}
                onChange={(e) => setFormData({...formData, validade: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-gradient-primary">
              {produto ? 'Atualizar' : 'Salvar'}
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