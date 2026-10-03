import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { useAnalytics, type DateRange } from '@/hooks/useAnalytics';
import { formatPrice, formatDate } from '@/lib/calculations';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Select } from '@/components/ui/Input';
import type { OrderStatus } from '@/types';

const COLORS = ['#B77945', '#3B2418', '#81766C', '#C99260', '#5C3A28', '#A89E94'];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: '#F59E0B',
  Confirmed: '#3B82F6',
  Preparing: '#F97316',
  Ready: '#22C55E',
  Completed: '#059669',
  Cancelled: '#EF4444',
};

interface StatCardProps {
  title: string;
  value: string;
  icon: typeof TrendingUp;
  trend?: number;
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-caramel/10 text-caramel">
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-sm text-muted">{title}</p>
      <p className="text-2xl font-bold text-espresso mt-1">{value}</p>
    </div>
  );
}

export function AdminDashboardPage() {
  const [rangeKey, setRangeKey] = useState('30');
  const ranges: Record<string, DateRange> = useMemo(() => ({
    '7': { from: new Date(Date.now() - 7 * 86400000), to: new Date() },
    '14': { from: new Date(Date.now() - 14 * 86400000), to: new Date() },
    '30': { from: new Date(Date.now() - 30 * 86400000), to: new Date() },
    '90': { from: new Date(Date.now() - 90 * 86400000), to: new Date() },
  }), []);

  const dateRange = ranges[rangeKey];
  const analytics = useAnalytics(dateRange);

  const pieData = analytics.ordersByStatus.map((s) => ({
    name: s.status,
    value: s.count,
    color: STATUS_COLORS[s.status as OrderStatus] ?? '#B77945',
  }));

  return (
    <div className="space-y-6">
      {/* Date range filter */}
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-muted" />
        <div className="w-48">
          <Select value={rangeKey} onChange={(e) => setRangeKey(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </Select>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatPrice(analytics.totalRevenue)} icon={DollarSign} />
        <StatCard title="Total Orders" value={String(analytics.totalOrders)} icon={ShoppingBag} />
        <StatCard title="Unique Customers" value={String(analytics.uniqueCustomers)} icon={Users} />
        <StatCard title="Avg Order Value" value={formatPrice(Math.round(analytics.avgOrderValue))} icon={TrendingUp} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue trend */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-serif text-lg font-bold text-espresso mb-4">Revenue Trend</h2>
          {analytics.revenueTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={analytics.revenueTrend}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B77945" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#B77945" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DB" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#81766C' }} />
                <YAxis tick={{ fontSize: 11, fill: '#81766C' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #EFE8DB', fontSize: '13px' }}
                  formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#B77945" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted text-sm">No data for this period</div>
          )}
        </div>

        {/* Orders by status */}
        <div className="card p-6">
          <h2 className="font-serif text-lg font-bold text-espresso mb-4">Orders by Status</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #EFE8DB', fontSize: '13px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted text-sm">No data</div>
          )}
        </div>
      </div>

      {/* Best selling + Popular categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-serif text-lg font-bold text-espresso mb-4">Best-Selling Products</h2>
          {analytics.bestSelling.length > 0 ? (
            <div className="space-y-3">
              {analytics.bestSelling.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-caramel/10 text-caramel text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-espresso flex-1 truncate">{item.name}</span>
                  <span className="text-sm text-muted flex-shrink-0">{item.quantity} sold</span>
                  <span className="text-sm font-bold text-espresso flex-shrink-0">{formatPrice(item.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-8">No sales data for this period</p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-serif text-lg font-bold text-espresso mb-4">Popular Categories</h2>
          {analytics.popularCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.popularCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DB" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#81766C' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#81766C' }} width={80} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #EFE8DB', fontSize: '13px' }}
                  formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#B77945" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted text-center py-8">No data for this period</p>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="card p-6">
        <h2 className="font-serif text-lg font-bold text-espresso mb-4">Recent Orders</h2>
        {analytics.recentOrders.length > 0 ? (
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
                {analytics.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-espresso/5 last:border-0">
                    <td className="py-3 font-medium text-espresso">{order.orderNumber}</td>
                    <td className="py-3 text-muted">{order.customerName}</td>
                    <td className="py-3 text-muted">{formatDate(order.createdAt)}</td>
                    <td className="py-3"><StatusBadge status={order.status} size="sm" /></td>
                    <td className="py-3 text-right font-bold text-espresso">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted text-center py-8">No orders for this period</p>
        )}
      </div>
    </div>
  );
}
