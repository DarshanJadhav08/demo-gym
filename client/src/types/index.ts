export type UserRole = 'superadmin' | 'admin' | 'trainer' | 'customer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'suspended';
  customer_id?: string;
  trainer_id?: string;
}

export interface Trainer {
  id: string;
  trainer_code: string;
  user_id?: string;
  full_name: string;
  profile_image?: string;
  mobile_number: string;
  email: string;
  gender?: string;
  date_of_birth?: string;
  specialization: string;
  qualifications?: string;
  experience: string;
  joining_date: string;
  salary: number;
  employment_type: 'Full-time' | 'Part-time' | 'Contract';
  availability?: string;
  assigned_programs?: string;
  description?: string;
  social_links?: string;
  status: 'active' | 'inactive';
  clients?: any[];
  classes?: any[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration_months: number;
  duration_days: number;
  description?: string;
  benefits: string; // JSON string or array
  features: string;
  discount_percentage: number;
  joining_fee: number;
  renewal_rules?: string;
  is_active: number;
  is_featured: number;
}

export interface Customer {
  id: string;
  customer_code: string;
  user_id?: string;
  full_name: string;
  profile_photo?: string;
  gender: string;
  date_of_birth: string;
  mobile_number: string;
  email: string;
  address: string;
  emergency_contact: string;
  joining_date: string;
  height?: number;
  weight?: number;
  blood_group?: string;
  medical_notes?: string;
  assigned_trainer_id?: string;
  membership_plan_id?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  trainer_name?: string;
  plan_name?: string;
  membership_status?: string;
  membership_end_date?: string;
  outstanding_balance?: number;
  memberships?: any[];
  payments?: any[];
  attendance?: any[];
  workouts?: any[];
  diets?: any[];
  progress?: any[];
}

export interface Payment {
  id: string;
  receipt_number: string;
  customer_id: string;
  customer_membership_id?: string;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  discount_amount: number;
  payment_method: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Online Payment';
  payment_date: string;
  transaction_ref?: string;
  notes?: string;
  status: 'completed' | 'partial' | 'refunded';
  customer_name?: string;
  customer_code?: string;
  customer_address?: string;
  plan_name?: string;
  duration_months?: number;
}

export interface AttendanceRecord {
  id: string;
  entity_type: 'customer' | 'trainer';
  customer_id?: string;
  trainer_id?: string;
  attendance_date: string;
  check_in_time: string;
  check_out_time?: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
  person_name?: string;
  person_code?: string;
  photo?: string;
}

export interface WorkoutPlan {
  id: string;
  plan_name: string;
  category: string;
  difficulty: string;
  duration_weeks: number;
  description?: string;
  created_by_trainer_id?: string;
  trainer_name?: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  workout_plan_id: string;
  day_of_week: string;
  exercise_name: string;
  sets: number;
  reps: string;
  weight_target?: string;
  rest_seconds: number;
  notes?: string;
  display_order: number;
}

export interface DietPlan {
  id: string;
  plan_name: string;
  goal: string;
  target_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  water_liters: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks?: string;
  dietary_notes?: string;
}

export interface Enquiry {
  id: string;
  enquiry_code: string;
  full_name: string;
  email: string;
  phone: string;
  program_interest?: string;
  source: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Interested' | 'Follow-Up' | 'Converted' | 'Not Interested';
  follow_up_date?: string;
  notes?: string;
  converted_customer_id?: string;
  created_at: string;
}

export interface Expense {
  id: string;
  expense_date: string;
  category: string;
  amount: number;
  description: string;
  payment_method: string;
  created_by?: string;
}

export interface GymSettings {
  gym_name: string;
  phone: string;
  email: string;
  address: string;
  opening_hours: string;
  logo_url?: string;
  social_instagram?: string;
  social_facebook?: string;
  social_youtube?: string;
  stats_members: number;
  stats_trainers: number;
  stats_equipment: number;
  stats_programs: number;
}
