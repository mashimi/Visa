import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="modal-overlay absolute inset-0"
        onClick={onClose}
      />
      <div className="absolute inset-4 sm:inset-8 md:inset-16 lg:inset-24 flex items-center justify-center">
        <div className={cn('glass-card rounded-2xl w-full max-w-3xl max-h-full overflow-hidden flex flex-col', className)}>
          {children}
        </div>
      </div>
    </div>
  );
}