import { AnalyticsDashboardResponse } from '../types/analytics';

class AnalyticsService {
  /**
   * Sample dashboard analytics (no backend)
   * @param days Number of days (7, 14, 30)
   */
  async getDashboardMetrics(days: number = 7): Promise<AnalyticsDashboardResponse> {
    // Static sample data (frontend-only demo)
    return {
      rangeDays: days,
      sinceDate: new Date().toISOString().split('T')[0],
      summary: {
        totalRevenue: 64500,
        revenueGrowth: 14.2,
        totalOrders: 42,
        ordersGrowth: 8.6,
        totalVisitors: 2150,
        visitorsGrowth: 18.4,
        avgOrderValue: 1535,
        totalPageViews: 3820,
        totalWhatsappClicks: 148,
      },
      dailySales: [
        { rawDate: '2026-10-09', date: 'Oct 9', revenue: 9800, orders: 6, customers: 6 },
        { rawDate: '2026-10-10', date: 'Oct 10', revenue: 11200, orders: 7, customers: 7 },
        { rawDate: '2026-10-11', date: 'Oct 11', revenue: 14500, orders: 9, customers: 9 },
        { rawDate: '2026-10-12', date: 'Oct 12', revenue: 8400, orders: 5, customers: 5 },
        { rawDate: '2026-10-13', date: 'Oct 13', revenue: 7600, orders: 4, customers: 4 },
        { rawDate: '2026-10-14', date: 'Oct 14', revenue: 13900, orders: 8, customers: 8 },
        { rawDate: '2026-10-15', date: 'Oct 15', revenue: 12200, orders: 7, customers: 7 },
      ],
      topCategories: [
        { id: 'cat-hampers', name: 'Gift Hampers', orders: 22, revenue: 42500, percentage: 66 },
        { id: 'cat-her', name: 'Gifts for Her', orders: 12, revenue: 13400, percentage: 21 },
        { id: 'cat-jewellery', name: 'Jewellery & Accessories', orders: 5, revenue: 5600, percentage: 9 },
        { id: 'cat-him', name: 'Gifts for Him', orders: 3, revenue: 3000, percentage: 4 },
      ],
      visitorTraffic: [
        { rawDate: '2026-10-09', date: 'Oct 9', pageViews: 480, uniqueVisitors: 290, whatsappClicks: 21 },
        { rawDate: '2026-10-10', date: 'Oct 10', pageViews: 540, uniqueVisitors: 320, whatsappClicks: 24 },
        { rawDate: '2026-10-11', date: 'Oct 11', pageViews: 680, uniqueVisitors: 410, whatsappClicks: 32 },
        { rawDate: '2026-10-12', date: 'Oct 12', pageViews: 490, uniqueVisitors: 280, whatsappClicks: 18 },
        { rawDate: '2026-10-13', date: 'Oct 13', pageViews: 460, uniqueVisitors: 270, whatsappClicks: 16 },
        { rawDate: '2026-10-14', date: 'Oct 14', pageViews: 620, uniqueVisitors: 360, whatsappClicks: 28 },
        { rawDate: '2026-10-15', date: 'Oct 15', pageViews: 550, uniqueVisitors: 310, whatsappClicks: 22 },
      ],
    };
  }

  /**
   * Record a sale. There is no backend, so this only acknowledges the order;
   * the dashboard figures above are static sample data.
   */
  async recordSale(data: {
    customerName: string;
    productName: string;
    categoryId: string;
    productId?: string;
    amount: number;
  }) {
    return { id: `sale-${Date.now()}`, orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`, amount: data.amount };
  }

  /**
   * Storefront traffic tracking (no-op without a backend)
   */
  async trackInteraction(_type: 'page_view' | 'whatsapp_click') {}
}

export const analyticsService = new AnalyticsService();
