import {
  MOCK_CUSTOMERS,
  MOCK_TRAINERS,
  MOCK_PLANS,
  MOCK_PAYMENTS,
  MOCK_APPLICATIONS,
  MOCK_CUSTOMER_MEMBERSHIPS,
  MOCK_ATTENDANCE_DATA,
  MOCK_WORKOUTS,
  MOCK_DIETS,
  MOCK_ENQUIRIES,
  MOCK_EXPENSES,
  MOCK_DASHBOARD_SUMMARY,
  MOCK_FINANCIAL_REPORT,
  MOCK_SETTINGS,
} from './mockData';

const API_BASE = '/api';

// In-memory demo state that supports adding/updating during a demo session
let localCustomers = [...MOCK_CUSTOMERS];
let localTrainers = [...MOCK_TRAINERS];
let localPlans = [...MOCK_PLANS];
let localPayments = [...MOCK_PAYMENTS];
let localAttendance = { ...MOCK_ATTENDANCE_DATA, records: [...MOCK_ATTENDANCE_DATA.records] };
let localWorkouts = [...MOCK_WORKOUTS];
let localDiets = [...MOCK_DIETS];
let localEnquiries = [...MOCK_ENQUIRIES];
let localExpenses = [...MOCK_EXPENSES];
let localSettings = { ...MOCK_SETTINGS };
let localApplications = [...MOCK_APPLICATIONS];
let localCustomerMemberships = [...MOCK_CUSTOMER_MEMBERSHIPS];

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('apex_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 1. Try real backend first if available
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
    // Network / backend unavailable -> proceed to rich demo mock fallback
  }

  // 2. Comprehensive Demo Mock Fallback (Guaranteed to return the exact data structure expected by every page)
  return getMockEndpointData(endpoint, options) as T;
}

function getMockEndpointData(endpoint: string, options: RequestInit = {}): any {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};

  // Auth Endpoints
  if (endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register')) {
    const userRole = (body.email || '').includes('trainer')
      ? 'trainer'
      : (body.email || '').includes('customer') || (body.email || '').includes('member')
      ? 'customer'
      : 'admin';

    const userObj = {
      id: 'usr_demo_' + userRole,
      username: userRole,
      email: body.email || `${userRole}@gymdemo.com`,
      role: userRole,
      first_name: userRole === 'admin' ? 'Demo' : userRole === 'trainer' ? 'Alex' : 'Marcus',
      last_name: userRole === 'admin' ? 'Admin' : userRole === 'trainer' ? 'Vance' : 'Reeves',
      status: 'active',
    };
    return { token: 'demo_token_' + userRole, user: userObj };
  }

  if (endpoint.startsWith('/auth/me')) {
    const saved = localStorage.getItem('apex_user');
    return {
      user: saved
        ? JSON.parse(saved)
        : {
            id: 'usr_demo_admin',
            username: 'admin',
            email: 'admin@gymdemo.com',
            role: 'admin',
            first_name: 'Demo',
            last_name: 'Admin',
            status: 'active',
          },
    };
  }

  // Dashboard Summary (Admin Dashboard)
  if (endpoint.startsWith('/reports/dashboard-summary')) {
    return MOCK_DASHBOARD_SUMMARY;
  }

  // Financial Report
  if (endpoint.startsWith('/reports/financial')) {
    return MOCK_FINANCIAL_REPORT;
  }

  // Customers Management (/admin/customers)
  if (endpoint.startsWith('/customers')) {
    if (method === 'POST') {
      const newCust = {
        ...body,
        id: 'cust_' + (localCustomers.length + 1),
        customer_code: 'MEM-' + String(localCustomers.length + 1).padStart(3, '0'),
        trainer_name: localTrainers.find((t) => t.id === body.assigned_trainer_id)?.full_name || 'Alex Vance',
        plan_name: localPlans.find((p) => p.id === body.membership_plan_id)?.name || 'Elite Annual VIP',
        membership_status: 'active',
        membership_end_date: '2027-11-20',
        outstanding_balance: 0,
      };
      localCustomers.unshift(newCust);
      return newCust;
    }

    // Single customer detail by ID: /customers/:id
    const idMatch = endpoint.match(/\/customers\/([^?]+)/);
    if (idMatch && idMatch[1] && !endpoint.includes('?')) {
      const targetId = idMatch[1];
      const found = localCustomers.find((c) => c.id === targetId || c.customer_code === targetId);
      if (found) {
        return {
          ...found,
          memberships: found.memberships || localCustomerMemberships.slice(0, 2),
          payments: found.payments || localPayments.slice(0, 3),
          attendance: found.attendance || localAttendance.records.slice(0, 4),
          workouts: found.workouts || localWorkouts.slice(0, 1),
          diets: found.diets || localDiets.slice(0, 1),
        };
      }
      return localCustomers[0];
    }

    // List of customers: expects { customers: [...], total: ... }
    return {
      customers: localCustomers,
      total: localCustomers.length,
    };
  }

  // Trainers Management (/admin/trainers) -> EXPECTS ARRAY!
  if (endpoint.startsWith('/trainers')) {
    if (method === 'POST') {
      const newTrn = {
        ...body,
        id: 'trn_' + (localTrainers.length + 1),
        trainer_code: 'TRN-' + String(localTrainers.length + 1).padStart(3, '0'),
        joining_date: new Date().toISOString().split('T')[0],
      };
      localTrainers.push(newTrn);
      return newTrn;
    }

    const idMatch = endpoint.match(/\/trainers\/([^?]+)/);
    if (idMatch && idMatch[1] && !endpoint.includes('?')) {
      return localTrainers.find((t) => t.id === idMatch[1]) || localTrainers[0];
    }

    return localTrainers; // Return ARRAY directly
  }

  // Memberships Management (/admin/memberships) -> EXPECTS ARRAYS!
  if (endpoint.startsWith('/memberships/plans')) {
    if (method === 'POST') {
      const newPlan = {
        ...body,
        id: 'plan_' + (localPlans.length + 1),
        slug: (body.name || 'new-plan').toLowerCase().replace(/\s+/g, '-'),
        duration_days: (body.duration_months || 1) * 30,
        benefits: JSON.stringify(body.benefits || ['Gym Access']),
        features: JSON.stringify(body.features || ['Full Access']),
        discount_percentage: 0,
        joining_fee: 0,
        is_active: 1,
        is_featured: 0,
      };
      localPlans.push(newPlan);
      return newPlan;
    }
    return localPlans; // Return ARRAY directly
  }

  if (endpoint.startsWith('/memberships/applications')) {
    if (endpoint.includes('/review') && method === 'PUT') {
      return { success: true, message: 'Application reviewed' };
    }
    return localApplications; // Return ARRAY directly
  }

  if (endpoint.startsWith('/memberships/customer-memberships')) {
    return localCustomerMemberships; // Return ARRAY directly
  }

  if (endpoint.startsWith('/memberships/assign')) {
    return { success: true, message: 'Membership assigned' };
  }

  // Payments Management (/admin/payments) -> EXPECTS ARRAY!
  if (endpoint.startsWith('/payments')) {
    if (method === 'POST') {
      const newPayment = {
        ...body,
        id: 'pay_' + (localPayments.length + 1),
        receipt_number: 'RCP-' + (1050 + localPayments.length),
        payment_date: new Date().toLocaleString(),
        status: 'completed',
        customer_name: localCustomers.find((c) => c.id === body.customer_id)?.full_name || 'Marcus Reeves',
        plan_name: 'Gym Package',
      };
      localPayments.unshift(newPayment);
      return newPayment;
    }
    return localPayments; // Return ARRAY directly
  }

  // Attendance Management (/admin/attendance)
  if (endpoint.startsWith('/attendance/today')) {
    return localAttendance; // Returns { records: [...], stats: {...} }
  }

  if (endpoint.startsWith('/attendance/history')) {
    return localAttendance.records; // Returns ARRAY
  }

  if (endpoint.startsWith('/attendance/check-in')) {
    const person =
      body.entity_type === 'trainer'
        ? localTrainers.find((t) => t.id === body.trainer_id)
        : localCustomers.find((c) => c.id === body.customer_id);

    const newRecord = {
      id: 'att_' + (localAttendance.records.length + 1),
      entity_type: body.entity_type || 'customer',
      person_name: person ? person.full_name : 'Customer Member',
      person_code: (person as any)?.customer_code || (person as any)?.trainer_code || 'MEM-009',
      attendance_date: new Date().toISOString().split('T')[0],
      check_in_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      check_out_time: null,
      status: 'present',
      notes: body.notes || 'Workout Session',
    };
    localAttendance.records.unshift(newRecord);
    localAttendance.stats.presentCount += 1;
    return newRecord;
  }

  if (endpoint.startsWith('/attendance/check-out')) {
    return { success: true, message: 'Checked out successfully' };
  }

  // Workouts Management (/admin/workouts) -> EXPECTS ARRAY!
  if (endpoint.startsWith('/workouts')) {
    if (method === 'POST') {
      const newW = {
        id: 'w_' + (localWorkouts.length + 1),
        plan_name: body.plan?.plan_name || 'Custom Workout Plan',
        category: body.plan?.category || 'Strength Training',
        difficulty: body.plan?.difficulty || 'Intermediate',
        duration_weeks: body.plan?.duration_weeks || 8,
        description: body.plan?.description || 'Custom coach programming.',
        trainer_name: 'Alex Vance',
        exercises: body.exercises || [],
      };
      localWorkouts.push(newW);
      return newW;
    }
    return localWorkouts; // Return ARRAY directly
  }

  // Diets Management (/admin/diets) -> EXPECTS ARRAY!
  if (endpoint.startsWith('/diets')) {
    if (method === 'POST') {
      const newD = {
        ...body,
        id: 'd_' + (localDiets.length + 1),
      };
      localDiets.push(newD);
      return newD;
    }
    return localDiets; // Return ARRAY directly
  }

  // Enquiries Management (/admin/enquiries) -> EXPECTS ARRAY!
  if (endpoint.startsWith('/enquiries')) {
    if (endpoint.includes('/status') && method === 'PUT') {
      return { success: true, message: 'Status updated' };
    }
    if (endpoint.includes('/convert') && method === 'POST') {
      return { success: true, message: 'Enquiry converted to customer' };
    }
    return localEnquiries; // Return ARRAY directly
  }

  // Expenses Management (/admin/expenses) -> EXPECTS ARRAY!
  if (endpoint.startsWith('/expenses')) {
    if (method === 'POST') {
      const newExp = {
        ...body,
        id: 'exp_' + (localExpenses.length + 1),
        created_by: 'Admin',
      };
      localExpenses.unshift(newExp);
      return newExp;
    }
    return localExpenses; // Return ARRAY directly
  }

  // Gym Settings (/admin/settings)
  if (endpoint.startsWith('/content/settings')) {
    if (method === 'PUT') {
      localSettings = { ...localSettings, ...body };
      return localSettings;
    }
    return localSettings;
  }

  // Public Home Data
  if (endpoint.startsWith('/content/home-data')) {
    return {
      trainers: localTrainers,
      plans: localPlans,
      programs: [
        { id: 'prog_1', title: 'Hypertrophy & Bodybuilding', duration: '12 Weeks', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600' },
        { id: 'prog_2', title: 'Olympic Weightlifting', duration: '8 Weeks', level: 'Advanced', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600' },
        { id: 'prog_3', title: 'Functional HIIT & Stamina', duration: '6 Weeks', level: 'All Levels', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600' },
      ],
      testimonials: [
        { id: 'test_1', name: 'Marcus Reeves', role: 'Executive & Athlete', rating: 5, comment: 'Best fitness atmosphere and equipment in town. Transformed my physique in 6 months.' },
        { id: 'test_2', name: 'Elena Rostova', role: 'Fitness Enthusiast', rating: 5, comment: 'Trainers are certified, knowledgeable, and the facilities are world-class.' },
      ],
      settings: localSettings,
    };
  }

  // Customer Portal
  if (endpoint.startsWith('/portal/customer/me')) {
    return {
      customer: localCustomers[0],
      activeMembership: localCustomerMemberships[0],
      qrPass: 'DEMOFIT-MEM-001',
      recentAttendance: localAttendance.records.slice(0, 5),
      activeWorkout: localWorkouts[0],
      activeDiet: localDiets[0],
      paymentHistory: localPayments.slice(0, 2),
    };
  }

  // Trainer Portal
  if (endpoint.startsWith('/portal/trainer/me')) {
    return {
      trainer: localTrainers[0],
      assignedClients: localCustomers.slice(0, 3),
      todaySchedule: [
        { time: '07:00 AM', client: 'Marcus Reeves', type: '1-on-1 Hypertrophy', status: 'completed' },
        { time: '09:00 AM', client: 'David Chen', type: 'Strength Conditioning', status: 'upcoming' },
        { time: '11:00 AM', client: 'Floor Coaching', type: 'Gym Floor Duty', status: 'upcoming' },
      ],
      stats: {
        totalClients: 18,
        activeWorkouts: 12,
        dietsAssigned: 15,
      },
    };
  }

  return [];
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
