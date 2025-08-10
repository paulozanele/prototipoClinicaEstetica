import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Save,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Configuracoes = () => {
  const { toast } = useToast();
  
  const [configuracoes, setConfiguracoes] = useState({
    // Perfil
    nome: 'Dra. Nathália',
    email: 'dra.nathalia@email.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123',
    bio: 'Profissional dedicada ao bem-estar dos pacientes',
    
    // Notificações
    emailNotificacoes: true,
    smsNotificacoes: false,
    whatsappNotificacoes: true,
    lembreteAgendamentos: true,
    alertasEstoque: true,
    
    // Sistema
    tema: 'light',
    idioma: 'pt-br',
    timezone: 'America/Sao_Paulo',
    moedaPadrao: 'BRL',
    formatoData: 'DD/MM/YYYY',
    
    // Segurança
    autenticacaoDoisFatores: false,
    tempoSessao: 60,
    backupAutomatico: true,
    
    // Empresa
    nomeEmpresa: 'Clínica Dra. Nathália',
    cnpj: '12.345.678/0001-90',
    telefoneEmpresa: '(11) 3333-4444',
    enderecoEmpresa: 'Av. Principal, 456',
    horarioFuncionamento: '08:00 - 18:00'
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [arquivoImport, setArquivoImport] = useState<File | null>(null);

  const handleSalvar = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso!"
    });
  };

  const handleExportarDados = () => {
    try {
      // Coleta todos os dados do localStorage
      const dadosParaExportar = {
        configuracoes,
        transacoes: JSON.parse(localStorage.getItem('transacoes') || '[]'),
        clientes: JSON.parse(localStorage.getItem('clientes') || '[]'),
        produtos: JSON.parse(localStorage.getItem('produtos') || '[]'),
        agendamentos: JSON.parse(localStorage.getItem('agendamentos') || '[]'),
        dataExportacao: new Date().toISOString()
      };

      // Cria o arquivo para download
      const dataStr = JSON.stringify(dadosParaExportar, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-dados-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Dados exportados",
        description: "Backup dos dados baixado com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados.",
        variant: "destructive"
      });
    }
  };

  const handleSelecionarArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (arquivo) {
      setArquivoImport(arquivo);
    }
  };

  const handleImportarDados = () => {
    if (!arquivoImport) {
      // Abre o seletor de arquivos
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const arquivo = (e.target as HTMLInputElement).files?.[0];
        if (arquivo) {
          processarArquivoImport(arquivo);
        }
      };
      input.click();
    } else {
      processarArquivoImport(arquivoImport);
    }
  };

  const processarArquivoImport = (arquivo: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dadosImportados = JSON.parse(e.target?.result as string);
        
        // Valida a estrutura dos dados
        if (dadosImportados.configuracoes) {
          setConfiguracoes(dadosImportados.configuracoes);
        }
        if (dadosImportados.transacoes) {
          localStorage.setItem('transacoes', JSON.stringify(dadosImportados.transacoes));
        }
        if (dadosImportados.clientes) {
          localStorage.setItem('clientes', JSON.stringify(dadosImportados.clientes));
        }
        if (dadosImportados.produtos) {
          localStorage.setItem('produtos', JSON.stringify(dadosImportados.produtos));
        }
        if (dadosImportados.agendamentos) {
          localStorage.setItem('agendamentos', JSON.stringify(dadosImportados.agendamentos));
        }

        toast({
          title: "Dados importados",
          description: "Dados restaurados com sucesso! Recarregue a página para ver as alterações."
        });
        setArquivoImport(null);
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Arquivo inválido ou corrompido.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(arquivo);
  };

  const handleResetarDados = () => {
    if (confirm('Esta ação irá deletar todos os dados. Tem certeza?')) {
      localStorage.clear();
      setConfiguracoes({
        nome: 'Dra. Nathália',
        email: 'dra.nathalia@email.com',
        telefone: '(11) 99999-9999',
        endereco: 'Rua das Flores, 123',
        bio: 'Profissional dedicada ao bem-estar dos pacientes',
        emailNotificacoes: true,
        smsNotificacoes: false,
        whatsappNotificacoes: true,
        lembreteAgendamentos: true,
        alertasEstoque: true,
        tema: 'light',
        idioma: 'pt-br',
        timezone: 'America/Sao_Paulo',
        moedaPadrao: 'BRL',
        formatoData: 'DD/MM/YYYY',
        autenticacaoDoisFatores: false,
        tempoSessao: 60,
        backupAutomatico: true,
        nomeEmpresa: 'Clínica Dra. Nathália',
        cnpj: '12.345.678/0001-90',
        telefoneEmpresa: '(11) 3333-4444',
        enderecoEmpresa: 'Av. Principal, 456',
        horarioFuncionamento: '08:00 - 18:00'
      });

      toast({
        title: "Dados resetados",
        description: "Todas as configurações foram restauradas para o padrão.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema e sua conta
        </p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="dados">Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e profissionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input
                    value={configuracoes.nome}
                    onChange={(e) => setConfiguracoes({...configuracoes, nome: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={configuracoes.email}
                    onChange={(e) => setConfiguracoes({...configuracoes, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    value={configuracoes.telefone}
                    onChange={(e) => setConfiguracoes({...configuracoes, telefone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Endereço</label>
                  <Input
                    value={configuracoes.endereco}
                    onChange={(e) => setConfiguracoes({...configuracoes, endereco: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Biografia Profissional</label>
                <Textarea
                  placeholder="Descreva sua experiência e especialidades..."
                  value={configuracoes.bio}
                  onChange={(e) => setConfiguracoes({...configuracoes, bio: e.target.value})}
                  rows={3}
                />
              </div>
              <Button onClick={handleSalvar}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como e quando você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações por Email</h4>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações importantes no seu email
                    </p>
                  </div>
                  <Switch
                    checked={configuracoes.emailNotificacoes}
                    onCheckedChange={(checked) => 
                      setConfiguracoes({...configuracoes, emailNotificacoes: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações por SMS</h4>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas urgentes via SMS
                    </p>
                  </div>
                  <Switch
                    checked={configuracoes.smsNotificacoes}
                    onCheckedChange={(checked) => 
                      setConfiguracoes({...configuracoes, smsNotificacoes: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações via WhatsApp Business
                    </p>
                  </div>
                  <Switch
                    checked={configuracoes.whatsappNotificacoes}
                    onCheckedChange={(checked) => 
                      setConfiguracoes({...configuracoes, whatsappNotificacoes: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Lembretes de Agendamentos</h4>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre consultas próximas
                    </p>
                  </div>
                  <Switch
                    checked={configuracoes.lembreteAgendamentos}
                    onCheckedChange={(checked) => 
                      setConfiguracoes({...configuracoes, lembreteAgendamentos: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Estoque</h4>
                    <p className="text-sm text-muted-foreground">
                      Notificações quando produtos estiverem em falta
                    </p>
                  </div>
                  <Switch
                    checked={configuracoes.alertasEstoque}
                    onCheckedChange={(checked) => 
                      setConfiguracoes({...configuracoes, alertasEstoque: checked})
                    }
                  />
                </div>
              </div>
              
              <Button onClick={handleSalvar}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>
                Personalize a aparência e comportamento do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tema</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={configuracoes.tema}
                    onChange={(e) => setConfiguracoes({...configuracoes, tema: e.target.value})}
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Idioma</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={configuracoes.idioma}
                    onChange={(e) => setConfiguracoes({...configuracoes, idioma: e.target.value})}
                  >
                    <option value="pt-br">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fuso Horário</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={configuracoes.timezone}
                    onChange={(e) => setConfiguracoes({...configuracoes, timezone: e.target.value})}
                  >
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                    <option value="Europe/London">London (GMT+0)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Moeda Padrão</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={configuracoes.moedaPadrao}
                    onChange={(e) => setConfiguracoes({...configuracoes, moedaPadrao: e.target.value})}
                  >
                    <option value="BRL">Real (R$)</option>
                    <option value="USD">Dólar (US$)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Formato de Data</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={configuracoes.formatoData}
                    onChange={(e) => setConfiguracoes({...configuracoes, formatoData: e.target.value})}
                  >
                    <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                    <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                    <option value="YYYY-MM-DD">AAAA-MM-DD</option>
                  </select>
                </div>
              </div>
              
              <Button onClick={handleSalvar}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Segurança da Conta
              </CardTitle>
              <CardDescription>
                Gerencie a segurança e privacidade da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nova Senha</label>
                  <div className="relative">
                    <Input
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                    >
                      {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Switch
                    checked={configuracoes.autenticacaoDoisFatores}
                    onCheckedChange={(checked) => 
                      setConfiguracoes({...configuracoes, autenticacaoDoisFatores: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tempo de Sessão (minutos)</label>
                  <Input
                    type="number"
                    value={configuracoes.tempoSessao}
                    onChange={(e) => setConfiguracoes({
                      ...configuracoes, 
                      tempoSessao: parseInt(e.target.value) || 60
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tempo antes do logout automático por inatividade
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Backup Automático</h4>
                    <p className="text-sm text-muted-foreground">
                      Backup automático dos dados a cada 24 horas
                    </p>
                  </div>
                  <Switch
                    checked={configuracoes.backupAutomatico}
                    onCheckedChange={(checked) => 
                      setConfiguracoes({...configuracoes, backupAutomatico: checked})
                    }
                  />
                </div>
              </div>
              
              <Button onClick={handleSalvar}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações de Segurança
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empresa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Configure as informações da sua clínica ou consultório
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome da Empresa</label>
                  <Input
                    value={configuracoes.nomeEmpresa}
                    onChange={(e) => setConfiguracoes({...configuracoes, nomeEmpresa: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CNPJ</label>
                  <Input
                    value={configuracoes.cnpj}
                    onChange={(e) => setConfiguracoes({...configuracoes, cnpj: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone Comercial</label>
                  <Input
                    value={configuracoes.telefoneEmpresa}
                    onChange={(e) => setConfiguracoes({...configuracoes, telefoneEmpresa: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Horário de Funcionamento</label>
                  <Input
                    value={configuracoes.horarioFuncionamento}
                    onChange={(e) => setConfiguracoes({...configuracoes, horarioFuncionamento: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Endereço Comercial</label>
                <Textarea
                  placeholder="Endereço completo da empresa..."
                  value={configuracoes.enderecoEmpresa}
                  onChange={(e) => setConfiguracoes({...configuracoes, enderecoEmpresa: e.target.value})}
                  rows={2}
                />
              </div>
              <Button onClick={handleSalvar}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Informações da Empresa
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Gerenciamento de Dados
              </CardTitle>
              <CardDescription>
                Importe, exporte e gerencie seus dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <Download className="w-8 h-8 mx-auto text-muted-foreground" />
                      <h3 className="font-medium">Exportar Dados</h3>
                      <p className="text-sm text-muted-foreground">
                        Baixe todos os seus dados em formato JSON
                      </p>
                      <Button onClick={handleExportarDados} className="w-full">
                        Exportar Dados
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <h3 className="font-medium">Importar Dados</h3>
                      <p className="text-sm text-muted-foreground">
                        Restaure dados de um backup anterior
                      </p>
                      <Button onClick={handleImportarDados} variant="outline" className="w-full">
                        Importar Dados
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Separator />
              
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Trash2 className="w-8 h-8 mx-auto text-destructive" />
                    <h3 className="font-medium text-destructive">Zona de Perigo</h3>
                    <p className="text-sm text-muted-foreground">
                      Estas ações são irreversíveis. Tenha certeza antes de prosseguir.
                    </p>
                    <Button 
                      onClick={handleResetarDados} 
                      variant="destructive" 
                      className="w-full"
                    >
                      Resetar Todos os Dados
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};