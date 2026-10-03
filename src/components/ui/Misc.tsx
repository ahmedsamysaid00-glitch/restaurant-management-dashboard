import { useState, type ReactNode } from 'react';
import { Modal } from './Modal';
export { Modal };
export { EmptyState, SearchEmptyState } from './EmptyState';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className = '' }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-cream-dark to-cream ${className}`}>
        <div className="flex flex-col items-center gap-2 text-muted">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 3.75h16.5a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25H3.75a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25z" />
          </svg>
          <span className="text-xs font-medium">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

export function ImageViewerModal({ open, onClose, src, alt }: { open: boolean; onClose: () => void; src: string; alt: string }) {
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="flex justify-center">
        <img src={src} alt={alt} className="max-h-[70vh] rounded-xl object-contain" />
      </div>
    </Modal>
  );
}

export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-espresso/15 border-t-caramel"></div>
    </div>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-espresso">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
