import { useMemo } from 'react';
import type { Order, Product, Category } from '@/types';
import { isRevenueOrder } from '@/lib/calculations';
import { useOrders } from '@/context/OrderContext';
import { useProducts } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';

export interface DateRange {
  from: Date;
  to: Date;
}

export function useAnalytics(dateRange?: DateRange) {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { categories } = useCategories();

  return useMemo(() => {
    const filtered = dateRange
      ? orders.filter((o) => {
          const d = new Date(o.createdAt);
          return d >= dateRange.from && d <= dateRange.to;
        })
      : orders;

    const revenueOrders = filtered.filter(isRevenueOrder);
    const totalRevenue = revenueOrders.reduce((s, o) => s + o.total, 0);
    const totalOrders = filtered.length;
    const cancelledOrders = filtered.filter((o) => o.status === 'Cancelled').length;
    const completedOrders = filtered.filter((o) => o.status === 'Completed').length;
    const avgOrderValue = revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0;

    const uniqueCustomers = new Set(filtered.map((o) => o.customerId)).size;

    // Revenue trend by day
    const revenueByDate = new Map<string, { date: string; revenue: number; orders: number }>();
    revenueOrders.forEach((o) => {
      const dateKey = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = revenueByDate.get(dateKey) ?? { date: dateKey, revenue: 0, orders: 0 };
      existing.revenue += o.total;
      existing.orders += 1;
      revenueByDate.set(dateKey, existing);
    });
    const revenueTrend = Array.from(revenueByDate.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Orders by status
    const statusCounts = new Map<string, number>();
    filtered.forEach((o) => {
      statusCounts.set(o.status, (statusCounts.get(o.status) ?? 0) + 1);
    });
    const ordersByStatus = Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count }));

    // Best selling products
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    revenueOrders.forEach((o) => {
      o.items.forEach((item) => {
        const existing = productSales.get(item.productId) ?? { name: item.name, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.lineTotal;
        productSales.set(item.productId, existing);
      });
    });
    const bestSelling = Array.from(productSales.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Popular categories
    const categorySales = new Map<string, { name: string; revenue: number; orders: number }>();
    revenueOrders.forEach((o) => {
      o.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          const cat = categories.find((c) => c.id === product.categoryId);
          if (cat) {
            const existing = categorySales.get(cat.id) ?? { name: cat.name, revenue: 0, orders: 0 };
            existing.revenue += item.lineTotal;
            existing.orders += item.quantity;
            categorySales.set(cat.id, existing);
          }
        }
      });
    });
    const popularCategories = Array.from(categorySales.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    // Recent orders
    const recentOrders = [...filtered]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      cancelledOrders,
      completedOrders,
      avgOrderValue,
      uniqueCustomers,
      revenueTrend,
      ordersByStatus,
      bestSelling,
      popularCategories,
      recentOrders,
      filteredOrders: filtered,
    };
  }, [orders, products, categories, dateRange]);
}
