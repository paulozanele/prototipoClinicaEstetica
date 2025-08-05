import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Archive,
  BarChart3
} from 'lucide-react';

export const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');

  // Mock data - em produção viria do localStorage
  const produtos = [
    {
      id: 1,
      nome: 'Ácido Hialurônico 2ml',
      categoria: 'injetavel',
      sku: 'AH-2ML-001',
      quantidade: 2,
      estoqueMinimo: 5,
      precoCompra: 180,
      precoVenda: 320,
      fornecedor: 'MedEstética',
      lote: 'AH240115',
      validade: '2025-06-15',
      ultimaMovimentacao: '2024-01-10',
      status: 'baixo'
    },
    {
      id: 2,
      nome: 'Botox 100U',
      categoria: 'injetavel',
      sku: 'BTX-100U-001',
      quantidade: 1,
      estoqueMinimo: 3,
      precoCompra: 850,
      precoVenda: 1200,
      fornecedor: 'BioMed',
      lote: 'BTX240120',
      validade: '2025-12-20',
      ultimaMovimentacao: '2024-01-12',
      status: 'critico'
    },
    {
      id: 3,
      nome: 'Agulhas 30G (100 unid)',
      categoria: 'descartavel',
      sku: 'AG-30G-100',
      quantidade: 15,
      estoqueMinimo: 50,
      precoCompra: 25,
      precoVenda: 45,
      fornecedor: 'MediSupply',
      lote: 'AG240105',
      validade: '2026-01-05',
      ultimaMovimentacao: '2024-01-08',
      status: 'baixo'
    },
    {
      id: 4,
      nome: 'Sérum Vitamina C',
      categoria: 'cosmético',
      sku: 'VC-SER-30ML',
      quantidade: 25,
      estoqueMinimo: 10,
      precoCompra: 45,
      precoVenda: 89,
      fornecedor: 'CosméticaBella',
      lote: 'VC240118',
      validade: '2025-03-18',
      ultimaMovimentacao: '2024-01-14',
      status: 'normal'
    },
    {
      id: 5,
      nome: 'Luvas Descartáveis (caixa)',
      categoria: 'descartavel',
      sku: 'LUV-DESC-100',
      quantidade: 5,
      estoqueMinimo: 8,
      precoCompra: 18,
      precoVenda: 0,
      fornecedor: 'MediSupply',
      lote: 'LUV240112',
      validade: '2027-01-12',
      ultimaMovimentacao: '2024-01-13',
      status: 'baixo'
    }
  ];

  const categorias = [
    { value: 'todos', label: 'Todas' },
    { value: 'injetavel', label: 'Injetáveis' },
    { value: 'cosmético', label: 'Cosméticos' },
    { value: 'descartavel', label: 'Descartáveis' },
    { value: 'equipamento', label: 'Equipamentos' }
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      normal: { variant: 'default' as const, color: 'text-success', label: 'Normal' },
      baixo: { variant: 'secondary' as const, color: 'text-warning', label: 'Baixo' },
      critico: { variant: 'destructive' as const, color: 'text-destructive', label: 'Crítico' },
      zerado: { variant: 'destructive' as const, color: 'text-destructive', label: 'Zerado' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.normal;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const calcularMargemLucro = (precoCompra: number, precoVenda: number) => {
    if (precoVenda === 0) return 0;
    return ((precoVenda - precoCompra) / precoVenda * 100);
  };

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterCategoria === 'todos' || produto.categoria === filterCategoria;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalProdutos: produtos.length,
    produtosBaixoEstoque: produtos.filter(p => p.status === 'baixo' || p.status === 'critico').length,
    valorTotalEstoque: produtos.reduce((total, p) => total + (p.quantidade * p.precoCompra), 0),
    margemMediaLucro: produtos.reduce((total, p) => total + calcularMargemLucro(p.precoCompra, p.precoVenda), 0) / produtos.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Estoque</h1>
          <p className="text-muted-foreground">Gerencie produtos e insumos da clínica</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Entrada
          </Button>
          <Button className="bg-gradient-primary shadow-elegant">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalProdutos}</p>
                <p className="text-sm text-muted-foreground">Total de Produtos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.produtosBaixoEstoque}</p>
                <p className="text-sm text-muted-foreground">Baixo Estoque</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  R$ {stats.valorTotalEstoque.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-muted-foreground">Valor do Estoque</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-secondary-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.margemMediaLucro.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Margem Média</p>
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
                  placeholder="Buscar por nome, SKU ou fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Produtos List */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Produtos em Estoque
            <Badge variant="secondary" className="ml-2">
              {filteredProdutos.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredProdutos.map((produto) => (
            <div 
              key={produto.id}
              className="p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-secondary-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-lg">{produto.nome}</h3>
                        <StatusBadge status={produto.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">SKU: {produto.sku}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {categorias.find(c => c.value === produto.categoria)?.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Fornecedor:</span>
                      <p className="font-medium text-foreground">{produto.fornecedor}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lote:</span>
                      <p className="font-medium text-foreground">{produto.lote}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Validade:</span>
                      <p className="font-medium text-foreground">
                        {new Date(produto.validade).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Última movimentação:</span>
                      <p className="font-medium text-foreground">
                        {new Date(produto.ultimaMovimentacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:items-end gap-3">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-2 text-center lg:text-right">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{produto.quantidade}</p>
                      <p className="text-xs text-muted-foreground">
                        Em estoque (min: {produto.estoqueMinimo})
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {produto.precoVenda > 0 ? `R$ ${produto.precoVenda}` : 'Uso interno'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {produto.precoVenda > 0 && 
                          `Margem: ${calcularMargemLucro(produto.precoCompra, produto.precoVenda).toFixed(1)}%`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="w-3 h-3 mr-1" />
                      Movimentar
                    </Button>
                    <Button variant="outline" size="sm">
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
  );
};