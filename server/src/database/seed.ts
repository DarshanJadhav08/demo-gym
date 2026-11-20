import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { initializeSchema } from './schema.js';
import { generateId, generateCode, generateReceiptNumber } from '../utils/idGenerator.js';

export function runSeed(): void {
  initializeSchema();

  console.log('Clearing existing data for fresh seed...');
  // Disable foreign keys temporarily during reseed
  db.exec('PRAGMA foreign_keys = OFF;');
  const tables = [
    'users', 'trainers', 'membership_plans', 'customers', 'customer_memberships',
    'membership_applications', 'payments', 'attendance', 'workout_plans', 'exercises',
    'workout_assignments', 'diet_plans', 'diet_assignments', 'customer_progress',
    'enquiries', 'expenses', 'services', 'programs', 'classes', 'testimonials',
    'gallery', 'newsletter_subscribers', 'gym_settings', 'audit_logs'
  ];
  for (const table of tables) {
    db.exec(`DELETE FROM ${table};`);
  }
  db.exec('PRAGMA foreign_keys = ON;');

  console.log('Seeding initial data...');

  const passwordHashAdmin = bcrypt.hashSync('Admin@12345', 10);
  const passwordHashTrainer = bcrypt.hashSync('Trainer@12345', 10);
  const passwordHashCustomer = bcrypt.hashSync('Customer@12345', 10);

  // 1. Seed Users (Superadmin, Admin, Trainer, Customer)
  const adminUserId = generateId('usr');
  const trainerUserId1 = generateId('usr');
  const trainerUserId2 = generateId('usr');
  const customerUserId1 = generateId('usr');
  const customerUserId2 = generateId('usr');

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, email, password_hash, role, first_name, last_name, phone, avatar_url, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Demo Admin
  insertUser.run(
    adminUserId,
    'admin',
    'admin@gymdemo.com',
    passwordHashAdmin,
    'superadmin',
    'Demo',
    'Administrator',
    '+91 99999 00001',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    'active'
  );

  // Alias for backward compatibility
  insertUser.run(
    generateId('usr'),
    'admin_alias',
    'admin@apexelite.com',
    passwordHashAdmin,
    'superadmin',
    'Demo',
    'Admin (Apex)',
    '+91 99999 00001',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    'active'
  );

  // Demo Trainer 1
  insertUser.run(
    trainerUserId1,
    'trainer',
    'trainer@gymdemo.com',
    passwordHashTrainer,
    'trainer',
    'Alex',
    'Rivera (Demo Coach)',
    '+91 99999 00002',
    'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=400',
    'active'
  );

  // Alias for backward compatibility
  insertUser.run(
    generateId('usr'),
    'marcus_alias',
    'marcus@apexelite.com',
    passwordHashTrainer,
    'trainer',
    'Alex',
    'Rivera (Demo)',
    '+91 99999 00002',
    'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=400',
    'active'
  );

  // Demo Trainer 2
  insertUser.run(
    trainerUserId2,
    'elena',
    'elena@gymdemo.com',
    passwordHashTrainer,
    'trainer',
    'Elena',
    'Vance (Demo Coach)',
    '+91 99999 00003',
    'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=400',
    'active'
  );

  // Demo Customer 1
  insertUser.run(
    customerUserId1,
    'member',
    'member@gymdemo.com',
    passwordHashCustomer,
    'customer',
    'John',
    'Doe (Demo Member)',
    '+91 99999 00004',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    'active'
  );

  // Alias for backward compatibility
  insertUser.run(
    generateId('usr'),
    'alex_alias',
    'alex@apexelite.com',
    passwordHashCustomer,
    'customer',
    'John',
    'Doe (Demo)',
    '+91 99999 00004',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    'active'
  );

  // Demo Customer 2
  insertUser.run(
    customerUserId2,
    'sarah',
    'sarah@gymdemo.com',
    passwordHashCustomer,
    'customer',
    'Sarah',
    'Jenkins (Demo Member)',
    '+91 99999 00005',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    'active'
  );

  // 2. Seed Trainers
  const trainerId1 = generateId('trn');
  const trainerId2 = generateId('trn');
  const trainerId3 = generateId('trn');
  const trainerId4 = generateId('trn');

  const insertTrainer = db.prepare(`
    INSERT INTO trainers (id, trainer_code, user_id, full_name, profile_image, mobile_number, email, gender, date_of_birth, specialization, qualifications, experience, salary, employment_type, availability, assigned_programs, description, social_links, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTrainer.run(
    trainerId1,
    'TRN-DEMO-001',
    trainerUserId1,
    'Alex Rivera (Demo Coach)',
    'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=800',
    '+91 99999 00002',
    'trainer@gymdemo.com',
    'Male',
    '1990-06-15',
    'Powerlifting & Hypertrophy',
    'CSCS, ISSA Master Trainer, Certified Strength Specialist',
    '10 Years',
    85000,
    'Full-time',
    'Mon-Sat: 06:00 AM - 02:00 PM',
    JSON.stringify(['Strength Training', 'Bodybuilding', 'Muscle Building']),
    'Specializes in heavy barbell training, biomechanics, and rapid strength progression for demo athletes.',
    JSON.stringify({ instagram: 'https://instagram.com', youtube: 'https://youtube.com' }),
    'active'
  );

  insertTrainer.run(
    trainerId2,
    'TRN-DEMO-002',
    trainerUserId2,
    'Elena Vance (Demo Coach)',
    'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800',
    '+91 99999 00003',
    'elena@gymdemo.com',
    'Female',
    '1992-04-20',
    'Cross Training & Olympic Lifting',
    'USAW Level 2, CrossFit L3 Coach, Sports Science B.Sc.',
    '8 Years',
    75000,
    'Full-time',
    'Mon-Fri: 01:00 PM - 09:00 PM',
    JSON.stringify(["Women's Fitness", 'Cross Training', 'Functional Training']),
    'Passionate about empowering members through athletic conditioning and Olympic lifting.',
    JSON.stringify({ instagram: 'https://instagram.com' }),
    'active'
  );

  insertTrainer.run(
    trainerId3,
    'TRN-DEMO-003',
    null,
    'David Chen (Demo Coach)',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    '+91 99999 00004',
    'david@gymdemo.com',
    'Male',
    '1991-11-12',
    'Body Recomposition & Calisthenics',
    'NASM-CPT, Precision Nutrition L1',
    '7 Years',
    70000,
    'Full-time',
    'Tue-Sun: 07:00 AM - 03:00 PM',
    JSON.stringify(['Personal Training', 'Weight Loss', 'Fitness Assessment']),
    'Focuses on fat loss, muscle sculpting, and sustainable dietary transformation for demo clients.',
    JSON.stringify({ instagram: 'https://instagram.com' }),
    'active'
  );

  insertTrainer.run(
    trainerId4,
    'TRN-DEMO-004',
    null,
    'Sophia Williams (Demo Coach)',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
    '+91 99999 00005',
    'sophia@gymdemo.com',
    'Female',
    '1994-08-30',
    'Yoga & Mobility Restoration',
    'ERYT-500 Certified Yoga Master, Functional Range Conditioning (FRC)',
    '6 Years',
    60000,
    'Part-time',
    'Mon, Wed, Fri: 06:00 AM - 11:00 AM',
    JSON.stringify(['Yoga', 'Mobility', 'Core Training']),
    'Integrates breathwork, deep flexibility, and joint longevity for heavy lifters.',
    JSON.stringify({ instagram: 'https://instagram.com' }),
    'active'
  );

  // 3. Seed Membership Plans
  const planId1 = generateId('pln');
  const planId2 = generateId('pln');
  const planId3 = generateId('pln');
  const planId4 = generateId('pln');
  const planId5 = generateId('pln');

  const insertPlan = db.prepare(`
    INSERT INTO membership_plans (id, name, slug, price, duration_months, duration_days, description, benefits, features, discount_percentage, joining_fee, renewal_rules, is_active, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPlan.run(
    planId1,
    'Bronze Fitness',
    'bronze-fitness',
    49,
    1,
    30,
    'Perfect entry-level access for fitness enthusiasts.',
    JSON.stringify(['3 Days a Week Access', 'Standard Locker Room Access', 'General Fitness Assessment', 'Free Water & Towel Service']),
    JSON.stringify(['Cardio Floor Access', 'Free Weights Area', 'Basic App Tracking']),
    0,
    15,
    'Renew within 5 days of expiry for 10% discount on next term.',
    1,
    0
  );

  insertPlan.run(
    planId2,
    'Silver Strength',
    'silver-strength',
    129,
    3,
    90,
    'The ideal 90-day transformation plan for committed lifters.',
    JSON.stringify(['Full 7-Day Gym Access', 'Dedicated Trainer Allocation', 'Customized Workout Routine', 'Steam & Sauna Access', 'Discount on Gym Merchandise']),
    JSON.stringify(['All Equipment Access', 'Group Class Participation', 'Monthly Body Composition Scan', 'Dedicated Trainer']),
    10,
    0,
    'Auto-renewal eligible with free personal training session.',
    1,
    1
  );

  insertPlan.run(
    planId3,
    'Gold Power',
    'gold-power',
    229,
    6,
    180,
    'Comprehensive 6-month elite fitness and bodybuilding membership.',
    JSON.stringify(['Unlimited 24/7 Access', 'Senior Trainer Consultations', 'Personalized Diet Chart', 'Sauna, Steam & Ice Bath', 'Guest Passes (2 per month)', 'Free Protein Shake on Weekends']),
    JSON.stringify(['24/7 Biometric Entry', 'Diet & Nutrition Plan', 'Olympic Lifting Zone', 'Quarterly Progress Review']),
    15,
    0,
    'Guaranteed price lock for renewals.',
    1,
    0
  );

  insertPlan.run(
    planId4,
    'Apex Black VIP',
    'apex-black-vip',
    399,
    12,
    365,
    'Our most prestigious annual package with all-inclusive VIP privileges.',
    JSON.stringify(['Unrestricted All-Zone Access', 'Dedicated Master Trainer', 'Full Custom Meal Plan & Adjustments', 'Private Locker & Laundry Service', 'Unlimited Guest Passes', 'Free Gym Apparel Kit', 'Priority Class Booking']),
    JSON.stringify(['Master Coach Assigned', 'Bi-weekly InBody 770 Scans', 'VIP Locker & Lounge', 'Complimentary Supplements']),
    25,
    0,
    'Annual members receive exclusive Apex Elite Black Card.',
    1,
    1
  );

  insertPlan.run(
    planId5,
    'Personal Training Elite',
    'personal-training-elite',
    599,
    3,
    90,
    '1-on-1 private coaching designed for accelerated results.',
    JSON.stringify(['36 Private Coaching Sessions', 'Tailored Caloric & Macro Plan', 'Weekly Body Composition Analysis', 'Direct WhatsApp Trainer Access', 'Injury Prevention & Recovery']),
    JSON.stringify(['1-on-1 Coaching', 'Full Gym Access Included', 'Dedicated Nutritionist', 'Custom Recovery Protocol']),
    0,
    0,
    'Renewable in 3-month blocks with continuity guarantee.',
    1,
    0
  );

  // 4. Seed Customers
  const custId1 = generateId('cst');
  const custId2 = generateId('cst');
  const custId3 = generateId('cst');
  const custId4 = generateId('cst');

  const insertCust = db.prepare(`
    INSERT INTO customers (id, customer_code, user_id, full_name, profile_photo, gender, date_of_birth, mobile_number, email, address, emergency_contact, joining_date, height, weight, blood_group, medical_notes, assigned_trainer_id, membership_plan_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCust.run(
    custId1,
    'CUST-DEMO-001',
    customerUserId1,
    'John Doe (Demo Member)',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    'Male',
    '1995-05-14',
    '+91 99999 00004',
    'member@gymdemo.com',
    'Plot 101, Demo Residency, City Center',
    'Demo Emergency Contact (+91 99999 88881)',
    '2026-01-10',
    182,
    84.5,
    'O+',
    'Demo medical note: Cleared for heavy resistance training by physician.',
    trainerId1,
    planId2,
    'active'
  );

  insertCust.run(
    custId2,
    'CUST-DEMO-002',
    customerUserId2,
    'Sarah Jenkins (Demo Member)',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    'Female',
    '1998-09-22',
    '+91 99999 00005',
    'sarah@gymdemo.com',
    'Plot 102, Demo Heights, Metro Park',
    'Demo Emergency Contact (+91 99999 88882)',
    '2026-02-01',
    168,
    59.0,
    'A+',
    'Demo goal: Tone and metabolic conditioning.',
    trainerId2,
    planId4,
    'active'
  );

  insertCust.run(
    custId3,
    'CUST-DEMO-003',
    null,
    'Rahul Verma (Demo Client)',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    'Male',
    '1993-03-18',
    '+91 99999 00006',
    'rahul.demo@example.com',
    'Plot 103, Demo Silicon Park, High Street',
    'Demo Contact (+91 99999 88883)',
    '2026-01-15',
    176,
    75.0,
    'B+',
    'Demo record: Focus on strength overload.',
    trainerId1,
    planId3,
    'active'
  );

  insertCust.run(
    custId4,
    'CUST-DEMO-004',
    null,
    'Pooja Patil (Demo Client)',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    'Female',
    '1996-08-11',
    '+91 99999 00007',
    'pooja.demo@example.com',
    'Plot 104, Demo Gardenia, Green Valley',
    'Demo Contact (+91 99999 88884)',
    '2026-02-10',
    162,
    54.0,
    'O+',
    'Demo record: Focus on functional mobility.',
    trainerId4,
    planId1,
    'active'
  );

  // 5. Seed Customer Memberships
  const cmId1 = generateId('cms');
  const cmId2 = generateId('cms');
  const cmId3 = generateId('cms');
  const cmId4 = generateId('cms');

  const insertCm = db.prepare(`
    INSERT INTO customer_memberships (id, customer_id, plan_id, start_date, end_date, duration_months, total_amount, paid_amount, pending_amount, discount_amount, payment_status, status, approval_status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCm.run(
    cmId1,
    custId1,
    planId2,
    '2026-01-10',
    '2026-04-10',
    3,
    129,
    129,
    0,
    10,
    'paid',
    'active',
    'approved',
    'Full payment received via UPI on sign-up.'
  );

  insertCm.run(
    cmId2,
    custId2,
    planId4,
    '2026-02-01',
    '2027-02-01',
    12,
    399,
    300,
    99,
    25,
    'partial',
    'active',
    'approved',
    'Paid $300 upfront via Card; remaining $99 due by March 1st.'
  );

  insertCm.run(
    cmId3,
    custId3,
    planId1,
    '2026-01-15',
    '2026-02-15',
    1,
    49,
    49,
    0,
    0,
    'paid',
    'expiring_soon',
    'approved',
    'Monthly plan expiring soon; follow up for quarterly upgrade.'
  );

  insertCm.run(
    cmId4,
    custId4,
    planId3,
    '2026-02-10',
    '2026-08-10',
    6,
    229,
    229,
    0,
    15,
    'paid',
    'active',
    'approved',
    'Paid in full.'
  );

  // 6. Seed Payments & Receipts
  const insertPayment = db.prepare(`
    INSERT INTO payments (id, receipt_number, customer_id, customer_membership_id, total_amount, paid_amount, pending_amount, discount_amount, payment_method, payment_date, transaction_ref, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPayment.run(
    generateId('pay'),
    'REC-2026-0001',
    custId1,
    cmId1,
    129,
    129,
    0,
    10,
    'UPI',
    '2026-01-10',
    'UPI/TXN/8492049182',
    'Silver Strength 3-month membership initial payment',
    'completed'
  );

  insertPayment.run(
    generateId('pay'),
    'REC-2026-0002',
    custId2,
    cmId2,
    399,
    300,
    99,
    25,
    'Card',
    '2026-02-01',
    'CARD/AUTH/99281726',
    'Apex Black VIP 1-year partial payment ($300 of $399)',
    'partial'
  );

  insertPayment.run(
    generateId('pay'),
    'REC-2026-0003',
    custId3,
    cmId3,
    49,
    49,
    0,
    0,
    'Cash',
    '2026-01-15',
    'CASH/DIR/1004',
    'Bronze Fitness 1-month membership fee collected at counter',
    'completed'
  );

  insertPayment.run(
    generateId('pay'),
    'REC-2026-0004',
    custId4,
    cmId4,
    229,
    229,
    0,
    15,
    'Online Payment',
    '2026-02-10',
    'RAZOR/PAY/552918',
    'Gold Power 6-month payment processed through gateway',
    'completed'
  );

  // 7. Seed Attendance records (Today and previous days)
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const insertAtt = db.prepare(`
    INSERT INTO attendance (id, entity_type, customer_id, trainer_id, attendance_date, check_in_time, check_out_time, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Today attendance
  insertAtt.run(generateId('att'), 'customer', custId1, null, today, `${today} 06:45:00`, `${today} 08:15:00`, 'present', 'Chest & Triceps workout');
  insertAtt.run(generateId('att'), 'customer', custId2, null, today, `${today} 07:30:00`, `${today} 08:45:00`, 'present', 'Morning HIIT session');
  insertAtt.run(generateId('att'), 'customer', custId4, null, today, `${today} 09:10:00`, null, 'present', 'Currently in cardio section');
  insertAtt.run(generateId('att'), 'trainer', null, trainerId1, today, `${today} 05:45:00`, null, 'present', 'On morning shift');
  insertAtt.run(generateId('att'), 'trainer', null, trainerId2, today, `${today} 06:30:00`, null, 'present', 'Leading 7 AM class');

  // Yesterday attendance
  insertAtt.run(generateId('att'), 'customer', custId1, null, yesterday, `${yesterday} 07:00:00`, `${yesterday} 08:30:00`, 'present', 'Back & Biceps');
  insertAtt.run(generateId('att'), 'customer', custId3, null, yesterday, `${yesterday} 18:30:00`, `${yesterday} 19:45:00`, 'present', 'Leg day session');

  // 8. Seed Workout Plans & Exercises
  const wpId1 = generateId('wkp');
  const wpId2 = generateId('wkp');

  const insertWp = db.prepare(`
    INSERT INTO workout_plans (id, plan_name, category, difficulty, duration_weeks, description, created_by_trainer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertWp.run(
    wpId1,
    'Apex Heavy Hypertrophy 4-Day Split',
    'Muscle Building',
    'Intermediate',
    8,
    'Mass-building program centered on progressive barbell overload and high mechanical tension.',
    trainerId1
  );

  insertWp.run(
    wpId2,
    'Shred & Sculpt Athletic Conditioning',
    'Weight Loss',
    'Beginner',
    6,
    'High-intensity circuit paired with kettlebell work and sprint intervals for maximum metabolic burn.',
    trainerId2
  );

  // Exercises for Workout Plan 1
  const insertEx = db.prepare(`
    INSERT INTO exercises (id, workout_plan_id, day_of_week, exercise_name, sets, reps, weight_target, rest_seconds, notes, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEx.run(generateId('ex'), wpId1, 'Monday', 'Barbell Bench Press', 4, '6-8', '80-100 kg', 90, 'Focus on arched upper back and retracted scaps', 1);
  insertEx.run(generateId('ex'), wpId1, 'Monday', 'Incline Dumbbell Press', 3, '10-12', '28-34 kg', 60, 'Slight 30 degree incline for clavicular head', 2);
  insertEx.run(generateId('ex'), wpId1, 'Monday', 'Weighted Dips', 3, '8-10', '+15 kg', 60, 'Forward torso lean', 3);
  insertEx.run(generateId('ex'), wpId1, 'Monday', 'Cable Tricep Pushdown', 4, '12-15', '35 kg', 45, 'Superset with overhead rope extensions', 4);

  insertEx.run(generateId('ex'), wpId1, 'Tuesday', 'Barbell Deadlift', 4, '5', '140-160 kg', 120, 'Reset each repetition; maintain neutral spine', 1);
  insertEx.run(generateId('ex'), wpId1, 'Tuesday', 'Chest-Supported Row', 4, '8-10', '70 kg', 75, 'Full stretch at bottom', 2);
  insertEx.run(generateId('ex'), wpId1, 'Tuesday', 'Lat Pulldown', 3, '10-12', '65 kg', 60, 'Drive elbows straight to hip pockets', 3);
  insertEx.run(generateId('ex'), wpId1, 'Tuesday', 'Incline Dumbbell Curl', 3, '10-12', '14 kg', 60, 'Deep biceps stretch', 4);

  insertEx.run(generateId('ex'), wpId1, 'Thursday', 'Barbell Back Squat', 4, '6-8', '110-130 kg', 120, 'Below parallel depth', 1);
  insertEx.run(generateId('ex'), wpId1, 'Thursday', 'Romanian Deadlift', 3, '8-10', '90 kg', 90, 'Feel hamstring stretch', 2);
  insertEx.run(generateId('ex'), wpId1, 'Thursday', 'Leg Press', 3, '12-15', '200 kg', 60, 'Controlled 3-second descent', 3);
  insertEx.run(generateId('ex'), wpId1, 'Thursday', 'Standing Calf Raise', 4, '15-20', '80 kg', 45, '2-second pause at contraction', 4);

  insertEx.run(generateId('ex'), wpId1, 'Friday', 'Overhead Military Press', 4, '6-8', '55-65 kg', 90, 'Lock out overhead with tight glutes', 1);
  insertEx.run(generateId('ex'), wpId1, 'Friday', 'Dumbbell Lateral Raise', 4, '15-20', '12 kg', 45, 'Lead with elbows', 2);
  insertEx.run(generateId('ex'), wpId1, 'Friday', 'Rear Delt Flyes', 3, '15', '10 kg', 45, 'Focus on posterior delts', 3);

  // Assign workout plan 1 to customer 1 (Alex Mercer)
  db.prepare(`
    INSERT INTO workout_assignments (id, customer_id, workout_plan_id, assigned_by_trainer_id, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(generateId('wka'), custId1, wpId1, trainerId1, '2026-01-12', '2026-03-12', 'active');

  // 9. Seed Diet Plans & Assignments
  const dpId1 = generateId('dtp');
  const dpId2 = generateId('dtp');

  const insertDp = db.prepare(`
    INSERT INTO diet_plans (id, plan_name, goal, target_calories, protein_grams, carbs_grams, fats_grams, water_liters, breakfast, lunch, dinner, snacks, dietary_notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertDp.run(
    dpId1,
    'Lean Muscle Hypertrophy 2800 Cal',
    'Muscle Gain',
    2800,
    195,
    310,
    75,
    4.0,
    '5 whole eggs scrambled with spinach, 100g rolled oats with blueberries, 1 scoop whey isolate.',
    '200g grilled chicken breast, 250g steamed basmati rice, 150g broccoli with olive oil.',
    '200g lean sirloin steak or salmon fillet, 300g baked sweet potato, large green salad.',
    'Greek yogurt (200g) with 30g almonds and 1 banana; post-workout whey isolate shake.',
    'Drink 500ml water immediately upon waking. Consume carbs around workout window.',
    'Marcus Vance'
  );

  insertDp.run(
    dpId2,
    'Metabolic Fat Loss 1900 Cal',
    'Weight Loss',
    1900,
    155,
    160,
    55,
    3.5,
    '3 egg whites + 2 whole eggs omelette, 1 slice whole grain sourdough, half avocado.',
    '180g lemon herb chicken or tofu, large quinoa bowl with cucumber, cherry tomatoes, and light feta.',
    '200g grilled white fish, grilled asparagus and zucchini, small sweet potato.',
    'Protein smoothie with almond milk, spinach, and chia seeds.',
    'Strictly avoid sugary beverages. Final meal at least 2.5 hours before sleep.',
    'Elena Rostova'
  );

  // Assign diet plan 1 to customer 1
  db.prepare(`
    INSERT INTO diet_assignments (id, customer_id, diet_plan_id, assigned_by, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(generateId('dta'), custId1, dpId1, 'Marcus Vance', '2026-01-12', '2026-04-12', 'active');

  // 10. Seed Customer Progress Records
  const insertProg = db.prepare(`
    INSERT INTO customer_progress (id, customer_id, recorded_date, weight_kg, height_cm, bmi, chest_cm, waist_cm, hips_cm, arms_cm, body_fat_percentage, notes, recorded_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProg.run(generateId('prg'), custId1, '2026-01-10', 87.0, 182, 26.3, 104, 88, 99, 37.5, 18.5, 'Initial baseline testing.', 'Marcus Vance');
  insertProg.run(generateId('prg'), custId1, '2026-01-25', 85.8, 182, 25.9, 105, 86, 98, 38.0, 17.2, 'Waist down 2cm, arms increased.', 'Marcus Vance');
  insertProg.run(generateId('prg'), custId1, '2026-02-10', 84.5, 182, 25.5, 106, 84, 97, 38.5, 15.8, 'Significant muscle definition in chest and delts.', 'Marcus Vance');

  // 11. Seed Enquiries (Website Leads)
  const insertEnq = db.prepare(`
    INSERT INTO enquiries (id, enquiry_code, full_name, email, phone, program_interest, source, message, status, follow_up_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEnq.run(
    generateId('enq'),
    'ENQ-2026-0001',
    'Arjun Kapoor',
    'arjun.kapoor@example.com',
    '+91 98220 12345',
    'Personal Training',
    'Join Now',
    'Interested in 1-on-1 personal coaching for wedding preparation in 3 months.',
    'New',
    '2026-02-22',
    'Lead submitted from homepage Join Now CTA. Prefers evening trial.'
  );

  insertEnq.run(
    generateId('enq'),
    'ENQ-2026-0002',
    'Meera Singhal',
    'meera.s@example.com',
    '+91 98330 54321',
    'Yoga & Mobility',
    'Book Session',
    'Would like to join the morning 6 AM Yoga classes. Do you provide trial sessions?',
    'Contacted',
    '2026-02-21',
    'Called back. Offered free Saturday morning masterclass pass.'
  );

  insertEnq.run(
    generateId('enq'),
    'ENQ-2026-0003',
    'Karan Oberoi',
    'karan.oberoi@example.com',
    '+91 98110 99881',
    'Gold Power Membership',
    'Contact Form',
    'Looking for corporate membership packages for a team of 15 engineers.',
    'Interested',
    '2026-02-23',
    'Sent corporate brochure. Scheduled gym facility walkthrough this Friday.'
  );

  // 12. Seed Expenses
  const insertExp = db.prepare(`
    INSERT INTO expenses (id, expense_date, category, amount, description, payment_method, receipt_attachment, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertExp.run(generateId('exp'), '2026-02-01', 'Rent', 85000, 'Main facility gym floor monthly lease', 'Bank Transfer', null, 'Admin');
  insertExp.run(generateId('exp'), '2026-02-03', 'Electricity', 18500, 'Commercial AC and lighting power bill', 'Online Payment', null, 'Admin');
  insertExp.run(generateId('exp'), '2026-02-05', 'Equipment', 42000, 'Eleiko Olympic calibrated plates and barbell maintenance', 'Card', null, 'Admin');
  insertExp.run(generateId('exp'), '2026-02-10', 'Trainer Salary', 160000, 'Monthly trainer stipend & commission payouts', 'Bank Transfer', null, 'Admin');
  insertExp.run(generateId('exp'), '2026-02-12', 'Maintenance', 8500, 'Sauna heater servicing and filter replacements', 'UPI', null, 'Admin');
  insertExp.run(generateId('exp'), '2026-02-15', 'Marketing', 14000, 'Meta and Google local gym search campaigns', 'Card', null, 'Admin');

  // 13. Seed Services (Matching reference screenshots: Yoga, Bodybuilding, Fitness, Boxing, etc.)
  const insertService = db.prepare(`
    INSERT INTO services (id, name, slug, description, short_description, icon, image_url, category, is_active, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertService.run(
    generateId('srv'),
    'Personal Training',
    'personal-training',
    '1-on-1 bespoke coaching designed around your specific physiology, biomechanics, and aesthetic objectives. Every rep is monitored for optimal muscle activation and injury prevention.',
    'Custom tailored 1-on-1 coaching with certified master trainers.',
    'Dumbbell',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
    'Coaching',
    1,
    1
  );

  insertService.run(
    generateId('srv'),
    'Bodybuilding & Hypertrophy',
    'bodybuilding',
    'Scientifically structured muscle hypertrophy protocols combining mechanical tension, metabolic stress, and muscle damage for maximum muscular development.',
    'Elite muscle hypertrophy and physique sculpting programs.',
    'Biceps',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    'Strength',
    1,
    2
  );

  insertService.run(
    generateId('srv'),
    'Boxing & Combat Conditioning',
    'boxing',
    'High-octane boxing workouts that combine punch combinations, footwork drills, heavy bag rounds, and intense core conditioning for athletic power and endurance.',
    'High intensity heavy-bag drills, footwork, and core combat conditioning.',
    'Flame',
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800',
    'Combat',
    1,
    3
  );

  insertService.run(
    generateId('srv'),
    'Yoga & Mobility Restoration',
    'yoga',
    'Dynamic vinyasa, restorative yin yoga, and targeted joint mobility designed specifically for lifters to relieve tight hips, restore shoulders, and prevent sports injuries.',
    'Deep flexibility, joint mobility, and breathwork for lifters.',
    'HeartPulse',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
    'Mobility',
    1,
    4
  );

  insertService.run(
    generateId('srv'),
    'Diet & Nutrition Consultation',
    'diet-consultation',
    'Customized macro calculation, nutrient timing, and sustainable meal planning curated by certified sports nutritionists to accelerate muscle gain or fat loss.',
    'Personalized meal plans, macro tracking, and nutritional optimization.',
    'Utensils',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
    'Nutrition',
    1,
    5
  );

  insertService.run(
    generateId('srv'),
    'Clinical Fitness Assessment',
    'fitness-assessment',
    'Comprehensive physiological profiling including InBody multi-frequency bioimpedance, VO2 max estimation, movement screening, and posture analysis.',
    'InBody body composition scan, VO2 max test, and posture screen.',
    'Activity',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800',
    'Testing',
    1,
    6
  );

  // 14. Seed Programs (From reference: Make You Grow With Our Program)
  const insertProgCard = db.prepare(`
    INSERT INTO programs (id, title, slug, description, duration, difficulty, trainer_name, image_url, benefits, is_active, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProgCard.run(
    generateId('prg'),
    'Qualified Coaches & Personal Mentorship',
    'qualified-coaches',
    'Work with nationally accredited strength specialists who craft periodized training cycles tailored to push your physical capabilities.',
    '12 Weeks',
    'All Levels',
    'Marcus Vance & Team',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    JSON.stringify(['1-on-1 Biomechanic Auditing', 'Periodized Strength Cycles', 'Weekly Progression Reviews']),
    1,
    1
  );

  insertProgCard.run(
    generateId('prg'),
    'State-of-the-Art Fitness Equipment',
    'fitness-equipment',
    'Train on world-class Eleiko calibrated barbells, Arsenal Strength selectorized machines, and Rogue conditioning equipment built for champions.',
    'Ongoing',
    'All Levels',
    'Apex Elite Facility',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    JSON.stringify(['Competition Barbells', 'Pneumatic Resistance Machines', 'Deadlift Platforms']),
    1,
    2
  );

  insertProgCard.run(
    generateId('prg'),
    'Individual Scientific Approach',
    'individual-approach',
    'No cookie-cutter templates. Every program is calibrated to your limb lengths, mobility restrictions, work schedule, and recovery profile.',
    '16 Weeks',
    'Intermediate',
    'Elena Rostova',
    'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800',
    JSON.stringify(['Custom Movement Prescriptions', 'Heart Rate Zone Training', 'Sleep & Recovery Audits']),
    1,
    3
  );

  // 15. Seed Classes (From reference: Men Class, Women Class, etc.)
  const insertClass = db.prepare(`
    INSERT INTO classes (id, title, slug, category, trainer_id, trainer_name, schedule_info, duration_minutes, description, image_url, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertClass.run(
    generateId('cls'),
    'Men Class - Heavy Strength & Power',
    'men-class',
    "Men's Fitness",
    trainerId1,
    'Marcus Vance',
    'Mon / Wed / Fri: 07:00 AM & 06:00 PM',
    60,
    'A raw strength and conditioning environment focused on the big three lifts, explosive kettlebell work, and muscular density.',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    1
  );

  insertClass.run(
    generateId('cls'),
    "Women Class - Glute, Core & Athletic Sculpt",
    'women-class',
    "Women's Fitness",
    trainerId2,
    'Elena Rostova',
    'Tue / Thu / Sat: 08:00 AM & 05:00 PM',
    60,
    'Female-coached athletic strength program focusing on posterior chain development, core stability, and high-intensity conditioning.',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
    1
  );

  insertClass.run(
    generateId('cls'),
    'Apex Cross-Training & Functional Circuit',
    'cross-training',
    'Cross Training',
    trainerId2,
    'Elena Rostova',
    'Daily: 06:00 PM',
    45,
    'High energy team training incorporating sled pushes, box jumps, battle ropes, and barbell cycling.',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    1
  );

  // 16. Seed Testimonials (From reference: What Our Customers Are Saying)
  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (id, customer_name, customer_image, rating, membership_type, review, is_featured, is_approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTestimonial.run(
    generateId('tst'),
    'Rahul Verma (Demo Member)',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    5,
    'Demo Pro Member',
    'The demo gym software makes tracking memberships, attendance, and workouts extremely seamless! Everything works smoothly on mobile.',
    1,
    1
  );

  insertTestimonial.run(
    generateId('tst'),
    'Pooja Patil (Demo Member)',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    5,
    'Demo VIP Member',
    'The trainer booking system, personalized diet charts, and instant QR check-in make this platform very client friendly.',
    1,
    1
  );

  insertTestimonial.run(
    generateId('tst'),
    'Amit Shinde (Demo Member)',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    5,
    'Demo Starter Member',
    'Modern equipment, seamless online registration, and transparent billing. The perfect gym management demonstration platform.',
    1,
    1
  );

  // 17. Seed Gallery
  const insertGallery = db.prepare(`
    INSERT INTO gallery (id, title, category, image_url, display_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertGallery.run(generateId('gal'), 'Dumbbell & Free Weights Zone', 'Equipment', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', 1);
  insertGallery.run(generateId('gal'), 'Olympic Lifting Platforms', 'Training', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800', 2);
  insertGallery.run(generateId('gal'), 'Main Gym Floor Atmospheric Lighting', 'Interior', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800', 3);
  insertGallery.run(generateId('gal'), 'Heavy Bag Boxing Arena', 'Interior', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800', 4);
  insertGallery.run(generateId('gal'), 'Cardio & Conditioning Mezzanine', 'Equipment', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800', 5);
  insertGallery.run(generateId('gal'), 'Mobility & Recovery Studio', 'Interior', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800', 6);

  // 18. Seed Gym Settings (Demo Info)
  db.prepare(`
    INSERT INTO gym_settings (id, gym_name, phone, email, address, opening_hours, logo_url, social_instagram, social_facebook, social_youtube, stats_members, stats_trainers, stats_equipment, stats_programs)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'gym_settings_default',
    'DEMO FITNESS CLUB',
    '+91 99999 00000 / +91 98888 11111',
    'demo@gymdemo.com',
    'Plot No. 101, Demo Gym Hub, Commercial Sector, Pune / Mumbai 400001',
    'Mon - Sat: 06:00 AM - 10:00 PM | Sun: 07:00 AM - 08:00 PM',
    '/logo.svg',
    'https://instagram.com/demofitnessclub',
    'https://facebook.com/demofitnessclub',
    'https://youtube.com/demofitnessclub',
    2250,
    520,
    520,
    45
  );

  console.log('✓ Database seeded with complete production records: admin, trainers, members, plans, attendance, workouts, diets, enquiries, expenses, and content.');
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  runSeed();
}
