import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (userData: { email: string; name: string; role: string }) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Usuários mockados para demonstração
  const mockUsers = [
    { email: 'admin@beleza.com', password: 'admin123', name: 'Administrador', role: 'admin' },
    { email: 'recepcao@beleza.com', password: 'recepcao123', name: 'Recepcionista', role: 'recepcao' },
    { email: 'dra.ana@beleza.com', password: 'ana123', name: 'Dra. Ana Silva', role: 'profissional' },
    { email: 'cliente@email.com', password: 'cliente123', name: 'Maria Silva', role: 'cliente' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        const userData = {
          email: user.email,
          name: user.name,
          role: user.role
        };
        
        // Salvar no localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a), ${user.name}`,
        });
        
        onLogin(userData);
      } else {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const fillDemoCredentials = (userType: string) => {
    const user = mockUsers.find(u => u.role === userType);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Doctor Photo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 z-10"></div>
        <img 
          src="/lovable-uploads/d04558c5-472c-4e1e-b872-fd3bfdcb720d.png" 
          alt="Dra. Nathália"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="w-full max-w-md space-y-6 relative z-20">
        {/* Logo/Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 p-2 bg-white rounded-2xl shadow-elegant">
            <img 
              src="/lovable-uploads/d1dbe018-dee2-47a7-8f96-fdfbfcd36857.png" 
              alt="Dra. Nathália Mendonça - Estética Avançada"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Dra. Nathália Mendonça</h1>
            <p className="text-muted-foreground">Estética Avançada</p>
            <p className="text-sm text-muted-foreground/80">Sistema de Gestão</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-gradient-card shadow-popup border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Fazer Login</CardTitle>
            <p className="text-muted-foreground">Entre com suas credenciais</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-border/50 focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-border/50 focus:border-primary"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-primary shadow-elegant text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="pt-4 border-t border-border/30">
              <p className="text-sm text-muted-foreground mb-3 text-center">Credenciais de demonstração:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('admin')}
                  className="text-xs"
                  disabled={isLoading}
                >
                  Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('recepcao')}
                  className="text-xs"
                  disabled={isLoading}
                >
                  Recepção
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('profissional')}
                  className="text-xs"
                  disabled={isLoading}
                >
                  Profissional
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('cliente')}
                  className="text-xs"
                  disabled={isLoading}
                >
                  Cliente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 Beleza Clinic. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};