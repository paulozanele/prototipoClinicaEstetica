import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface Relatorio {
  id: string;
  nome: string;
  tipo: 'financeiro' | 'clientes' | 'estoque' | 'agendamentos';
  periodo: string;
  status: 'pronto' | 'processando' | 'erro';
  data: string;
}

export const Relatorios = () => {
  const { toast } = useToast();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([
    {
      id: '1',
      nome: 'Relatório Financeiro - Janeiro',
      tipo: 'financeiro',
      periodo: '01/01/2024 - 31/01/2024',
      status: 'pronto',
      data: '2024-01-31'
    },
    {
      id: '2',
      nome: 'Clientes Ativos - Trimestre',
      tipo: 'clientes',
      periodo: '01/01/2024 - 31/03/2024',
      status: 'pronto',
      data: '2024-01-30'
    },
    {
      id: '3',
      nome: 'Controle de Estoque - Semanal',
      tipo: 'estoque',
      periodo: '22/01/2024 - 28/01/2024',
      status: 'processando',
      data: '2024-01-29'
    }
  ]);

  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    tipo: 'todos'
  });

  const handleGerarRelatorio = (tipo: string) => {
    console.log('Gerando relatório do tipo:', tipo); // Debug
    
    const novoRelatorio: Relatorio = {
      id: Date.now().toString(),
      nome: `Relatório ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} - ${new Date().toLocaleDateString()}`,
      tipo: tipo as 'financeiro' | 'clientes' | 'estoque' | 'agendamentos',
      periodo: `${filtros.dataInicio || '01/01/2024'} - ${filtros.dataFim || new Date().toLocaleDateString()}`,
      status: 'processando',
      data: new Date().toISOString().split('T')[0]
    };

    setRelatorios(prev => [novoRelatorio, ...prev]);
    
    toast({
      title: "Gerando relatório",
      description: `Processando relatório de ${tipo}...`
    });

    // Simular processamento e gerar relatório real
    setTimeout(() => {
      setRelatorios(prev => prev.map(rel => 
        rel.id === novoRelatorio.id 
          ? { ...rel, status: 'pronto' }
          : rel
      ));
      
      toast({
        title: "Relatório gerado",
        description: `Relatório de ${tipo} foi gerado com sucesso!`
      });
    }, 2000);
  };

  const handleDownload = (relatorio: Relatorio) => {
    try {
      const pdf = new jsPDF();
      
      // Configurações do PDF
      pdf.setFontSize(20);
      pdf.text('Clínica Dra. Nathália', 20, 30);
      
      pdf.setFontSize(16);
      pdf.text(relatorio.nome, 20, 50);
      
      pdf.setFontSize(12);
      pdf.text(`Período: ${relatorio.periodo}`, 20, 70);
      pdf.text(`Data de Geração: ${new Date().toLocaleDateString()}`, 20, 80);
      
      let yPosition = 100;
      
      // Obter dados baseado no tipo do relatório
      switch (relatorio.tipo) {
        case 'financeiro':
          pdf.text('RELATÓRIO FINANCEIRO', 20, yPosition);
          yPosition += 20;
          
          pdf.text('RESUMO EXECUTIVO:', 20, yPosition);
          yPosition += 15;
          pdf.text('• Total de Receitas: R$ 15.231,00', 25, yPosition);
          yPosition += 10;
          pdf.text('• Total de Despesas: R$ 8.450,00', 25, yPosition);
          yPosition += 10;
          pdf.text('• Lucro Líquido: R$ 6.781,00', 25, yPosition);
          yPosition += 10;
          pdf.text('• Crescimento: +20.1%', 25, yPosition);
          yPosition += 20;
          
          // Adicionar transações
          const transacoes = JSON.parse(localStorage.getItem('transacoes') || '[]');
          if (transacoes.length > 0) {
            pdf.text('TRANSAÇÕES:', 20, yPosition);
            yPosition += 15;
            
            transacoes.slice(0, 10).forEach((transacao: any, index: number) => {
              const texto = `${index + 1}. ${transacao.descricao} - R$ ${transacao.valor} (${transacao.tipo})`;
              pdf.text(texto, 25, yPosition);
              yPosition += 10;
              
              if (yPosition > 250) {
                pdf.addPage();
                yPosition = 30;
              }
            });
          }
          break;
          
        case 'clientes':
          pdf.text('RELATÓRIO DE CLIENTES', 20, yPosition);
          yPosition += 20;
          
          pdf.text('RESUMO EXECUTIVO:', 20, yPosition);
          yPosition += 15;
          pdf.text('• Total de Clientes: 42', 25, yPosition);
          yPosition += 10;
          pdf.text('• Novos Clientes: 12', 25, yPosition);
          yPosition += 10;
          pdf.text('• Clientes Ativos: 38', 25, yPosition);
          yPosition += 10;
          pdf.text('• Taxa de Retenção: 85%', 25, yPosition);
          yPosition += 20;
          
          const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
          if (clientes.length > 0) {
            pdf.text('LISTA DE CLIENTES:', 20, yPosition);
            yPosition += 15;
            
            clientes.slice(0, 15).forEach((cliente: any, index: number) => {
              const texto = `${index + 1}. ${cliente.nome} - ${cliente.telefone}`;
              pdf.text(texto, 25, yPosition);
              yPosition += 10;
              
              if (yPosition > 250) {
                pdf.addPage();
                yPosition = 30;
              }
            });
          }
          break;
          
        case 'estoque':
          pdf.text('RELATÓRIO DE ESTOQUE', 20, yPosition);
          yPosition += 20;
          
          pdf.text('RESUMO EXECUTIVO:', 20, yPosition);
          yPosition += 15;
          pdf.text('• Total de Produtos: 89', 25, yPosition);
          yPosition += 10;
          pdf.text('• Produtos com Baixo Estoque: 23', 25, yPosition);
          yPosition += 10;
          pdf.text('• Valor Total do Estoque: R$ 12.450,00', 25, yPosition);
          yPosition += 10;
          pdf.text('• Giro de Estoque: 3.2x', 25, yPosition);
          yPosition += 20;
          
          const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
          if (produtos.length > 0) {
            pdf.text('PRODUTOS EM ESTOQUE:', 20, yPosition);
            yPosition += 15;
            
            produtos.slice(0, 15).forEach((produto: any, index: number) => {
              const texto = `${index + 1}. ${produto.nome} - Qtd: ${produto.quantidade} - R$ ${produto.preco}`;
              pdf.text(texto, 25, yPosition);
              yPosition += 10;
              
              if (yPosition > 250) {
                pdf.addPage();
                yPosition = 30;
              }
            });
          }
          break;
          
        case 'agendamentos':
          pdf.text('RELATÓRIO DE AGENDAMENTOS', 20, yPosition);
          yPosition += 20;
          
          pdf.text('RESUMO EXECUTIVO:', 20, yPosition);
          yPosition += 15;
          pdf.text('• Total de Agendamentos: 128', 25, yPosition);
          yPosition += 10;
          pdf.text('• Consultas Realizadas: 115', 25, yPosition);
          yPosition += 10;
          pdf.text('• Cancelamentos: 13', 25, yPosition);
          yPosition += 10;
          pdf.text('• Taxa de Comparecimento: 89.8%', 25, yPosition);
          yPosition += 20;
          
          const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
          if (agendamentos.length > 0) {
            pdf.text('AGENDAMENTOS:', 20, yPosition);
            yPosition += 15;
            
            agendamentos.slice(0, 15).forEach((agendamento: any, index: number) => {
              const texto = `${index + 1}. ${agendamento.cliente} - ${agendamento.data} ${agendamento.horario}`;
              pdf.text(texto, 25, yPosition);
              yPosition += 10;
              
              if (yPosition > 250) {
                pdf.addPage();
                yPosition = 30;
              }
            });
          }
          break;
      }
      
      // Salvar o PDF
      const nomeArquivo = `${relatorio.nome.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      pdf.save(nomeArquivo);

      toast({
        title: "Download concluído",
        description: `Relatório ${relatorio.nome} baixado em PDF com sucesso!`
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Ocorreu um erro ao gerar o PDF.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pronto': return 'bg-green-100 text-green-800';
      case 'processando': return 'bg-yellow-100 text-yellow-800';
      case 'erro': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'financeiro': return <DollarSign className="w-4 h-4" />;
      case 'clientes': return <Users className="w-4 h-4" />;
      case 'estoque': return <Package className="w-4 h-4" />;
      case 'agendamentos': return <Calendar className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Gere e visualize relatórios detalhados do seu negócio
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.231</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +5.2% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline w-3 h-3 mr-1" />
              -2.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              23 produtos com estoque baixo
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gerar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gerar">Gerar Relatórios</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="personalizados">Personalizados</TabsTrigger>
        </TabsList>

        <TabsContent value="gerar" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Início</label>
                  <Input
                    type="date"
                    value={filtros.dataInicio}
                    onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Fim</label>
                  <Input
                    type="date"
                    value={filtros.dataFim}
                    onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Período</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filtros.tipo}
                    onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                  >
                    <option value="todos">Todos</option>
                    <option value="semanal">Esta Semana</option>
                    <option value="mensal">Este Mês</option>
                    <option value="trimestral">Este Trimestre</option>
                    <option value="anual">Este Ano</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Relatórios */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Relatório Financeiro
                </CardTitle>
                <CardDescription>
                  Receitas, despesas, lucros e análise financeira completa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleGerarRelatorio('financeiro')}
                  className="w-full"
                >
                  Gerar Relatório Financeiro
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Relatório de Clientes
                </CardTitle>
                <CardDescription>
                  Novos clientes, retenção, segmentação e análise comportamental
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleGerarRelatorio('clientes')}
                  className="w-full"
                >
                  Gerar Relatório de Clientes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Relatório de Estoque
                </CardTitle>
                <CardDescription>
                  Movimentações, produtos em falta, giro de estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleGerarRelatorio('estoque')}
                  className="w-full"
                >
                  Gerar Relatório de Estoque
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Relatório de Agendamentos
                </CardTitle>
                <CardDescription>
                  Consultas realizadas, cancelamentos, horários de pico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleGerarRelatorio('agendamentos')}
                  className="w-full"
                >
                  Gerar Relatório de Agendamentos
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Gerados</CardTitle>
              <CardDescription>Histórico de todos os relatórios gerados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatorios.map((relatorio) => (
                  <div key={relatorio.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getTipoIcon(relatorio.tipo)}
                      <div>
                        <h3 className="font-medium">{relatorio.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          {relatorio.periodo} • Gerado em {relatorio.data}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(relatorio.status)}>
                        {relatorio.status}
                      </Badge>
                      {relatorio.status === 'pronto' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(relatorio)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalizados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Personalizados</CardTitle>
              <CardDescription>
                Crie relatórios customizados com métricas específicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Em Desenvolvimento</h3>
                <p className="text-muted-foreground mb-4">
                  A funcionalidade de relatórios personalizados estará disponível em breve
                </p>
                <Button variant="outline">
                  Solicitar Acesso Antecipado
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};