import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { Download, DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { useAnalytics, type DateRange } from '@/hooks/useAnalytics';
import { useOrders } from '@/context/OrderContext';
import { exportOrdersToCSV } from '@/lib/csv';
import { useToast } from '@/components/ui/Toast';
import { useSettings } from '@/context/SettingsContext';
import { formatPrice, formatDate } from '@/lib/calculations';
import { Select } from '@/components/ui/Input';

export function AdminReportsPage() {
  const { orders } = useOrders();
  const { showToast } = useToast();
  const { settings } = useSettings();
  const [rangeKey, setRangeKey] = useState('30');

  const ranges: Record<string, DateRange> = useMemo(() => ({
    '7': { from: new Date(Date.now() - 7 * 86400000), to: new Date() },
    '14': { from: new Date(Date.now() - 14 * 86400000), to: new Date() },
    '30': { from: new Date(Date.now() - 30 * 86400000), to: new Date() },
    '90': { from: new Date(Date.now() - 90 * 86400000), to: new Date() },
  }), []);

  const dateRange = ranges[rangeKey];
  const analytics = useAnalytics(dateRange);

  const revenueByCategoryData = analytics.popularCategories.map((c) => ({
    name: c.name,
    revenue: c.revenue,
    orders: c.orders,
  }));

  const revenueVsOrdersData = analytics.revenueTrend.map((d) => ({
    date: d.date,
    revenue: d.revenue,
    orders: d.orders,
  }));

  const handleExport = () => {
    if (analytics.filteredOrders.length === 0) {
      showToast('No orders to export for this period', 'error');
      return;
    }
    exportOrdersToCSV(analytics.filteredOrders, settings.currencyDisplay);
    showToast('CSV report exported successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="w-48">
          <Select value={rangeKey} onChange={(e) => setRangeKey(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </Select>
        </div>
        <button onClick={handleExport} className="btn-accent btn-sm">
          <Download className="h-4 w-4" />
          Export to CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Revenue', value: formatPrice(analytics.totalRevenue), icon: DollarSign },
          { title: 'Orders', value: String(analytics.totalOrders), icon: ShoppingBag },
          { title: 'Customers', value: String(analytics.uniqueCustomers), icon: Users },
          { title: 'Avg Order Value', value: formatPrice(Math.round(analytics.avgOrderValue)), icon: TrendingUp },
        ].map((card) => (
          <div key={card.title} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-caramel/10 text-caramel">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-sm text-muted">{card.title}</p>
            <p className="text-2xl font-bold text-espresso mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue & Orders over time */}
      <div className="card p-6">
        <h2 className="font-serif text-lg font-bold text-espresso mb-4">Revenue & Orders Over Time</h2>
        {revenueVsOrdersData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueVsOrdersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DB" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#81766C' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#81766C' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#81766C' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #EFE8DB', fontSize: '13px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#B77945" strokeWidth={2} name="Revenue (EGP)" dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3B2418" strokeWidth={2} name="Orders" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted text-sm">No data for this period</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by category */}
        <div className="card p-6">
          <h2 className="font-serif text-lg font-bold text-espresso mb-4">Revenue by Category</h2>
          {revenueByCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DB" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#81766C' }} />
                <YAxis tick={{ fontSize: 11, fill: '#81766C' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #EFE8DB', fontSize: '13px' }}
                  formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#B77945" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted text-sm">No data for this period</div>
          )}
        </div>

        {/* Best-selling products */}
        <div className="card p-6">
          <h2 className="font-serif text-lg font-bold text-espresso mb-4">Best-Selling Products</h2>
          {analytics.bestSelling.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analytics.bestSelling} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DB" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#81766C' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#81766C' }} width={100} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #EFE8DB', fontSize: '13px' }}
                  formatter={(value, name) => [String(value), name === 'quantity' ? 'Units Sold' : String(name)]}
                />
                <Bar dataKey="quantity" fill="#3B2418" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted text-sm">No data for this period</div>
          )}
        </div>
      </div>

      {/* Orders table */}
      <div className="card p-6">
        <h2 className="font-serif text-lg font-bold text-espresso mb-4">Filtered Orders ({analytics.filteredOrders.length})</h2>
        {analytics.filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-espresso/10 text-left text-muted text-xs">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {analytics.filteredOrders.slice(0, 20).map((order) => (
                  <tr key={order.id} className="border-b border-espresso/5 last:border-0">
                    <td className="py-2.5 font-medium text-espresso">{order.orderNumber}</td>
                    <td className="py-2.5 text-muted">{order.customerName}</td>
                    <td className="py-2.5 text-muted">{formatDate(order.createdAt)}</td>
                    <td className="py-2.5 text-muted">{order.status}</td>
                    <td className="py-2.5 text-right font-bold text-espresso">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {analytics.filteredOrders.length > 20 && (
              <p className="text-xs text-muted text-center mt-4">Showing 20 of {analytics.filteredOrders.length} orders</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted text-center py-8">No orders for this period</p>
        )}
      </div>
    </div>
  );
}
