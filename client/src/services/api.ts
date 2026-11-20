const API_BASE = '/api';

function getMockFallback(endpoint: string): any {
  if (endpoint.includes('/reports/dashboard-summary')) {
    return {
      kpis: {
        totalCustomers: 248,
        activeMembers: 196,
        inactiveMembers: 52,
        totalTrainers: 14,
        monthlyRevenue: 28450,
        monthlyExpenses: 9800,
        netProfit: 18650,
        pendingPayments: 2450,
        todayAttendance: 84,
        newEnquiries: 19,
      },
      revenueChart: [
        { month: 'Jan', revenue: 19400, expenses: 7800 },
        { month: 'Feb', revenue: 21800, expenses: 8100 },
        { month: 'Mar', revenue: 23600, expenses: 8400 },
        { month: 'Apr', revenue: 25900, expenses: 8900 },
        { month: 'May', revenue: 27100, expenses: 9300 },
        { month: 'Jun', revenue: 28450, expenses: 9800 },
      ],
      planDistribution: [
        { name: 'Elite Annual', value: 88 },
        { name: 'Gold Half-Yearly', value: 64 },
        { name: 'Silver Quarterly', value: 42 },
        { name: 'Basic Monthly', value: 54 },
      ],
      recentPayments: [
        { id: 'pay_1', receipt_number: 'RCP-1049', customer_name: 'Marcus Reeves', plan_name: 'Elite Annual VIP', amount: 999, payment_method: 'Card', status: 'completed', payment_date: 'Today, 10:45 AM' },
        { id: 'pay_2', receipt_number: 'RCP-1048', customer_name: 'Elena Rostova', plan_name: 'Gold Half-Yearly', amount: 549, payment_method: 'UPI', status: 'completed', payment_date: 'Today, 09:12 AM' },
        { id: 'pay_3', receipt_number: 'RCP-1047', customer_name: 'David Chen', plan_name: 'Silver Quarterly', amount: 299, payment_method: 'Cash', status: 'completed', payment_date: 'Yesterday' },
      ],
      recentEnquiries: [
        { id: 'enq_1', full_name: 'Rohit Sharma', mobile_number: '+91 98200 11223', goal: 'Weight Loss & Hypertrophy', status: 'new', created_at: '15 mins ago' },
        { id: 'enq_2', full_name: 'Priya Kapoor', mobile_number: '+91 99300 44556', goal: 'Personal Training', status: 'contacted', created_at: '1 hour ago' },
        { id: 'enq_3', full_name: 'Arjun Verma', mobile_number: '+91 98111 77889', goal: 'Crossfit & Strength', status: 'scheduled', created_at: '3 hours ago' },
      ],
    };
  }

  if (endpoint.includes('/customers')) {
    return {
      customers: [
        { id: 'c1', member_id: 'MEM-001', full_name: 'Marcus Reeves', mobile_number: '+91 98201 12345', email: 'marcus@demo.com', status: 'active', plan_name: 'Elite Annual VIP', expiry_date: '2027-11-20', joined_date: '2026-01-15' },
        { id: 'c2', member_id: 'MEM-002', full_name: 'Elena Rostova', mobile_number: '+91 98202 23456', email: 'elena@demo.com', status: 'active', plan_name: 'Gold Half-Yearly', expiry_date: '2027-05-15', joined_date: '2026-02-10' },
        { id: 'c3', member_id: 'MEM-003', full_name: 'David Chen', mobile_number: '+91 98203 34567', email: 'david@demo.com', status: 'active', plan_name: 'Silver Quarterly', expiry_date: '2027-02-28', joined_date: '2026-03-01' },
        { id: 'c4', member_id: 'MEM-004', full_name: 'Sophia Patel', mobile_number: '+91 98204 45678', email: 'sophia@demo.com', status: 'inactive', plan_name: 'Bronze Monthly', expiry_date: '2026-10-15', joined_date: '2025-11-12' },
      ],
      total: 4,
    };
  }

  if (endpoint.includes('/trainers')) {
    return {
      trainers: [
        { id: 't1', trainer_code: 'TRN-01', full_name: 'Alex Vance', specialization: 'Strength & Hypertrophy', experience_years: 9, mobile_number: '+91 98333 11223', email: 'alex@demo.com', status: 'active' },
        { id: 't2', trainer_code: 'TRN-02', full_name: 'Sarah Connor', specialization: 'Functional & HIIT', experience_years: 7, mobile_number: '+91 98333 44556', email: 'sarah@demo.com', status: 'active' },
        { id: 't3', trainer_code: 'TRN-03', full_name: 'Vikram Singh', specialization: 'Olympic Lifting & Power', experience_years: 11, mobile_number: '+91 98333 77889', email: 'vikram@demo.com', status: 'active' },
      ],
      total: 3,
    };
  }

  if (endpoint.includes('/memberships/plans')) {
    return {
      plans: [
        { id: 'p1', name: 'Elite Annual VIP', price: 999, duration_months: 12, features: ['Unlimited 24/7 Access', 'Dedicated Master Trainer', 'Custom Nutrition Protocol', 'Spa & Recovery Lounge'], is_popular: true },
        { id: 'p2', name: 'Gold Half-Yearly', price: 549, duration_months: 6, features: ['Full Gym & Classes', 'Quarterly Fitness Assessment', 'Steam & Sauna Access'], is_popular: false },
        { id: 'p3', name: 'Silver Quarterly', price: 299, duration_months: 3, features: ['Peak Hours Gym Access', 'Locker & Shower Facility', '1 Trainer Intro Session'], is_popular: false },
        { id: 'p4', name: 'Bronze Monthly', price: 119, duration_months: 1, features: ['Standard Gym Floor Access', 'Basic Equipment Access'], is_popular: false },
      ]
    };
  }

  if (endpoint.includes('/payments')) {
    return {
      payments: [
        { id: 'pay_1', receipt_number: 'RCP-1049', customer_name: 'Marcus Reeves', plan_name: 'Elite Annual VIP', amount: 999, payment_method: 'Card', status: 'completed', payment_date: 'Today, 10:45 AM' },
        { id: 'pay_2', receipt_number: 'RCP-1048', customer_name: 'Elena Rostova', plan_name: 'Gold Half-Yearly', amount: 549, payment_method: 'UPI', status: 'completed', payment_date: 'Today, 09:12 AM' },
        { id: 'pay_3', receipt_number: 'RCP-1047', customer_name: 'David Chen', plan_name: 'Silver Quarterly', amount: 299, payment_method: 'Cash', status: 'completed', payment_date: 'Yesterday' },
      ],
      total: 3
    };
  }

  if (endpoint.includes('/attendance')) {
    return {
      records: [
        { id: 'att_1', customer_name: 'Marcus Reeves', check_in: '07:30 AM', check_out: '09:15 AM', status: 'completed' },
        { id: 'att_2', customer_name: 'Elena Rostova', check_in: '08:15 AM', check_out: null, status: 'in-gym' },
        { id: 'att_3', customer_name: 'David Chen', check_in: '09:00 AM', check_out: null, status: 'in-gym' },
      ],
      todayCount: 84
    };
  }

  if (endpoint.includes('/auth/me')) {
    const saved = localStorage.getItem('apex_user');
    return {
      user: saved ? JSON.parse(saved) : {
        id: 'usr_demo_admin',
        username: 'admin',
        email: 'admin@gymdemo.com',
        role: 'admin',
        first_name: 'Demo',
        last_name: 'Admin',
      }
    };
  }

  if (endpoint.includes('/auth/login')) {
    return {
      token: 'demo_token_admin',
      user: {
        id: 'usr_demo_admin',
        username: 'admin',
        email: 'admin@gymdemo.com',
        role: 'admin',
        first_name: 'Demo',
        last_name: 'Admin',
      }
    };
  }

  return { success: true, data: [] };
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('apex_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return data as T;
    }
  } catch (err) {
    // Backend server unavailable (Static site deployment) - fallback seamlessly to mock data
  }

  return getMockFallback(endpoint) as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data: any) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () =>
    apiRequest('/auth/me'),

  // Public Home Data
  getHomeData: () =>
    apiRequest('/content/home-data'),
  subscribeNewsletter: (email: string) =>
    apiRequest('/content/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
  submitEnquiry: (data: any) =>
    apiRequest('/enquiries/submit', { method: 'POST', body: JSON.stringify(data) }),
  submitMembershipApplication: (data: any) =>
    apiRequest('/memberships/applications', { method: 'POST', body: JSON.stringify(data) }),

  // Customers
  getCustomers: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/customers?${qs}`);
  },
  getCustomerById: (id: string) =>
    apiRequest(`/customers/${id}`),
  createCustomer: (data: any) =>
    apiRequest('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: string, data: any) =>
    apiRequest(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id: string) =>
    apiRequest(`/customers/${id}`, { method: 'DELETE' }),

  // Trainers
  getTrainers: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/trainers?${qs}`);
  },
  getTrainerById: (id: string) =>
    apiRequest(`/trainers/${id}`),
  createTrainer: (data: any) =>
    apiRequest('/trainers', { method: 'POST', body: JSON.stringify(data) }),
  updateTrainer: (id: string, data: any) =>
    apiRequest(`/trainers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrainer: (id: string) =>
    apiRequest(`/trainers/${id}`, { method: 'DELETE' }),

  // Memberships
  getPlans: (activeOnly: boolean = false) =>
    apiRequest(`/memberships/plans?activeOnly=${activeOnly}`),
  createPlan: (data: any) =>
    apiRequest('/memberships/plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id: string, data: any) =>
    apiRequest(`/memberships/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlan: (id: string) =>
    apiRequest(`/memberships/plans/${id}`, { method: 'DELETE' }),
  getApplications: (status?: string) =>
    apiRequest(`/memberships/applications${status ? `?status=${status}` : ''}`),
  reviewApplication: (id: string, status: 'approved' | 'rejected') =>
    apiRequest(`/memberships/applications/${id}/review`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getCustomerMemberships: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/memberships/customer-memberships?${qs}`);
  },
  assignMembership: (data: any) =>
    apiRequest('/memberships/assign', { method: 'POST', body: JSON.stringify(data) }),

  // Payments
  getPayments: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/payments?${qs}`);
  },
  getPaymentById: (id: string) =>
    apiRequest(`/payments/${id}`),
  collectPayment: (data: any) =>
    apiRequest('/payments', { method: 'POST', body: JSON.stringify(data) }),

  // Attendance
  getTodayAttendance: () =>
    apiRequest('/attendance/today'),
  getAttendanceHistory: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/attendance/history?${qs}`);
  },
  checkIn: (data: any) =>
    apiRequest('/attendance/check-in', { method: 'POST', body: JSON.stringify(data) }),
  checkOut: (id: string) =>
    apiRequest(`/attendance/check-out/${id}`, { method: 'POST' }),

  // Workouts
  getWorkouts: () =>
    apiRequest('/workouts'),
  getWorkoutById: (id: string) =>
    apiRequest(`/workouts/${id}`),
  createWorkout: (data: any) =>
    apiRequest('/workouts', { method: 'POST', body: JSON.stringify(data) }),
  assignWorkout: (data: any) =>
    apiRequest('/workouts/assign', { method: 'POST', body: JSON.stringify(data) }),

  // Diets
  getDiets: () =>
    apiRequest('/diets'),
  getDietById: (id: string) =>
    apiRequest(`/diets/${id}`),
  createDiet: (data: any) =>
    apiRequest('/diets', { method: 'POST', body: JSON.stringify(data) }),
  assignDiet: (data: any) =>
    apiRequest('/diets/assign', { method: 'POST', body: JSON.stringify(data) }),

  // Enquiries
  getEnquiries: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/enquiries?${qs}`);
  },
  updateEnquiryStatus: (id: string, data: any) =>
    apiRequest(`/enquiries/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  convertEnquiryToCustomer: (id: string, additionalData: any = {}) =>
    apiRequest(`/enquiries/${id}/convert`, { method: 'POST', body: JSON.stringify(additionalData) }),

  // Expenses
  getExpenses: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/expenses?${qs}`);
  },
  createExpense: (data: any) =>
    apiRequest('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  deleteExpense: (id: string) =>
    apiRequest(`/expenses/${id}`, { method: 'DELETE' }),

  // Reports
  getDashboardSummary: () =>
    apiRequest('/reports/dashboard-summary'),
  getFinancialReport: (startDate?: string, endDate?: string) =>
    apiRequest(`/reports/financial?startDate=${startDate || ''}&endDate=${endDate || ''}`),

  // Settings
  getSettings: () =>
    apiRequest('/content/settings'),
  updateSettings: (data: any) =>
    apiRequest('/content/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Portals
  getCustomerPortalMe: () =>
    apiRequest('/portal/customer/me'),
  getTrainerPortalMe: () =>
    apiRequest('/portal/trainer/me'),
};
