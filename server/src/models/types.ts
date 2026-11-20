export type UserRole = 'superadmin' | 'admin' | 'trainer' | 'customer';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration_months: number;
  duration_days: number;
  description?: string;
  benefits: string; // JSON string array
  features: string; // JSON string array
  discount_percentage: number;
  joining_fee: number;
  renewal_rules?: string;
  is_active: number;
  is_featured: number;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;

  // Joined fields
  trainer_name?: string;
  plan_name?: string;
}

export interface CustomerMembership {
  id: string;
  customer_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  discount_amount: number;
  payment_status: 'paid' | 'partial' | 'pending';
  status: 'pending' | 'approved' | 'active' | 'expiring_soon' | 'expired' | 'suspended' | 'cancelled';
  approval_status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;

  // Joined
  plan_name?: string;
  customer_name?: string;
  customer_code?: string;
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
  created_at: string;

  // Joined
  customer_name?: string;
  customer_code?: string;
  plan_name?: string;
}

export interface Attendance {
  id: string;
  entity_type: 'customer' | 'trainer';
  customer_id?: string;
  trainer_id?: string;
  attendance_date: string;
  check_in_time: string;
  check_out_time?: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
  created_at: string;

  // Joined
  person_name?: string;
  person_code?: string;
}

export interface WorkoutPlan {
  id: string;
  plan_name: string;
  category: 'Strength' | 'Weight Loss' | 'Muscle Building' | 'Cardio' | 'CrossFit' | 'Functional';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_weeks: number;
  description?: string;
  created_by_trainer_id?: string;
  created_at: string;
  updated_at: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  workout_plan_id: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
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
  goal: 'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Keto' | 'Athletic';
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
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  enquiry_code: string;
  full_name: string;
  email: string;
  phone: string;
  program_interest?: string;
  source: 'Join Now' | 'Contact Form' | 'Walk-in' | 'Book Session';
  message?: string;
  status: 'New' | 'Contacted' | 'Interested' | 'Follow-Up' | 'Converted' | 'Not Interested';
  follow_up_date?: string;
  notes?: string;
  converted_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  expense_date: string;
  category: 'Rent' | 'Electricity' | 'Equipment' | 'Trainer Salary' | 'Maintenance' | 'Marketing' | 'Other Expenses';
  amount: number;
  description: string;
  payment_method: string;
  receipt_attachment?: string;
  created_by?: string;
  created_at: string;
}
