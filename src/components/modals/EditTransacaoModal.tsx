import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditTransacaoForm } from "@/components/forms/EditTransacaoForm";

interface EditTransacaoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transacao: any) => void;
  transacao: any;
}

export const EditTransacaoModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  transacao 
}: EditTransacaoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Editar Transação</DialogTitle>
        </DialogHeader>
        <EditTransacaoForm 
          onClose={onClose} 
          onSubmit={onSubmit} 
          transacao={transacao}
        />
      </DialogContent>
    </Dialog>
  );
};