import type { OrderStatus } from '@/types';
import { Clock, CheckCircle, ChefHat, Coffee, PackageCheck, XCircle } from 'lucide-react';
import type { ComponentType } from 'react';

const statusConfig: Record<OrderStatus, { icon: ComponentType<{ className?: string }>; classes: string }> = {
  Pending: { icon: Clock, classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  Confirmed: { icon: CheckCircle, classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  Preparing: { icon: ChefHat, classes: 'bg-orange-50 text-orange-700 border-orange-200' },
  Ready: { icon: Coffee, classes: 'bg-green-50 text-green-700 border-green-200' },
  Completed: { icon: PackageCheck, classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Cancelled: { icon: XCircle, classes: 'bg-red-50 text-red-700 border-red-200' },
};

export function StatusBadge({ status, size = 'md' }: { status: OrderStatus; size?: 'sm' | 'md' }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';
  return (
    <span className={`badge-base border ${config.classes} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {status}
    </span>
  );
}

export const allOrderStatuses: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Preparing', 'Cancelled'],
  Preparing: ['Ready', 'Cancelled'],
  Ready: ['Completed'],
  Completed: [],
  Cancelled: [],
};

export function canTransitionTo(current: OrderStatus, target: OrderStatus): boolean {
  return validTransitions[current].includes(target);
}

export function getNextStatuses(current: OrderStatus): OrderStatus[] {
  return validTransitions[current];
}
