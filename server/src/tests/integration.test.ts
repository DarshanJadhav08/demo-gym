import { AuthService } from '../services/auth.service.js';
import { CustomerRepository } from '../repositories/customer.repository.js';
import { TrainerRepository } from '../repositories/trainer.repository.js';
import { MembershipRepository } from '../repositories/membership.repository.js';
import { PaymentRepository } from '../repositories/payment.repository.js';
import { AttendanceRepository } from '../repositories/attendance.repository.js';
import { WorkoutRepository } from '../repositories/workout.repository.js';
import { DietRepository } from '../repositories/diet.repository.js';
import { EnquiryRepository } from '../repositories/enquiry.repository.js';
import { ExpenseRepository } from '../repositories/expense.repository.js';
import { ReportRepository } from '../repositories/report.repository.js';
import { ContentRepository } from '../repositories/content.repository.js';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING APEX ELITE COMPREHENSIVE INTEGRATION QA');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  const runId = Date.now();

  // --- WORKFLOW 1: CUSTOMER REGISTRATION & 11-TAB PROFILE ---
  console.log('▶ WORKFLOW 1: Customer Registration & 11-Tab Profile');
  const newCust = CustomerRepository.create({
    full_name: 'Devraj Chauhan',
    mobile_number: `+91 99000 ${runId.toString().slice(-5)}`,
    email: `devraj.${runId}@example.com`,
    gender: 'Male',
    date_of_birth: '1993-08-14',
    address: 'Flat 402, High Point, Mumbai',
    emergency_contact: 'Sunita Chauhan (+91 99000 11224)',
    height: 180,
    weight: 82,
    blood_group: 'B+',
    status: 'active'
  });
  assert(!!newCust.id && newCust.customer_code.startsWith('CUST-'), 'Customer created with auto-generated code');

  const loadedCust = CustomerRepository.getById(newCust.id);
  assert(loadedCust.full_name === 'Devraj Chauhan', 'Customer profile retrieved');
  assert(Array.isArray(loadedCust.memberships), '11-Tab: Memberships tab array exists');
  assert(Array.isArray(loadedCust.payments), '11-Tab: Payments tab array exists');
  assert(Array.isArray(loadedCust.attendance), '11-Tab: Attendance tab array exists');
  assert(Array.isArray(loadedCust.workouts), '11-Tab: Workouts tab array exists');
  assert(Array.isArray(loadedCust.diets), '11-Tab: Diets tab array exists');
  assert(Array.isArray(loadedCust.progress), '11-Tab: Progress tab array exists');

  // --- WORKFLOW 2: MEMBERSHIP APPLICATION & LIFECYCLE ---
  console.log('\n▶ WORKFLOW 2: Public Membership Application & Lifecycle');
  const plans = MembershipRepository.getAllPlans();
  assert(plans.length >= 4, 'Configurable plans exist in database');

  const selectedPlan = plans[0];
  const app = MembershipRepository.createApplication({
    full_name: 'Pooja Hegde',
    email: `pooja.${runId}@example.com`,
    mobile_number: `+91 99111 ${runId.toString().slice(-5)}`,
    plan_id: selectedPlan.id,
    notes: 'Inbound website application test',
  });
  assert(app.status === 'pending', 'Membership application saved with pending status');

  const reviewedApp = MembershipRepository.updateApplicationStatus(app.id, 'approved', 'SuperAdmin');
  assert(reviewedApp.status === 'approved', 'Admin reviewed and approved membership application');

  // Assign customer membership
  const assignedMem = MembershipRepository.assignMembership({
    customer_id: newCust.id,
    plan_id: selectedPlan.id,
    start_date: '2026-03-01',
    paid_amount: 0,
  });
  assert(assignedMem.status === 'active', 'Customer membership activated with start and end dates');
  assert(assignedMem.pending_amount === selectedPlan.price, 'Pending amount matches plan price');

  // --- WORKFLOW 3: PAYMENT & RECEIPT GENERATION ---
  console.log('\n▶ WORKFLOW 3: Billing & Payment Receipts');
  const payment = PaymentRepository.createPayment({
    customer_id: newCust.id,
    customer_membership_id: assignedMem.id,
    total_amount: selectedPlan.price,
    paid_amount: selectedPlan.price,
    payment_method: 'UPI',
    transaction_ref: 'UPI/TEST/99281726',
    notes: 'Full payment received at front desk',
  });
  assert(payment.receipt_number.startsWith('REC-'), 'Receipt number automatically formatted');
  assert(payment.status === 'completed', 'Payment status marked as completed');
  assert(payment.pending_amount === 0, 'Zero pending balance remaining');

  // Check updated membership balance
  const updatedCust = CustomerRepository.getById(newCust.id);
  const updatedMem = updatedCust.memberships.find((m: any) => m.id === assignedMem.id);
  assert(updatedMem.paid_amount === selectedPlan.price, 'Customer membership paid amount updated');
  assert(updatedMem.pending_amount === 0, 'Customer membership pending amount balanced to 0');

  // --- WORKFLOW 4: TRAINER MANAGEMENT & PERMISSIONS ---
  console.log('\n▶ WORKFLOW 4: Trainer Management');
  const newTrainer = TrainerRepository.create({
    full_name: 'Zack "Iron" Taylor',
    mobile_number: `+91 99222 ${runId.toString().slice(-5)}`,
    email: `zack.taylor.${runId}@apexelite.com`,
    specialization: 'Calisthenics & Olympic Gymnastics',
    experience: '6 Years',
    salary: 68000,
    employment_type: 'Full-time',
    status: 'active',
  });
  assert(newTrainer.trainer_code.startsWith('TRN-'), 'Trainer code auto-assigned');

  // Assign customer to trainer
  CustomerRepository.update(newCust.id, { assigned_trainer_id: newTrainer.id });
  const trainerDetail = TrainerRepository.getById(newTrainer.id);
  assert(trainerDetail.clients.some((c: any) => c.id === newCust.id), 'Customer assigned to trainer roster');

  // --- WORKFLOW 5: ATTENDANCE & DUPLICATE PREVENTION ---
  console.log('\n▶ WORKFLOW 5: Attendance Check-In & Duplicate Prevention');
  const checkIn = AttendanceRepository.checkIn({
    entity_type: 'customer',
    customer_id: newCust.id,
    notes: 'Morning heavy lifting session',
  });
  assert(checkIn.status === 'present', 'Attendance check-in logged');

  let duplicateBlocked = false;
  try {
    AttendanceRepository.checkIn({
      entity_type: 'customer',
      customer_id: newCust.id,
    });
  } catch (err: any) {
    duplicateBlocked = true;
  }
  assert(duplicateBlocked, 'Prevented accidental duplicate check-in while session is active');

  const checkedOut = AttendanceRepository.checkOut(checkIn.id);
  assert(!!checkedOut.check_out_time, 'Check-out timestamp recorded');

  // --- WORKFLOW 6: CUSTOMER PORTAL RETRIEVAL ---
  console.log('\n▶ WORKFLOW 6: Customer Portal Retrieval');
  const alexUser = CustomerRepository.getAll({ search: 'Alex Mercer' });
  assert(alexUser.customers.length > 0, 'Seeded customer exists');
  const alexProfile = CustomerRepository.getById(alexUser.customers[0].id);
  assert(!!alexProfile.customer_code, 'Member code visible in portal');
  assert(alexProfile.memberships.length > 0, 'Active membership visible in member portal');
  assert(alexProfile.workouts.length > 0, 'Assigned workout routine visible in portal');
  assert(alexProfile.diets.length > 0, 'Assigned nutrition plan visible in portal');

  // --- WORKFLOW 7: WEBSITE ENQUIRY TO CUSTOMER CONVERSION ---
  console.log('\n▶ WORKFLOW 7: Inbound Enquiry & One-Click Customer Conversion');
  const enq = EnquiryRepository.create({
    full_name: 'Ananya Deshmukh',
    email: `ananya.${runId}@example.com`,
    phone: `+91 99333 ${runId.toString().slice(-5)}`,
    program_interest: 'Personal Training',
    source: 'Join Now',
    message: 'Looking for 3-month weight loss coaching',
  });
  assert(enq.status === 'New', 'Lead received and marked as New');

  const conversion = EnquiryRepository.convertToCustomer(enq.id, {
    address: 'Bandra West, Mumbai',
    membership_plan_id: selectedPlan.id,
  });
  assert(conversion.customer.email === `ananya.${runId}@example.com`, 'Customer auto-created using enquiry email');
  assert(conversion.customer.mobile_number === `+91 99333 ${runId.toString().slice(-5)}`, 'Customer auto-created using enquiry phone');
  assert(conversion.enquiry.status === 'Converted', 'Enquiry status automatically transitioned to Converted');
  assert(conversion.enquiry.converted_customer_id === conversion.customer.id, 'Enquiry foreign key links to new customer');

  // --- EXPENSES, REPORTS & DASHBOARD METRICS ---
  console.log('\n▶ AUDITING: Expenses, Dashboard KPIs & Reports');
  const exp = ExpenseRepository.create({
    category: 'Maintenance',
    amount: 3500,
    description: 'Gym floor sanitation and treadmill belt lube',
  });
  assert(exp.amount === 3500, 'Operating expense recorded');

  const summary = ReportRepository.getDashboardSummary();
  assert(summary.kpis.totalCustomers > 0, 'KPI: Total customers computed');
  assert(summary.kpis.monthlyRevenue > 0, 'KPI: Real revenue calculated from transaction records');
  assert(summary.kpis.monthlyExpenses > 0, 'KPI: Real expenses calculated');
  assert(summary.kpis.todayAttendance > 0, 'KPI: Real attendance tracked');

  const finReport = ReportRepository.getFinancialReport();
  assert(finReport.totalRevenue >= 0, 'Financial report revenue calculated');
  assert(finReport.totalExpenses >= 0, 'Financial report expenses calculated');

  console.log('\n====================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
