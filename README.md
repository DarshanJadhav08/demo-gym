# APEX ELITE FITNESS — LUXURY HEALTH CLUB & GYM MANAGEMENT PLATFORM

A full-stack, production-ready, international-standard luxury fitness website and integrated gym management platform. Built to drive customer acquisition on the public multi-page website and provide complete administrative, financial, trainer, and customer operations from a centralized dashboard.

---

## 📸 DESIGN IDENTITY & VISUAL SYSTEM

Inspired by world-class luxury athletic facilities with moody dark gym aesthetics and crisp modern light mode:
- **Primary Background (Dark)**: `#080811`
- **Secondary Background (Dark)**: `#10101C`
- **Card Background (Dark)**: `#151522`
- **Primary Accent**: `#E91E63` (Hot Neon Pink)
- **Secondary Accent**: `#A51C55` (Deep Magenta)
- **Burgundy Accent**: `#571638`
- **Light Theme**: Luxury clean pearl background (`#F8F9FC`), crisp white cards (`#FFFFFF`), slate typography (`#0F172A`), and vibrant pink borders.
- **Typography**: `Oswald` / `Bebas Neue` for strong athletic headings, `Inter` / `Poppins` for body text.
- **Icons**: Lucide React with bold, high-contrast, stroke-consistent vectors.

---

## 🌟 COMPLETE FEATURE MATRIX

### 1. Multi-Page Public Website
- **Dedicated Independent Pages**:
  - `/` — High-converting **Home Page** with cinematic hero, section previews, quick tool triggers, and testimonials.
  - `/about` — **About Us Page**: Our genesis story, 4 performance pillars, architectural zone tour, and coaching standards.
  - `/programs` — **Training Programs Page**: Interactive category filter (Strength, Hypertrophy, Fat Loss, Functional, Combat), full curriculum cards, and direct enrollment.
  - `/classes` — **Classes & Schedule Page**: Men's Power Class & Women's Sculpt spotlight cards, plus a live **Interactive Weekly Timetable Grid (Mon–Sun)** with one-click slot reservations.
  - `/services` — **Services Page**: 1-on-1 Personal Training, InBody 770 Scans, Combat Boxing Arena, Cryotherapy & Infrared Contrast Sauna, Sports Dietetics.
  - `/pricing` — **Pricing & Memberships Page**: Standard vs. Annual billing toggle (Save 20%), tier cards, **Side-by-Side Comparison Matrix Table**, and free trial pass request.
  - `/trainers` — **Master Coaches Page**: Accredited trainer bios, international certifications (CSCS, ISSA, USAW, NASM), client ratings, and direct consultation booking.
  - `/gallery` — **Facility Gallery Page**: Filterable photo showcase with high-definition imagery and full-screen **Lightbox**.
  - `/contact` — **Contact & Map Page**: Direct phone/email, valet parking info, Google Maps integration, operating hours, interactive enquiry form, and FAQ accordion.

### 2. Advanced Client-Pleasing Features
- **Theme Switcher**: One-click Dark / Light mode toggle in Navbar and Dashboard headers with persistent `localStorage` preference.
- **Interactive BMI & Calorie Calculator**: Calculates BMI, category badge, Total Daily Energy Expenditure (TDEE), daily protein target, and recommends a specific training protocol.
- **Free 1-Day VIP Guest Pass Generator**: Instant digital pass with generated pass ID and QR code verification graphic.
- **Floating WhatsApp Concierge**: Instant one-click connection to the gym admissions desk.

### 3. Full Admin Management System (`/admin`)
- **Executive Dashboard**:
  - 10 real-time KPI metrics (Total Customers, Active Members, Inactive, Trainers, Monthly Revenue, Monthly Expenses, Net Profit, Pending Balances, Today's Attendance, New Enquiries).
  - Monthly Cashflow Bar Chart (Revenue vs Expenses).
  - Membership Tier Breakdown Donut Chart.
  - Recent Billing Transactions feed.
  - Recent Registrations & Enquiries action queue.
- **Customer Management (Full CRUD)**:
  - Auto-generated customer codes (`CUST-2026-XXXX`).
  - Search by name, mobile, customer code, or email.
  - Filter by Membership Plan, Status, Assigned Trainer.
  - Export Customer Directory to CSV.
  - Add / Edit Customer modal with complete validation.
- **Dedicated 11-Tab Customer Profile (`/admin/customers/:id`)**:
  1. *Overview*: Snapshot of total sessions, payments, weight, and active workout.
  2. *Personal Information*: Complete contact details, emergency contacts, blood group, height, weight.
  3. *Membership History*: Start date, end date, status, renewal rules.
  4. *Payment History*: Invoices, amounts paid, balance due, and printable receipts.
  5. *Attendance History*: Exact check-in and check-out timestamps with status.
  6. *Workout Plans*: Detailed routines, exercise names, sets, reps, weight targets, coach details.
  7. *Diet Plans*: Customized caloric targets, macronutrient split (Protein, Carbs, Fats), meal-by-meal schedules.
  8. *Body Progress*: Weight evolution tracker and physical transformation log.
  9. *Assigned Trainer*: Coach credentials, specialization, direct communication channel.
  10. *Payment Receipts*: Official printable invoices with `window.print()`.
  11. *Status Management*: Instant status toggling (Active, Inactive, Suspended).
- **Trainer Management**: Full CRUD, code auto-assignment (`TRN-XXXX`), client roster tracking.
- **Membership Tier Management & Application Approvals**: Tier pricing editor and inbound website application review/approval workflow.
- **Billing, Invoicing & Receipts**: Auto receipt numbers (`REC-2026-XXXXX`), payment collection, and official printable receipt template.
- **Attendance & Live Headcount Engine**: Check-in/check-out with active session duplicate prevention.
- **Workout & Diet Plan Builders**: Custom exercise splits and nutrition blueprints.
- **Enquiry & Lead Conversion Pipeline**: One-click lead conversion directly into active customer profiles.
- **Expense Logging & P&L Reporting**: Category expenditure tracking and CSV financial exports.
- **Gym Brand Settings**: Facility contact, address, operating hours, and tax settings.

### 4. Dedicated Portals
- **Customer Portal (`/portal`)**: Digital Member ID card, active membership tier, days remaining, assigned workout split, custom diet plan, and payment receipt history.
- **Trainer Portal (`/trainer`)**: Staff coach dashboard displaying active client roster, quick contact links, and member workout assignments.

---

## 🔑 DEMO ACCOUNTS (One-Click Login Supported)

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@apexelite.com` | `Admin@12345` | Complete Admin Workspace (`/admin`) |
| **Personal Trainer** | `marcus@apexelite.com` | `Trainer@12345` | Trainer Coaching Portal (`/trainer`) |
| **Gym Customer** | `alex@apexelite.com` | `Customer@12345` | Member Self-Service Portal (`/portal`) |

---

## 🚀 QUICK START & RUN INSTRUCTIONS

```powershell
# 1. Install dependencies (if not already done)
npm install

# 2. Run initial database seed
npm run seed

# 3. Build the client bundle
npm run build

# 4. Start the unified production server
npm start
```

Open [http://localhost:5000](http://localhost:5000) in your browser:
- **Public Multi-Page Website**: `http://localhost:5000`
- **About Us**: `http://localhost:5000/about`
- **Programs**: `http://localhost:5000/programs`
- **Classes & Timetable**: `http://localhost:5000/classes`
- **Services**: `http://localhost:5000/services`
- **Pricing & Comparison**: `http://localhost:5000/pricing`
- **Trainers**: `http://localhost:5000/trainers`
- **Gallery**: `http://localhost:5000/gallery`
- **Contact & Map**: `http://localhost:5000/contact`
- **Admin Dashboard**: `http://localhost:5000/admin`
- **Member Portal**: `http://localhost:5000/portal`
- **Trainer Portal**: `http://localhost:5000/trainer`
