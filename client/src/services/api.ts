const API_BASE = '/api';

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('apex_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
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
