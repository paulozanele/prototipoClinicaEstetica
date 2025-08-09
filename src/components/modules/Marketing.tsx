import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Users, TrendingUp, Send, Plus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Campanha {
  id: string;
  nome: string;
  tipo: 'email' | 'whatsapp' | 'sms';
  status: 'ativa' | 'pausada' | 'finalizada';
  enviados: number;
  abertos: number;
  cliques: number;
  data: string;
}

export const Marketing = () => {
  const { toast } = useToast();
  const [campanhas, setCampanhas] = useState<Campanha[]>([
    {
      id: '1',
      nome: 'Promoção de Verão',
      tipo: 'email',
      status: 'ativa',
      enviados: 150,
      abertos: 89,
      cliques: 23,
      data: '2024-01-15'
    },
    {
      id: '2',
      nome: 'Lembrete de Consulta',
      tipo: 'whatsapp',
      status: 'ativa',
      enviados: 45,
      abertos: 42,
      cliques: 15,
      data: '2024-01-14'
    }
  ]);

  const [novaCampanha, setNovaCampanha] = useState({
    nome: '',
    tipo: 'email' as 'email' | 'whatsapp' | 'sms',
    mensagem: ''
  });

  const handleCriarCampanha = () => {
    if (!novaCampanha.nome || !novaCampanha.mensagem) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const nova: Campanha = {
      id: Date.now().toString(),
      nome: novaCampanha.nome,
      tipo: novaCampanha.tipo,
      status: 'ativa',
      enviados: 0,
      abertos: 0,
      cliques: 0,
      data: new Date().toISOString().split('T')[0]
    };

    setCampanhas([...campanhas, nova]);
    setNovaCampanha({ nome: '', tipo: 'email', mensagem: '' });
    
    toast({
      title: "Sucesso",
      description: "Campanha criada com sucesso!"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'pausada': return 'bg-yellow-100 text-yellow-800';
      case 'finalizada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
        <p className="text-muted-foreground">
          Gerencie suas campanhas de marketing e comunicação
        </p>
      </div>

      {/* Métricas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campanhas.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campanhas.reduce((acc, camp) => acc + camp.enviados, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campanhas.length > 0 
                ? Math.round((campanhas.reduce((acc, camp) => acc + camp.abertos, 0) / 
                   campanhas.reduce((acc, camp) => acc + camp.enviados, 1)) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campanhas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          <TabsTrigger value="nova">Nova Campanha</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="campanhas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas Ativas</CardTitle>
              <CardDescription>Gerencie suas campanhas de marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campanhas.map((campanha) => (
                  <div key={campanha.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getTipoIcon(campanha.tipo)}
                      <div>
                        <h3 className="font-medium">{campanha.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          {campanha.data} • {campanha.enviados} enviados
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm">
                          {campanha.abertos} abertos • {campanha.cliques} cliques
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((campanha.abertos / campanha.enviados) * 100)}% taxa de abertura
                        </p>
                      </div>
                      <Badge className={getStatusColor(campanha.status)}>
                        {campanha.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nova" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nova Campanha</CardTitle>
              <CardDescription>Crie uma nova campanha de marketing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome da Campanha</label>
                  <Input
                    placeholder="Ex: Promoção de Inverno"
                    value={novaCampanha.nome}
                    onChange={(e) => setNovaCampanha({...novaCampanha, nome: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Campanha</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={novaCampanha.tipo}
                    onChange={(e) => setNovaCampanha({...novaCampanha, tipo: e.target.value as 'email' | 'whatsapp' | 'sms'})}
                  >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mensagem</label>
                <Textarea
                  placeholder="Digite sua mensagem aqui..."
                  value={novaCampanha.mensagem}
                  onChange={(e) => setNovaCampanha({...novaCampanha, mensagem: e.target.value})}
                  rows={4}
                />
              </div>
              <Button onClick={handleCriarCampanha} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Criar Campanha
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Mensagem</CardTitle>
              <CardDescription>Templates prontos para suas campanhas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Lembrete de Consulta</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Olá [NOME], lembramos que você tem uma consulta agendada para [DATA] às [HORA]. Confirme sua presença."
                  </p>
                  <Button variant="outline" size="sm">Usar Template</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Promoção Especial</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Oferta especial para você! [DESCONTO]% de desconto em [PRODUTO/SERVIÇO]. Válido até [DATA]."
                  </p>
                  <Button variant="outline" size="sm">Usar Template</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Agradecimento</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Obrigado(a) por escolher nossos serviços, [NOME]! Sua satisfação é nossa prioridade."
                  </p>
                  <Button variant="outline" size="sm">Usar Template</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Aniversário</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Parabéns, [NOME]! Desejamos um feliz aniversário e preparamos uma surpresa especial para você!"
                  </p>
                  <Button variant="outline" size="sm">Usar Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};