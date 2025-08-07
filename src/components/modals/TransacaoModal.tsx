import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransacaoForm } from "@/components/forms/TransacaoForm";

interface TransacaoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transacao: any) => void;
}

export const TransacaoModal = ({ open, onClose, onSubmit }: TransacaoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nova Transação</DialogTitle>
        </DialogHeader>
        <TransacaoForm onClose={onClose} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};