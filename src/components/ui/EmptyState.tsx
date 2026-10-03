import type { ReactNode } from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-espresso">{title}</h3>
      {message && <p className="mt-1.5 text-sm text-muted max-w-sm">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SearchEmptyState({ message }: { message: string }) {
  return (
    <EmptyState
      icon={<Search className="h-7 w-7" />}
      title="No results found"
      message={message}
    />
  );
}
