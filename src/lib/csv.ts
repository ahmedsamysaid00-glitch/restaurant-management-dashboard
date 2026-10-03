import type { Order } from '@/types';
import { formatDate, formatPrice } from './calculations';

export function exportOrdersToCSV(orders: Order[], currency = 'EGP'): void {
  const headers = [
    'Order Number',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Date',
    'Items',
    'Subtotal',
    'Total',
    'Fulfillment',
    'Table',
    'Payment',
    'Status',
  ];

  const rows = orders.map((o) => {
    const itemCount = o.items.reduce((s, i) => s + i.quantity, 0);
    return [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerEmail,
      o.customerPhone,
      formatDate(o.createdAt),
      String(itemCount),
      formatPrice(o.subtotal, currency),
      formatPrice(o.total, currency),
      o.fulfillmentMethod,
      o.tableNumber ?? '',
      o.paymentMethod,
      o.status,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `brewhouse-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
