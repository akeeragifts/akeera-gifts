export interface DailySalesData {
  rawDate: string;
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface CategoryPerformanceData {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  percentage: number;
}

export interface VisitorTrafficData {
  rawDate: string;
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  whatsappClicks: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalVisitors: number;
  visitorsGrowth: number;
  avgOrderValue: number;
  totalPageViews: number;
  totalWhatsappClicks: number;
}

export interface AnalyticsDashboardResponse {
  rangeDays: number;
  sinceDate: string;
  summary: AnalyticsSummary;
  dailySales: DailySalesData[];
  topCategories: CategoryPerformanceData[];
  visitorTraffic: VisitorTrafficData[];
}
