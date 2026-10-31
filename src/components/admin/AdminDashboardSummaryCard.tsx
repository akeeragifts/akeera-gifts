import React, { useState, useEffect, useCallback, useId } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  RefreshCw,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsDashboardResponse } from '../../types/analytics';
import { productService } from '../../services/productService';
import { Category, Product } from '../../types/product';

interface AdminDashboardSummaryCardProps {
  currencySymbol?: string;
  onRefreshData?: () => void;
}

// Boutique luxury palette for charts
const CATEGORY_COLORS = [
  '#B85C75', // Brand Terracotta Rose
  '#4A6B82', // Slate Twilight
  '#A7B7A0', // Sage Green
  '#E07A5F', // Burnt Coral
  '#D4A373', // Warm Honey Gold
  '#3D405B', // Deep Indigo
  '#81B29A', // Soft Mint
  '#9B5DE5', // Mulberry
];

export const AdminDashboardSummaryCard: React.FC<AdminDashboardSummaryCardProps> = ({
  currencySymbol = '₹',
  onRefreshData,
}) => {
  const [rangeDays, setRangeDays] = useState<number>(7);
  const [activeView, setActiveView] = useState<'sales' | 'categories' | 'traffic'>('sales');
  const [data, setData] = useState<AnalyticsDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [recordModalOpen, setRecordModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form fields for recording a new live sale in the database
  const [saleCustomer, setSaleCustomer] = useState('');
  const [saleProduct, setSaleProduct] = useState('');
  const [saleCategory, setSaleCategory] = useState('');
  const [saleAmount, setSaleAmount] = useState<number>(1499);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [submittingSale, setSubmittingSale] = useState(false);

  // Unique IDs for SVG gradients to prevent DOM collisions
  const salesGradientId = useId();
  const trafficGradientId = useId();

  const fetchMetrics = useCallback(async (days: number, isBackground = false) => {
    if (!isBackground) setLoading(true);
    setRefreshing(true);
    try {
      const response = await analyticsService.getDashboardMetrics(days);
      setData(response);
    } catch (err) {
      console.error('Failed to load analytics metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics(rangeDays);
  }, [rangeDays, fetchMetrics]);

  useEffect(() => {
    // Load categories and products for recording sales modal
    Promise.all([
      productService.getCategories(),
      productService.getAllPublishedProducts(),
    ]).then(([cats, prods]) => {
      setAvailableCategories(cats);
      setAvailableProducts(prods);
      if (cats.length > 0 && !saleCategory) {
        setSaleCategory(cats[0].id);
      }
      if (prods.length > 0 && !saleProduct) {
        setSaleProduct(prods[0].name);
        setSaleAmount(prods[0].price);
      }
    });
  }, [saleCategory, saleProduct]);

  const handleProductSelect = (prodName: string) => {
    setSaleProduct(prodName);
    const found = availableProducts.find((p) => p.name === prodName);
    if (found) {
      setSaleAmount(found.price);
      setSaleCategory(found.categoryId);
    }
  };

  const handleRecordSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleCustomer.trim() || !saleProduct.trim() || !saleAmount) return;

    setSubmittingSale(true);
    try {
      await analyticsService.recordSale({
        customerName: saleCustomer.trim(),
        productName: saleProduct.trim(),
        categoryId: saleCategory || 'cat-hampers',
        amount: Number(saleAmount),
      });

      setNotification(`Recorded order of ${currencySymbol}${saleAmount.toLocaleString('en-IN')} for ${saleCustomer.trim()}`);
      setRecordModalOpen(false);
      setSaleCustomer('');
      // Refresh metrics immediately from the database
      await fetchMetrics(rangeDays, true);
      if (onRefreshData) onRefreshData();
      setTimeout(() => setNotification(null), 4500);
    } catch (err: any) {
      setNotification(`Failed to record sale: ${err.message}`);
    } finally {
      setSubmittingSale(false);
    }
  };

  const summary = data?.summary || {
    totalRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    totalVisitors: 0,
    visitorsGrowth: 0,
    avgOrderValue: 0,
    totalPageViews: 0,
    totalWhatsappClicks: 0,
  };

  // Custom tooltips for recharts with luxury styling
  const SalesTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const rev = payload.find((p: any) => p.dataKey === 'revenue')?.value;
      const orders = payload.find((p: any) => p.dataKey === 'orders')?.value;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-stone-200 text-xs text-stone-800 space-y-1">
          <p className="font-bold text-stone-900 border-b border-stone-100 pb-1">{label}</p>
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-stone-500">Gross Sales:</span>
            <span className="font-bold text-[#B85C75]">
              {currencySymbol}{Number(rev || 0).toLocaleString('en-IN')}
            </span>
          </div>
          {orders !== undefined && (
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-stone-500">Orders:</span>
              <span className="font-semibold text-stone-700">{orders} orders</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const TrafficTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-stone-200 text-xs text-stone-800 space-y-1">
          <p className="font-bold text-stone-900 border-b border-stone-100 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`entry-${index}`} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-stone-900">
                {Number(entry.value).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-stone-200 text-xs text-stone-800 space-y-1">
          <p className="font-bold text-stone-900 border-b border-stone-100 pb-1">{item.name}</p>
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-stone-500">Revenue:</span>
            <span className="font-bold text-[#B85C75]">
              {currencySymbol}{Number(item.revenue || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-stone-500">Volume:</span>
            <span className="font-semibold text-stone-700">{item.orders} orders ({item.percentage}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden transition-all">
      {/* 1. Header Bar with Range Controls and Action */}
      <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#B85C75]">
              Database Intelligence
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-[11px] text-stone-500">Live SQL Analytics</span>
          </div>
          <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
            Store Performance &amp; Revenue Overview
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time daily sales transactions, category revenue shares, and traffic metrics from database.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Selector (Segmented buttons) */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-semibold">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setRangeDays(days)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  rangeDays === days
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>

          {/* Sync Button */}
          <button
            type="button"
            onClick={() => fetchMetrics(rangeDays, false)}
            disabled={refreshing}
            title="Refresh database metrics"
            className="p-2 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#B85C75]' : ''}`} />
          </button>

          {/* Record Sale Action */}
          <button
            type="button"
            onClick={() => setRecordModalOpen(true)}
            className="bg-[#292526] hover:bg-stone-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#A7B7A0]" />
            <span>Record Order</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="mx-5 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 text-emerald-600 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Executive KPI Cards Grid */}
      <div className="p-5 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-b border-stone-100">
        {/* Metric 1: Total Revenue */}
        <div className="bg-[#FFF9F4]/70 p-4 rounded-2xl border border-stone-200/70 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Gross Sales
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#B85C75]/10 text-[#B85C75] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900">
            {currencySymbol}{summary.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600">
            {summary.revenueGrowth >= 0 ? (
              <span className="flex items-center text-emerald-700">
                <TrendingUp className="w-3 h-3 mr-0.5 shrink-0" />
                +{summary.revenueGrowth}%
              </span>
            ) : (
              <span className="flex items-center text-rose-600">
                <TrendingDown className="w-3 h-3 mr-0.5 shrink-0" />
                {summary.revenueGrowth}%
              </span>
            )}
            <span className="text-stone-400">vs prior period</span>
          </div>
        </div>

        {/* Metric 2: Completed Orders */}
        <div className="bg-[#FFF9F4]/70 p-4 rounded-2xl border border-stone-200/70 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900">
            {summary.totalOrders}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600">
            {summary.ordersGrowth >= 0 ? (
              <span className="flex items-center text-emerald-700">
                <TrendingUp className="w-3 h-3 mr-0.5 shrink-0" />
                +{summary.ordersGrowth}%
              </span>
            ) : (
              <span className="flex items-center text-rose-600">
                <TrendingDown className="w-3 h-3 mr-0.5 shrink-0" />
                {summary.ordersGrowth}%
              </span>
            )}
            <span className="text-stone-400">WhatsApp conversions</span>
          </div>
        </div>

        {/* Metric 3: Average Order Value */}
        <div className="bg-[#FFF9F4]/70 p-4 rounded-2xl border border-stone-200/70 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Avg Order Value
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900">
            {currencySymbol}{summary.avgOrderValue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-stone-500">
            Across {rangeDays} days of transactions
          </p>
        </div>

        {/* Metric 4: Visitor Traffic */}
        <div className="bg-[#FFF9F4]/70 p-4 rounded-2xl border border-stone-200/70 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Visitor Traffic
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900">
            {summary.totalVisitors.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600">
            <span className="text-emerald-700 font-semibold">{summary.totalPageViews} views</span>
            <span className="text-stone-400">·</span>
            <span className="text-[#B85C75] font-semibold">{summary.totalWhatsappClicks} chats</span>
          </div>
        </div>
      </div>

      {/* 3. Recharts Visualizations Area */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Chart View Switcher Tabs (Buttons with functional state) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl self-start">
            <button
              type="button"
              onClick={() => setActiveView('sales')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === 'sales'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#B85C75]" />
              <span>Daily Sales Trend</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('categories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === 'categories'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5 text-[#4A6B82]" />
              <span>Top Categories</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('traffic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === 'traffic'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Visitor Traffic</span>
            </button>
          </div>

          <div className="text-[11px] text-stone-400 flex items-center gap-2">
            <span>Range: Last {rangeDays} Days</span>
            <span>·</span>
            <span>Database Table: <code className="text-stone-600 font-mono">orders_sales</code></span>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="w-full h-72 sm:h-80 pt-2">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-xs text-stone-400">
              <RefreshCw className="w-6 h-6 animate-spin text-[#B85C75]" />
              <span>Loading database analytics metrics...</span>
            </div>
          ) : activeView === 'sales' ? (
            /* VIEW 1: Daily Sales & Revenue Trend (AreaChart + Orders Bar) */
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.dailySales || []}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={salesGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B85C75" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#B85C75" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<SalesTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#B85C75"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${salesGradientId})`}
                  name="Gross Sales"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : activeView === 'categories' ? (
            /* VIEW 2: Top-Performing Categories (Horizontal Bar Chart & Revenue Breakdown) */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-center">
              <div className="lg:col-span-2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(data?.topCategories || []).slice(0, 5)}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6B7280', fontSize: 11 }}
                      tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      width={130}
                      tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip content={<CategoryTooltip />} />
                    <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                      {(data?.topCategories || []).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Share List */}
              <div className="space-y-2 text-xs border-t lg:border-t-0 lg:border-l border-stone-100 lg:pl-6">
                <h4 className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider">
                  Category Contribution
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {(data?.topCategories || []).slice(0, 5).map((cat, idx) => (
                    <div key={cat.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                        />
                        <span className="font-medium text-stone-800 truncate">{cat.name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-stone-900">
                          {currencySymbol}{cat.revenue.toLocaleString('en-IN')}
                        </span>
                        <span className="text-stone-400 ml-1">({cat.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* VIEW 3: Visitor Traffic & Clicks (LineChart with dual lines) */
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data?.visitorTraffic || []}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={trafficGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                />
                <Tooltip content={<TrafficTooltip />} />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  name="Page Views"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#4F46E5' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="uniqueVisitors"
                  name="Unique Visitors"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#10B981' }}
                />
                <Line
                  type="monotone"
                  dataKey="whatsappClicks"
                  name="WhatsApp Clicks"
                  stroke="#B85C75"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#B85C75' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 4. Modal: Record Live Sale to Database */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#B85C75]/10 text-[#B85C75] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-base text-stone-900">
                    Record Storefront Order
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Inserts into <code className="font-mono bg-stone-100 px-1 rounded">orders_sales</code> table
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRecordModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordSaleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika V. (via WhatsApp)"
                  value={saleCustomer}
                  onChange={(e) => setSaleCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Catalog Item Ordered *</label>
                <select
                  value={saleProduct}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                >
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({currencySymbol}{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Category *</label>
                  <select
                    value={saleCategory}
                    onChange={(e) => setSaleCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                  >
                    {availableCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Order Value ({currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={saleAmount}
                    onChange={(e) => setSaleAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  disabled={submittingSale}
                  className="px-4 py-2 border border-stone-300 text-stone-600 rounded-xl hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSale}
                  className="px-5 py-2 bg-[#B85C75] text-white rounded-xl hover:bg-[#9A465C] font-semibold cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {submittingSale ? 'Recording...' : 'Commit to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
