import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ReciboModal } from '@/components/modals/ReciboModal';
import { 
  CreditCard, 
  Plus, 
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Calendar,
  Download,
  BarChart3,
  Trash2
} from 'lucide-react';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';

export const Financeiro = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriodo, setFilterPeriodo] = useState('mes');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [selectedTransacao, setSelectedTransacao] = useState<any>(null);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transacaoToDelete, setTransacaoToDelete] = useState<any>(null);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);
  const [showNovaTransacaoModal, setShowNovaTransacaoModal] = useState(false);

  // Mock data - em produção viria do localStorage
  const transacoes = [
    {
      id: 1,
      tipo: 'receita',
      descricao: 'Limpeza de Pele - Maria Silva',
      cliente: 'Maria Silva',
      valor: 180,
      formaPagamento: 'cartao',
      data: '2024-01-15',
      status: 'pago',
      categoria: 'servico',
      observacoes: 'Pagamento no débito'
    },
    {
      id: 2,
      tipo: 'receita',
      descricao: 'Botox - Ana Costa',
      cliente: 'Ana Costa',
      valor: 450,
      formaPagamento: 'pix',
      data: '2024-01-15',
      status: 'pago',
      categoria: 'servico',
      observacoes: ''
    },
    {
      id: 3,
      tipo: 'despesa',
      descricao: 'Compra Ácido Hialurônico',
      cliente: 'Fornecedor MedEstética',
      valor: 540,
      formaPagamento: 'boleto',
      data: '2024-01-14',
      status: 'pago',
      categoria: 'estoque',
      observacoes: '3 unidades de 2ml'
    },
    {
      id: 4,
      tipo: 'receita',
      descricao: 'Peeling Químico - Julia Santos',
      cliente: 'Julia Santos',
      valor: 220,
      formaPagamento: 'dinheiro',
      data: '2024-01-14',
      status: 'pago',
      categoria: 'servico',
      observacoes: ''
    },
    {
      id: 5,
      tipo: 'despesa',
      descricao: 'Aluguel do espaço',
      cliente: 'Imobiliária ABC',
      valor: 2500,
      formaPagamento: 'transferencia',
      data: '2024-01-10',
      status: 'pago',
      categoria: 'operacional',
      observacoes: 'Referente ao mês de janeiro'
    },
    {
      id: 6,
      tipo: 'receita',
      descricao: 'Pacote 5 sessões - Roberto Lima',
      cliente: 'Roberto Lima',
      valor: 1200,
      formaPagamento: 'cartao',
      data: '2024-01-12',
      status: 'pendente',
      categoria: 'pacote',
      observacoes: 'Parcelado em 3x'
    }
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      pago: { variant: 'default' as const, color: 'text-success', label: 'Pago' },
      pendente: { variant: 'secondary' as const, color: 'text-warning', label: 'Pendente' },
      atrasado: { variant: 'destructive' as const, color: 'text-destructive', label: 'Atrasado' },
      cancelado: { variant: 'destructive' as const, color: 'text-destructive', label: 'Cancelado' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pendente;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const TipoBadge = ({ tipo }: { tipo: string }) => {
    return (
      <Badge variant={tipo === 'receita' ? 'default' : 'destructive'}>
        {tipo === 'receita' ? 'Receita' : 'Despesa'}
      </Badge>
    );
  };

  const getFormaPagamentoLabel = (forma: string) => {
    const formas = {
      cartao: 'Cartão',
      pix: 'PIX',
      dinheiro: 'Dinheiro',
      boleto: 'Boleto',
      transferencia: 'Transferência'
    };
    return formas[forma as keyof typeof formas] || forma;
  };

  const filteredTransacoes = transacoes.filter(transacao => {
    const matchesSearch = transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transacao.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterTipo === 'todos' || transacao.tipo === filterTipo;
    
    return matchesSearch && matchesFilter;
  });

  // Cálculos financeiros
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita' && t.status === 'pago')
    .reduce((total, t) => total + t.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa' && t.status === 'pago')
    .reduce((total, t) => total + t.valor, 0);

  const receitasPendentes = transacoes
    .filter(t => t.tipo === 'receita' && t.status === 'pendente')
    .reduce((total, t) => total + t.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  const handleDeleteTransacao = () => {
    if (transacaoToDelete) {
      toast({
        title: "Transação removida",
        description: `A transação "${transacaoToDelete.descricao}" foi removida com sucesso.`,
      });
      setShowDeleteModal(false);
      setTransacaoToDelete(null);
    }
  };

  const handleRelatorio = () => {
    setShowRelatorioModal(true);
    toast({
      title: "Relatório Financeiro",
      description: "Gerando relatório das movimentações financeiras...",
    });
  };

  const handleNovaTransacao = () => {
    setShowNovaTransacaoModal(true);
    toast({
      title: "Nova Transação",
      description: "Abrindo formulário para nova transação...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Controle financeiro da clínica</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRelatorio}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Relatório
          </Button>
          <Button 
            className="bg-gradient-primary shadow-elegant"
            onClick={handleNovaTransacao}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalReceitas.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-muted-foreground">Total Receitas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalDespesas.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-muted-foreground">Total Despesas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${saldoLiquido >= 0 ? 'text-success' : 'text-destructive'}`}>
                  R$ {saldoLiquido.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-muted-foreground">Saldo Líquido</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  R$ {receitasPendentes.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-muted-foreground">A Receber</p>
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
                  placeholder="Buscar por descrição ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="todos">Todos</option>
                <option value="receita">Receitas</option>
                <option value="despesa">Despesas</option>
              </select>
              <Input
                type="date"
                className="w-auto"
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  setFilterPeriodo(selectedDate);
                  console.log('Filtrar por data:', selectedDate);
                }}
              />
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transações List */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Movimentações Financeiras
            <Badge variant="secondary" className="ml-2">
              {filteredTransacoes.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredTransacoes.map((transacao) => (
            <div 
              key={transacao.id}
              className="p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      transacao.tipo === 'receita' 
                        ? 'bg-success/20' 
                        : 'bg-destructive/20'
                    }`}>
                      {transacao.tipo === 'receita' ? (
                        <TrendingUp className="w-6 h-6 text-success" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-lg">{transacao.descricao}</h3>
                        <TipoBadge tipo={transacao.tipo} />
                        <StatusBadge status={transacao.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{transacao.cliente}</p>
                      {transacao.observacoes && (
                        <p className="text-sm text-muted-foreground mt-1 italic">{transacao.observacoes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {new Date(transacao.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {getFormaPagamentoLabel(transacao.formaPagamento)}
                      </span>
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {transacao.categoria}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:items-end gap-3">
                  <div className="text-center lg:text-right">
                    <p className={`text-2xl font-bold ${
                      transacao.tipo === 'receita' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transacao.categoria}
                    </p>
                  </div>
                  
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedTransacao(transacao);
                            setShowReciboModal(true);
                          }}
                        >
                          <Receipt className="w-3 h-3 mr-1" />
                          Recibo
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            setTransacaoToDelete(transacao);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remover
                        </Button>
                      </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modal de Recibo */}
      <ReciboModal
        open={showReciboModal}
        onClose={() => {
          setShowReciboModal(false);
          setSelectedTransacao(null);
        }}
        transacao={selectedTransacao}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTransacaoToDelete(null);
        }}
        onConfirm={handleDeleteTransacao}
        title="Remover Transação"
        description={`Tem certeza que deseja remover a transação "${transacaoToDelete?.descricao}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};