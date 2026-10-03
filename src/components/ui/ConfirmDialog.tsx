import { X } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        {variant === 'danger' && (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-50">
            <X className="h-6 w-6 text-red-600" />
          </div>
        )}
        <p className="text-sm text-muted leading-relaxed pt-2">{message}</p>
      </div>
      <div className="mt-6 flex items-center justify-end gap-3">
        <button className="btn-ghost btn-sm" onClick={onClose}>
          {cancelLabel}
        </button>
        <button
          className={variant === 'danger' ? 'btn-danger btn-sm' : 'btn-primary btn-sm'}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
