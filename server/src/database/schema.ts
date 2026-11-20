import { db } from './db.js';

export function initializeSchema(): void {
  const schemaSql = `
    -- Users table for Authentication (Roles: superadmin, admin, trainer, customer)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('superadmin', 'admin', 'trainer', 'customer')),
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      avatar_url TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Trainers table
    CREATE TABLE IF NOT EXISTS trainers (
      id TEXT PRIMARY KEY,
      trainer_code TEXT UNIQUE NOT NULL,
      user_id TEXT UNIQUE,
      full_name TEXT NOT NULL,
      profile_image TEXT,
      mobile_number TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      gender TEXT,
      date_of_birth DATE,
      specialization TEXT NOT NULL,
      qualifications TEXT,
      experience TEXT NOT NULL,
      joining_date DATE DEFAULT (DATE('now')),
      salary REAL DEFAULT 0,
      employment_type TEXT DEFAULT 'Full-time' CHECK(employment_type IN ('Full-time', 'Part-time', 'Contract')),
      availability TEXT,
      assigned_programs TEXT,
      description TEXT,
      social_links TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Membership Plans
    CREATE TABLE IF NOT EXISTS membership_plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      price REAL NOT NULL,
      duration_months INTEGER NOT NULL,
      duration_days INTEGER NOT NULL,
      description TEXT,
      benefits TEXT NOT NULL,
      features TEXT NOT NULL,
      discount_percentage REAL DEFAULT 0,
      joining_fee REAL DEFAULT 0,
      renewal_rules TEXT,
      is_active INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Customers table
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      customer_code TEXT UNIQUE NOT NULL,
      user_id TEXT UNIQUE,
      full_name TEXT NOT NULL,
      profile_photo TEXT,
      gender TEXT NOT NULL,
      date_of_birth DATE NOT NULL,
      mobile_number TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      address TEXT NOT NULL,
      emergency_contact TEXT NOT NULL,
      joining_date DATE NOT NULL,
      height REAL,
      weight REAL,
      blood_group TEXT,
      medical_notes TEXT,
      assigned_trainer_id TEXT,
      membership_plan_id TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'pending', 'suspended')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (assigned_trainer_id) REFERENCES trainers(id) ON DELETE SET NULL,
      FOREIGN KEY (membership_plan_id) REFERENCES membership_plans(id) ON DELETE SET NULL
    );

    -- Customer Memberships (Lifecycle: pending, approved, active, expiring_soon, expired, suspended, cancelled)
    CREATE TABLE IF NOT EXISTS customer_memberships (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      duration_months INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      paid_amount REAL DEFAULT 0,
      pending_amount REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('paid', 'partial', 'pending')),
      status TEXT DEFAULT 'active' CHECK(status IN ('pending', 'approved', 'active', 'expiring_soon', 'expired', 'suspended', 'cancelled')),
      approval_status TEXT DEFAULT 'approved' CHECK(approval_status IN ('pending', 'approved', 'rejected')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE RESTRICT
    );

    -- Membership Applications (from Public Join Now or Admin)
    CREATE TABLE IF NOT EXISTS membership_applications (
      id TEXT PRIMARY KEY,
      application_code TEXT UNIQUE NOT NULL,
      customer_id TEXT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      mobile_number TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_by TEXT,
      reviewed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
      FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE RESTRICT
    );

    -- Payments & Invoices
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      receipt_number TEXT UNIQUE NOT NULL,
      customer_id TEXT NOT NULL,
      customer_membership_id TEXT,
      total_amount REAL NOT NULL,
      paid_amount REAL NOT NULL,
      pending_amount REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      payment_method TEXT NOT NULL CHECK(payment_method IN ('Cash', 'UPI', 'Card', 'Bank Transfer', 'Online Payment')),
      payment_date DATE NOT NULL,
      transaction_ref TEXT,
      notes TEXT,
      status TEXT DEFAULT 'completed' CHECK(status IN ('completed', 'partial', 'refunded')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
      FOREIGN KEY (customer_membership_id) REFERENCES customer_memberships(id) ON DELETE SET NULL
    );

    -- Attendance (Customers & Trainers)
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL CHECK(entity_type IN ('customer', 'trainer')),
      customer_id TEXT,
      trainer_id TEXT,
      attendance_date DATE NOT NULL,
      check_in_time DATETIME NOT NULL,
      check_out_time DATETIME,
      status TEXT DEFAULT 'present' CHECK(status IN ('present', 'absent', 'late')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE
    );

    -- Workout Plans
    CREATE TABLE IF NOT EXISTS workout_plans (
      id TEXT PRIMARY KEY,
      plan_name TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Strength', 'Weight Loss', 'Muscle Building', 'Cardio', 'CrossFit', 'Functional')),
      difficulty TEXT NOT NULL CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
      duration_weeks INTEGER DEFAULT 4,
      description TEXT,
      created_by_trainer_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by_trainer_id) REFERENCES trainers(id) ON DELETE SET NULL
    );

    -- Exercises within Workout Plans
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      workout_plan_id TEXT NOT NULL,
      day_of_week TEXT NOT NULL CHECK(day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
      exercise_name TEXT NOT NULL,
      sets INTEGER NOT NULL,
      reps TEXT NOT NULL,
      weight_target TEXT,
      rest_seconds INTEGER DEFAULT 60,
      notes TEXT,
      display_order INTEGER DEFAULT 1,
      FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE
    );

    -- Workout Assignments to Customers
    CREATE TABLE IF NOT EXISTS workout_assignments (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      workout_plan_id TEXT NOT NULL,
      assigned_by_trainer_id TEXT,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'paused')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_by_trainer_id) REFERENCES trainers(id) ON DELETE SET NULL
    );

    -- Diet Plans
    CREATE TABLE IF NOT EXISTS diet_plans (
      id TEXT PRIMARY KEY,
      plan_name TEXT NOT NULL,
      goal TEXT NOT NULL CHECK(goal IN ('Weight Loss', 'Muscle Gain', 'Maintenance', 'Keto', 'Athletic')),
      target_calories INTEGER NOT NULL,
      protein_grams INTEGER NOT NULL,
      carbs_grams INTEGER NOT NULL,
      fats_grams INTEGER NOT NULL,
      water_liters REAL DEFAULT 3.0,
      breakfast TEXT NOT NULL,
      lunch TEXT NOT NULL,
      dinner TEXT NOT NULL,
      snacks TEXT,
      dietary_notes TEXT,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Diet Assignments to Customers
    CREATE TABLE IF NOT EXISTS diet_assignments (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      diet_plan_id TEXT NOT NULL,
      assigned_by TEXT,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      FOREIGN KEY (diet_plan_id) REFERENCES diet_plans(id) ON DELETE RESTRICT
    );

    -- Customer Progress (Weight, BMI, Body Measurements)
    CREATE TABLE IF NOT EXISTS customer_progress (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      recorded_date DATE NOT NULL,
      weight_kg REAL NOT NULL,
      height_cm REAL,
      bmi REAL,
      chest_cm REAL,
      waist_cm REAL,
      hips_cm REAL,
      arms_cm REAL,
      body_fat_percentage REAL,
      notes TEXT,
      recorded_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    -- Enquiries & Leads (Website forms, Join Now, Contact, Walk-ins)
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      enquiry_code TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      program_interest TEXT,
      source TEXT DEFAULT 'Contact Form' CHECK(source IN ('Join Now', 'Contact Form', 'Walk-in', 'Book Session')),
      message TEXT,
      status TEXT DEFAULT 'New' CHECK(status IN ('New', 'Contacted', 'Interested', 'Follow-Up', 'Converted', 'Not Interested')),
      follow_up_date DATE,
      notes TEXT,
      converted_customer_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (converted_customer_id) REFERENCES customers(id) ON DELETE SET NULL
    );

    -- Expenses Management
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      expense_date DATE NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Rent', 'Electricity', 'Equipment', 'Trainer Salary', 'Maintenance', 'Marketing', 'Other Expenses')),
      amount REAL NOT NULL,
      description TEXT NOT NULL,
      payment_method TEXT DEFAULT 'Bank Transfer',
      receipt_attachment TEXT,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Public Services
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT NOT NULL,
      icon TEXT NOT NULL,
      image_url TEXT NOT NULL,
      category TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 1
    );

    -- Public Programs
    CREATE TABLE IF NOT EXISTS programs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      duration TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      trainer_name TEXT NOT NULL,
      image_url TEXT NOT NULL,
      benefits TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 1
    );

    -- Public Fitness Classes
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      trainer_id TEXT,
      trainer_name TEXT NOT NULL,
      schedule_info TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 60,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL
    );

    -- Testimonials
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_image TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      membership_type TEXT NOT NULL,
      review TEXT NOT NULL,
      is_featured INTEGER DEFAULT 1,
      is_approved INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Gallery
    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Interior', 'Equipment', 'Training', 'Trainers', 'Events')),
      image_url TEXT NOT NULL,
      display_order INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Newsletter Subscribers
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1
    );

    -- Gym Global Settings
    CREATE TABLE IF NOT EXISTS gym_settings (
      id TEXT PRIMARY KEY,
      gym_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      opening_hours TEXT NOT NULL,
      logo_url TEXT,
      social_instagram TEXT,
      social_facebook TEXT,
      social_youtube TEXT,
      stats_members INTEGER DEFAULT 2500,
      stats_trainers INTEGER DEFAULT 45,
      stats_equipment INTEGER DEFAULT 120,
      stats_programs INTEGER DEFAULT 35,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(customer_code);
    CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile_number);
    CREATE INDEX IF NOT EXISTS idx_trainers_code ON trainers(trainer_code);
    CREATE INDEX IF NOT EXISTS idx_customer_memberships_cust ON customer_memberships(customer_id);
    CREATE INDEX IF NOT EXISTS idx_customer_memberships_status ON customer_memberships(status);
    CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);
    CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
    CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
  `;

  db.exec(schemaSql);
  console.log('✓ SQLite Database schema initialized successfully with all tables & indexes.');
}
