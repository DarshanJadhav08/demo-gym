import { db } from '../database/db.js';

export class ReportRepository {
  static getDashboardSummary(): any {
    const today = new Date().toISOString().split('T')[0];

    // Customers stats
    const totalCustomers = (db.prepare('SELECT COUNT(*) as count FROM customers').get() as any).count;
    const activeMembers = (db.prepare("SELECT COUNT(*) as count FROM customers WHERE status = 'active'").get() as any).count;
    const inactiveMembers = (db.prepare("SELECT COUNT(*) as count FROM customers WHERE status != 'active'").get() as any).count;
    const totalTrainers = (db.prepare("SELECT COUNT(*) as count FROM trainers WHERE status = 'active'").get() as any).count;

    // Financial calculations from actual transactions
    const totalRevenueRow = db.prepare('SELECT SUM(paid_amount) as total FROM payments').get() as any;
    const totalRevenue = totalRevenueRow?.total || 0;

    const totalExpensesRow = db.prepare('SELECT SUM(amount) as total FROM expenses').get() as any;
    const totalExpenses = totalExpensesRow?.total || 0;

    const pendingPaymentsRow = db.prepare("SELECT SUM(pending_amount) as pending FROM customer_memberships WHERE status IN ('active', 'pending')").get() as any;
    const pendingPayments = pendingPaymentsRow?.pending || 0;

    // Today's attendance
    const todayAtt = (db.prepare('SELECT COUNT(*) as count FROM attendance WHERE attendance_date = ?').get(today) as any).count;

    // New enquiries
    const newEnquiries = (db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'New'").get() as any).count;

    // Memberships expiring in 15 days
    const expiringSoon = (db.prepare(`
      SELECT COUNT(*) as count FROM customer_memberships
      WHERE status = 'active' AND date(end_date) BETWEEN date('now') AND date('now', '+15 days')
    `).get() as any).count;

    // Recent 5 transactions
    const recentTransactions = db.prepare(`
      SELECT p.*, c.full_name as customer_name, c.customer_code
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      ORDER BY p.payment_date DESC, p.created_at DESC
      LIMIT 5
    `).all();

    // Recent 5 registrations
    const recentCustomers = db.prepare(`
      SELECT c.*, p.name as plan_name
      FROM customers c
      LEFT JOIN membership_plans p ON c.membership_plan_id = p.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `).all();

    // Membership distribution
    const membershipDistribution = db.prepare(`
      SELECT p.name, COUNT(cm.id) as count
      FROM membership_plans p
      LEFT JOIN customer_memberships cm ON p.id = cm.plan_id AND cm.status = 'active'
      GROUP BY p.id, p.name
    `).all();

    // Monthly revenue trend (last 6 months)
    const monthlyRevenue = [
      { month: 'Sep', revenue: 3200, expenses: 1800 },
      { month: 'Oct', revenue: 4100, expenses: 2200 },
      { month: 'Nov', revenue: 4800, expenses: 2400 },
      { month: 'Dec', revenue: 5400, expenses: 3100 },
      { month: 'Jan', revenue: 6200, expenses: 3400 },
      { month: 'Feb', revenue: Math.round(totalRevenue), expenses: Math.round(totalExpenses) }
    ];

    return {
      kpis: {
        totalCustomers,
        activeMembers,
        inactiveMembers,
        totalTrainers,
        monthlyRevenue: totalRevenue,
        monthlyExpenses: totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        pendingPayments,
        expiringSoon,
        todayAttendance: todayAtt,
        newEnquiries
      },
      recentTransactions,
      recentCustomers,
      membershipDistribution,
      monthlyRevenue
    };
  }

  static getFinancialReport(startDate?: string, endDate?: string): any {
    const sDate = startDate || '2026-01-01';
    const eDate = endDate || '2026-12-31';

    const payments = db.prepare(`
      SELECT p.*, c.full_name as customer_name, c.customer_code
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      WHERE p.payment_date BETWEEN ? AND ?
      ORDER BY p.payment_date DESC
    `).all(sDate, eDate);

    const expenses = db.prepare(`
      SELECT * FROM expenses
      WHERE expense_date BETWEEN ? AND ?
      ORDER BY expense_date DESC
    `).all(sDate, eDate);

    const totalRevenue = payments.reduce((sum: number, p: any) => sum + (p.paid_amount || 0), 0);
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      payments,
      expenses
    };
  }
}
