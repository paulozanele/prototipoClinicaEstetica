import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X } from 'lucide-react';

interface ReciboModalProps {
  open: boolean;
  onClose: () => void;
  transacao?: any;
  onAttach?: (transacaoId: number, fileUrl: string) => void;
  existingReceipt?: string;
}

export const ReciboModal = ({ open, onClose, transacao, onAttach, existingReceipt }: ReciboModalProps) => {
  const { toast } = useToast();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Máximo 5MB.",
          variant: "destructive"
        });
        return;
      }

      setArquivo(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview('');
      }
    }
  };

  const handleSave = () => {
    if (!arquivo) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo para anexar.",
        variant: "destructive"
      });
      return;
    }

    // Criar URL do arquivo para armazenamento local
    const fileUrl = URL.createObjectURL(arquivo);
    
    // Chamar callback para anexar o recibo
    if (transacao && onAttach) {
      onAttach(transacao.id, fileUrl);
    }
    
    toast({
      title: "Sucesso",
      description: "Recibo anexado com sucesso!",
    });

    // Reset state and close
    setArquivo(null);
    setPreview('');
    onClose();
  };

  const removeFile = () => {
    setArquivo(null);
    setPreview('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Anexar Recibo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {transacao && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Transação:</p>
              <p className="font-medium">{transacao.descricao}</p>
              <p className="text-sm text-muted-foreground">
                R$ {transacao.valor?.toLocaleString('pt-BR')}
              </p>
            </div>
          )}

          {/* Mostrar recibo existente se houver */}
          {existingReceipt && (
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm text-success font-medium mb-2">Recibo já anexado:</p>
              <img 
                src={existingReceipt} 
                alt="Recibo anexado" 
                className="max-w-full h-32 object-contain rounded border cursor-pointer"
                onClick={() => window.open(existingReceipt, '_blank')}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Clique na imagem para visualizar em tamanho completo
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="recibo">Arquivo do Recibo</Label>
            <div className="mt-2">
              {!arquivo ? (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Clique para selecionar o recibo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, JPG, PNG até 5MB
                  </p>
                  <Input
                    id="recibo"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="recibo" 
                    className="cursor-pointer inline-block mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                  >
                    Selecionar Arquivo
                  </Label>
                </div>
              ) : (
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{arquivo.name}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={removeFile}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {preview && (
                    <div className="mt-2">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="max-w-full h-32 object-contain rounded border"
                      />
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Anexar Recibo
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};