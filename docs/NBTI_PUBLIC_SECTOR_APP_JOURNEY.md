# DotMac ERP - Public Sector Application Journey
## National Board for Technology Incubation (NBTI)
### IPSAS-Compliant Government ERP - Complete User Documentation

---

## Table of Contents

1. [Authentication & Access](#1-authentication--access)
2. [Module Selection & Navigation](#2-module-selection--navigation)
3. [Finance Module](#3-finance-module)
   - 3.1 [Finance Dashboard](#31-finance-dashboard)
   - 3.2 [General Ledger](#32-general-ledger)
   - 3.3 [IPSAS Fund Accounting](#33-ipsas-fund-accounting)
   - 3.4 [Accounts Payable (Creditors)](#34-accounts-payable-creditors)
   - 3.5 [Accounts Receivable (Debtors)](#35-accounts-receivable-debtors)
   - 3.6 [Treasury & Banking](#36-treasury--banking)
   - 3.7 [Fixed Assets](#37-fixed-assets)
   - 3.8 [Tax Management](#38-tax-management)
   - 3.9 [Lease Accounting](#39-lease-accounting)
   - 3.10 [Financial Reports](#310-financial-reports)
   - 3.11 [Automation](#311-automation)
   - 3.12 [Remita / TSA Payments](#312-remita--tsa-payments)
   - 3.13 [Import / Export](#313-import--export)
   - 3.14 [Finance Settings](#314-finance-settings)
4. [People & HR Module](#4-people--hr-module)
   - 4.1 [HR Core](#41-hr-core)
   - 4.2 [Payroll](#42-payroll)
   - 4.3 [Leave Management](#43-leave-management)
   - 4.4 [Attendance](#44-attendance)
   - 4.5 [Scheduling](#45-scheduling)
   - 4.6 [Recruitment](#46-recruitment)
   - 4.7 [Training](#47-training)
   - 4.8 [Performance Management](#48-performance-management)
   - 4.9 [Employee Self-Service](#49-employee-self-service)
5. [Procurement Module](#5-procurement-module)
6. [Inventory Module](#6-inventory-module)
7. [Expense Management](#7-expense-management)
8. [Project Management](#8-project-management)
9. [Fleet Management](#9-fleet-management)
10. [Support / Helpdesk](#10-support--helpdesk)
11. [Careers Portal](#11-careers-portal)
12. [Onboarding Portal](#12-onboarding-portal)
13. [Administration](#13-administration)
14. [IPSAS Terminology Reference](#14-ipsas-terminology-reference)

---

## 1. Authentication & Access

### Login (`/login`)
The user arrives at a branded login page displaying the organization logo and name.

**Fields:**
- Username or email address
- Password (with show/hide toggle)
- "Keep me signed in" checkbox (extends session to 30 days)

**Flow:**
1. User enters credentials and submits
2. System authenticates via `POST /auth/login`
3. If **MFA is enabled**, a second screen appears requesting a 6-digit TOTP code from the user's authenticator app
4. On success, a JWT access token is set as an HTTP-only cookie
5. User is redirected to the module selection page or their last-visited module

**Additional screens:**
- **Forgot Password** (`/forgot-password`) - Enter email to receive a reset link
- **Reset Password** (`/reset-password`) - Set new password via token link
- **Request Access** (`/register`) - New user registration request

**Session Management:**
- JWT tokens auto-refresh 2 minutes before expiry
- Activity-based refresh keeps active users logged in
- Tab visibility detection pauses/resumes refresh
- Expired sessions redirect to login with a "session expired" message

---

## 2. Module Selection & Navigation

### Module Selector (`/module-select`)
After login, users see a module selection screen listing all modules they have access to. Access is controlled by role-based permissions (`accessible_modules`).

**Available Modules for NBTI:**

| Module | URL | Icon | Description |
|--------|-----|------|-------------|
| Finance | `/finance/dashboard` | Chart | Financial management, GL, AP, AR, IPSAS |
| People & HR | `/people/hr/employees` | Users | Employee management, payroll, leave |
| Procurement | `/procurement` | Shopping | Procurement plans, RFQs, contracts, vendors |
| Inventory | `/inventory/items` | Package | Stock management, warehouses, BOMs |
| Expense | `/expense` | Receipt | Employee expense claims and advances |
| Projects | `/projects` | Folder | Project tracking, tasks, time entry |
| Fleet | `/fleet` | Truck | Vehicle management, maintenance, fuel |
| Support | `/support/tickets` | Headset | Internal helpdesk and ticket management |
| Admin | `/admin` | Shield | System administration (admin users only) |

### In-Module Navigation
Each module has its own sidebar layout with:
- **Collapsible sidebar** (persisted via localStorage)
- **Module-specific navigation** organized into sections
- **"Switch Module" links** at the bottom to jump between modules
- **Top bar** with page title, search (Cmd+K command palette), dark mode toggle, and notification bell
- **Quick actions** accessible via keyboard shortcuts

---

## 3. Finance Module

The Finance module is the core of the IPSAS-compliant public sector ERP. For NBTI (configured as `sector_type=PUBLIC`, `framework=IPSAS`), all terminology automatically adjusts to public sector standards.

### 3.1 Finance Dashboard (`/finance/dashboard`)

**Page Title:** "Public Finance Overview" (IPSAS) | "Financial Overview" (private)

**Hero Statistics (4 cards):**
- **Total Revenue** - Aggregate revenue for the period
- **Total Expenditure** - All expenditure categories (IPSAS term; "Expenses" for private)
- **Surplus/Deficit** - Revenue minus expenditure (IPSAS term; "Net Income" for private)
- **Net Cash Flow** - With inflow/outflow breakdown

**Secondary Metrics Bar:**
- Cost of Services (IPSAS) | COGS (private)
- Operating Expenditure (IPSAS) | OpEx (private)
- AR Control balance
- AP Control balance

**Reconciliation Alerts:**
- Warning banners if AR or AP subledger has reconciliation variances

**Charts (7 visualizations):**
1. **Revenue vs Expenditure** - 12-month trend line chart
2. **Cash Flow** - Grouped bar chart (inflow/outflow by month)
3. **Operating Result** (IPSAS) | Profit Margin (private) - Doughnut gauge with gross/net percentages
4. **Top Revenue Sources** (IPSAS) | Top Customers (private) - Horizontal bar chart
5. **Top Vendors** (IPSAS) | Top Suppliers (private) - Horizontal bar chart by expenditure
6. **Account Mix** - Donut chart by GL category
7. **AR Aging** - Donut chart (Current, 1-30, 31-60, 60+ days)

**Bottom Row:**
- **Net Current Position** (IPSAS) | Working Capital (private) - AR vs AP bar comparison
- **Invoice Status** - AR pipeline donut (Draft/Posted/Paid)
- **Bills Status** - AP pipeline donut (Draft/Posted/Paid)

**Quick Actions (keyboard shortcuts):**
- `J` - New Journal Entry
- `I` - Create Invoice
- `B` - Record Bill
- `R` - Record Receipt

**Report Tiles (8 quick-access links):**
Trial Balance, Statement of Financial Performance, Statement of Financial Position, Cash Flow, AR Aging, AP Aging, Bank Reconciliation, Journal Entries

---

### 3.2 General Ledger

#### Chart of Accounts (`/finance/gl/accounts`)
The chart of accounts is pre-configured with Federal Government economic codes and a 6-segment structure:

**Segment Structure:**
| Segment | Purpose | Example |
|---------|---------|---------|
| Administrative | Ministry/Department/Agency | NBTI Head Office |
| Economic | Revenue/Expenditure classification | Personnel Costs |
| Fund | Source of funding | Capital Fund |
| Functional | Government function | Technology Development |
| Program | Budget program | Incubation Support |
| Project | Specific project | TIC Abuja Expansion |

**Features:**
- Hierarchical account tree with parent/child relationships
- Account types: Control, Posting, Statistical
- Normal balance designation (Debit/Credit)
- IFRS/IPSAS classification
- Active/inactive status management
- Search and filter by code, name, category
- Multi-currency support per account

**Screens:**
- Account list with tree view (`/finance/gl/accounts`)
- Account form - create/edit (`/finance/gl/accounts/new`)
- Account detail view

#### Journal Entries (`/finance/gl/journals`)
**Journal Types:**
- Standard - Regular transactions
- Adjustment - Period-end adjustments
- Closing - Year-end closing entries
- Opening - Opening balance entries
- Reversal - Linked reversal with audit trail
- Recurring - Template-based auto-generation
- Intercompany - Cross-entity transactions
- Revaluation - Foreign currency revaluation
- Consolidation - Group consolidation entries

**Workflow:** Draft → Submitted → Approved → Posted → (Reversed/Voided)

**Features:**
- Multi-line debit/credit entry with auto-balancing
- Period validation (prevents posting to closed periods)
- Sequential journal numbering
- Attachment support
- Correlation tracking (links to source documents)
- Segregation of duties (creator cannot approve)
- Optimistic locking for concurrent access

**Screens:**
- Journal list with status filters (`/finance/gl/journals`)
- Journal entry form (`/finance/gl/journals/new`)
- Journal detail with posting history
- Reversal form

#### General Ledger Report (`/finance/gl/ledger`)
- Drill-down by account, period, and date range
- Debit/credit/balance columns
- Running balance calculation

#### Fiscal Periods (`/finance/gl/periods`)
**Period States:**
| State | Description | Posting Allowed |
|-------|-------------|-----------------|
| Future | Not yet open | No |
| Open | Current period | Yes |
| Soft Closed | Period-end in progress | Adjustment entries only |
| Hard Closed | Finalized | No |
| Reopened | Temporarily reopened | Yes (tracked) |

**Features:**
- Open/close periods with authorization
- Adjustment period flag for year-end
- Reopen tracking with count and timestamps
- User audit trail (who closed/reopened)

**Screens:**
- Period list (`/finance/gl/periods`)
- Period close form (`/finance/gl/period-close`)

#### Trial Balance (`/finance/gl/trial-balance`)
- As-of-date selection
- Debit/credit totals by account
- Balance verification
- Export capability

---

### 3.3 IPSAS Fund Accounting

This section appears in the Finance sidebar **only for IPSAS/PUBLIC organizations** where `fund_accounting_enabled = true`.

#### Funds (`/finance/ipsas/funds`)
Funds represent separate accounting entities for tracking restricted and unrestricted resources.

**Fund Types:**
| Type | Purpose |
|------|---------|
| General | Unrestricted operating fund |
| Capital | Capital expenditure projects |
| Special | Earmarked special-purpose funds |
| Donor | Foreign aid and grant funding |
| Trust | Fiduciary/trust funds |
| Revolving | Self-replenishing funds |
| Consolidated | Consolidated revenue fund |

**Screens:**
- Fund list with status, type, and balance overview (`/finance/ipsas/funds`)
- Fund creation form (`/finance/ipsas/funds/new`)
- Fund detail with linked appropriations and transactions

#### Appropriations (`/finance/ipsas/appropriations`)
Appropriations represent legislative budget authority granted through the Appropriation Act.

**Appropriation Types:**
- Original - Initial approved budget
- Supplementary - Mid-year amendments
- Virement In - Budget transferred in
- Virement Out - Budget transferred out
- Reduction - Budget cuts

**Workflow:** Draft → Submitted → Approved → Active → Lapsed/Closed

**Fields:**
- Appropriation code and name
- Fund linkage
- Approved amount and revised amount
- Fiscal year
- Account/cost center/business unit linkage
- Legislative reference (Appropriation Act number)
- Approval authority and date

**Screens:**
- Appropriation list with status, fund, and amounts (`/finance/ipsas/appropriations`)
- Appropriation form (`/finance/ipsas/appropriations/new`)
- Appropriation detail with allotments and utilization

#### Commitments (`/finance/ipsas/commitments`)
Commitments encumber funds when a purchase order or contract is raised, preventing overspending.

**Commitment States:**
| State | Triggered By |
|-------|-------------|
| Pending | PO created, awaiting approval |
| Committed | PO approved, funds encumbered |
| Obligated | Invoice received against PO |
| Partially Paid | Partial payment made |
| Expended | Fully paid |
| Cancelled | PO cancelled, funds released |

**Budget Control:**
- System validates commitment against available balance
- **Hard control**: Blocks commitments that exceed appropriation
- Links to appropriation, fund, and account

**Screens:**
- Commitment register with filters (`/finance/ipsas/commitments`)
- Commitment form (`/finance/ipsas/commitments/new`)
- Commitment detail with payment history

#### Virements (`/finance/ipsas/virements`)
Virements are formal budget transfers between appropriation heads, requiring approval.

**Workflow:** Draft → Submitted → Approved → Applied → (Rejected)

**Fields:**
- Virement number (auto-generated, unique per organization)
- Description and justification (mandatory)
- Source appropriation/fund/account
- Destination appropriation/fund/account
- Amount and currency
- Approval authority reference

**Controls:**
- Source and destination must differ
- Creator cannot approve (segregation of duties)
- All transitions timestamped
- Approval audit trail

**Screens:**
- Virement list (`/finance/ipsas/virements`)
- Virement form (`/finance/ipsas/virements/new`)
- Virement detail with approval history

#### Budget Comparison (`/finance/ipsas/budget-comparison`)
Side-by-side comparison of budget vs actual performance (IPSAS 24).

**Columns:**
| Column | Description |
|--------|-------------|
| Appropriation | Budget head |
| Original Budget | Approved amount |
| Revised Budget | After virements/supplements |
| Committed | Open PO value |
| Obligated | Unpaid invoice value |
| Expended | Payments made |
| Available Balance | Remaining budget |
| Utilization % | Percentage consumed |

**Filters:** Fund, fiscal year, account, cost center

#### Available Balance (`/finance/ipsas/available-balance`)
Real-time calculation of remaining budget by appropriation.

**Formula:**
```
Available Balance = Appropriation Amount
                  - Commitments (Open POs)
                  - Obligations (Unpaid Invoices)
                  - Expenditure (Payments Made)
                  + Virement In
                  - Virement Out
```

**Views:** By appropriation, by fund, by account

---

### 3.4 Accounts Payable (Creditors)

In IPSAS mode, "Suppliers" are labeled **"Creditors"** throughout the interface.

#### Creditor Register (`/finance/ap/suppliers`)
- Creditor master with compliance tracking
- Tax clearance, pension, ITF, NSITF compliance fields
- Bank details for payment processing
- Category classification
- Active/inactive status

#### Purchase Orders (`/finance/ap/purchase-orders`)
- PO creation from approved requisitions
- Line items with quantities, unit prices, GL accounts
- Budget check against available balance (IPSAS commitment control)
- Multi-level approval workflow
- Status tracking: Draft → Approved → Partially Received → Completed

#### Goods Receipts (`/finance/ap/goods-receipts`)
- Record physical receipt of goods against PO
- Line-by-line quantity verification
- Partial receipt support
- Triggers 3-way matching readiness

#### Creditor Invoices (`/finance/ap/invoices`)
**Invoice Types:** Standard, Credit Note, Debit Note

**3-Way Matching:**
1. Purchase Order (what was ordered)
2. Goods Receipt (what was received)
3. Supplier Invoice (what was billed)

**WHT (Withholding Tax) Computation:**
| Payment Type | WHT Rate |
|-------------|----------|
| Contract | 5% |
| Professional Services | 10% |
| Rent | 10% |
| Dividend | 10% |

- Automatic WHT calculation on invoice lines
- WHT credit note generation
- Tax code reference with rate snapshots
- Compound tax support

**Workflow:** Draft → Submitted → Pending Approval → Approved → Posted → Partially Paid → Paid

**Screens:**
- Invoice list with status filters
- Invoice form with line items, tax, and matching
- Invoice detail with payment allocation history
- Bulk invoice processing

#### Payments (`/finance/ap/payments`)
**Payment Methods:**
- Remita (Primary - TSA compliant)
- Bank Transfer
- Cheque (with register)
- ACH
- Cash

**Features:**
- Single or batch payment processing
- Multi-invoice allocation
- WHT deduction at payment
- Functional currency conversion
- Payment date and reference tracking

#### Payment Batches (`/finance/ap/payment-batches`)
- Aggregate multiple payments into a batch
- Batch approval workflow
- Status: Draft → Submitted → Approved → Posted → Paid
- Total validation and currency consolidation

#### AP Aging Report (`/finance/ap/aging`)
- Aging buckets: Current, 31-60, 61-90, Over 90 days
- By creditor and organization-wide summary
- Point-in-time snapshots for trend analysis
- Amount in functional and original currency

---

### 3.5 Accounts Receivable (Debtors)

In IPSAS mode, "Customers" are labeled **"Debtors"** and Quotes/Sales Orders are hidden (not applicable to government).

#### Debtor Register (`/finance/ar/customers`)
- Debtor master data
- Contact information and bank details
- Payment terms configuration
- Credit limit management

#### Invoices (`/finance/ar/invoices`)
**Invoice Types:** Standard, Credit Note, Debit Note, Proforma

**Revenue Types for NBTI:**
- Facility usage fees
- Training program fees
- Consultancy income
- Equipment rental
- Application fees
- Other internally generated revenue

**Workflow:** Draft → Submitted → Approved → Posted → Partially Paid → Paid → (Overdue/Void/Disputed)

#### Credit Notes (`/finance/ar/credit-notes`)
- Issue credit against existing invoices
- GL reversal posting

#### Receipts (`/finance/ar/receipts`)
- Record payments received from debtors
- Multi-invoice allocation
- Remita RRR integration for government revenue collection
- TSA remittance tracking
- GL posting via AR Posting Saga

#### AR Aging Report (`/finance/ar/aging`)
- Same aging bucket structure as AP
- Debtor-level and organization-wide views
- Overdue tracking and follow-up support

---

### 3.6 Treasury & Banking

#### Bank Accounts (`/finance/banking/accounts`)
- Multiple account types: Checking, Savings, Money Market, Credit Line
- TSA sub-account support
- Bank details: Name, code (SWIFT/BIC), branch, IBAN
- GL account linkage
- Balance tracking in designated currency
- Active/Inactive/Closed/Suspended status

#### Bank Statements (`/finance/banking/statements`)
- Import bank statements (CSV/OFX)
- Statement header with opening/closing balances
- Line-by-line transaction detail
- Date range tracking

#### Bank Reconciliation (`/finance/banking/reconciliations`)
**Match Types:**
| Type | Description |
|------|-------------|
| Auto Exact | System-matched by amount and reference |
| Auto Fuzzy | Matched by approximate amount/date |
| Manual | User-matched |
| Split | One-to-many or many-to-one matching |
| Adjustment | Reconciling adjustment entries |

**Workflow:** Draft → Pending Review → Approved → (Rejected)

**Features:**
- Automatic matching algorithms
- Rules-based categorization
- Variance tracking
- Period-based reconciliation (start/end dates)
- Bank account and GL balance comparison

#### Payees (`/finance/banking/payees`)
- Payee master for recurring payments
- Bank details stored securely

#### Rules (`/finance/banking/rules`)
- Auto-categorization rules for imported transactions
- Pattern matching on description/amount/reference

---

### 3.7 Fixed Assets

#### Asset Register (`/fixed-assets/assets`)
- Comprehensive asset database
- Status: Active, Disposed, Impaired, Fully Depreciated
- Original cost, accumulated depreciation, net book value
- Location tracking
- Component-level tracking

**Asset Classifications for NBTI:**
- Land and Buildings
- Plant and Machinery
- Motor Vehicles
- Furniture and Fittings
- Computer Equipment
- Laboratory Equipment
- Office Equipment

#### Asset Categories (`/fixed-assets/categories`)
- Hierarchical category structure
- Depreciation rules per category
- Useful life defaults
- GL account mappings

#### Depreciation (`/fixed-assets/depreciation`)
**Methods:**
- Straight-line
- Accelerated (reducing balance)
- Production units

**Features:**
- Automated periodic depreciation runs
- Batch processing with GL posting
- Component depreciation (IAS 16)
- Residual value tracking
- Run status: Draft → Posted → Reversed

#### Additional Fixed Asset Features:
- **Asset Revaluation** - Fair value adjustments (IAS 36)
- **Asset Disposal** - Retirement, sale, write-off workflows
- **Asset Impairment** - Impairment testing via Cash Generating Units
- **Capitalization** - Convert WIP to fixed assets

---

### 3.8 Tax Management

#### Tax Jurisdictions (`/finance/tax/jurisdictions`)
- Multi-jurisdiction setup (Federal, State, Local)
- Tax authority details

#### Tax Codes (`/finance/tax/codes`)
- Tax rate configuration
- Compound tax support (sequential application)
- Inclusive/exclusive designation
- Recoverable vs non-recoverable

#### Tax Periods (`/finance/tax/periods`)
- Filing period management
- Open/close periods

#### Tax Returns (`/finance/tax/returns`)
- Return generation from transaction data
- Status tracking: Draft → Filed → Assessed

#### Deferred Tax (`/finance/tax/deferred`)
- IAS 12 compliant deferred tax accounting
- Temporary difference tracking
- Deferred tax asset/liability calculation

#### Additional Tax Screens:
- VAT Register
- Tax Liability overview
- Tax Transactions detail
- Overdue tax items
- WHT Report

---

### 3.9 Lease Accounting

IFRS 16 / IPSAS 43 compliant lease management.

#### Lease Contracts (`/finance/lease/contracts`)
- Operating and finance lease classification
- Right-of-use (ROU) asset calculation
- Lease liability amortization schedule

#### Screens:
- Contract list and CRUD
- Payment schedule
- Lease modifications
- Variable payments
- Overdue tracking
- GL posting integration

---

### 3.10 Financial Reports

All reports accessible at `/finance/reports` with individual pages:

| Report | URL | IPSAS Label |
|--------|-----|-------------|
| Trial Balance | `/finance/reports/trial-balance` | Trial Balance |
| Income Statement | `/finance/reports/income-statement` | Statement of Financial Performance |
| Balance Sheet | `/finance/reports/balance-sheet` | Statement of Financial Position |
| Cash Flow | `/finance/reports/cash-flow` | Cash Flow Statement |
| Changes in Equity | `/finance/reports/changes-in-equity` | Changes in Net Assets |
| Budget vs Actual | `/finance/reports/budget-vs-actual` | Statement of Comparison of Budget and Actual |
| General Ledger | `/finance/reports/general-ledger` | General Ledger |
| AP Aging | `/finance/reports/ap-aging` | Creditor Aging |
| AR Aging | `/finance/reports/ar-aging` | Debtor Aging |
| Expense Summary | `/finance/reports/expense-summary` | Expenditure Summary |
| Tax Summary | `/finance/reports/tax-summary` | Tax Summary |
| Tax by Type | `/finance/reports/tax-by-type` | Tax by Type |
| WHT Report | `/finance/reports/wht-report` | WHT Report |
| Reports Dashboard | `/finance/reports` | Reports Overview |

---

### 3.11 Automation

#### Recurring Transactions (`/automation/recurring`)
- Template-based auto-generation
- Frequency: Daily, Weekly, Biweekly, Monthly, Quarterly, Semi-Annual, Annual
- Generate: Invoices, Bills, Expenses, Journal Entries
- Status: Active, Paused, Completed, Expired, Cancelled

#### Workflow Rules (`/automation/workflows`)
- Configurable approval workflows
- Rule versioning
- Execution monitoring
- Status tracking

#### Custom Fields (`/automation/fields`)
- Extend any entity with additional fields
- Field types, validation rules
- Organization-scoped

#### Document Templates (`/automation/templates`)
- Letter and document generation templates
- Variable substitution
- Output format configuration

---

### 3.12 Remita / TSA Payments

#### Remita Integration (`/finance/remita`)
- Generate Remita Retrieval Reference (RRR)
- TSA-compliant payment processing
- Payment verification and status tracking

**Service Types:**
- PAYE
- NHF (National Housing Fund)
- Pension
- NSITF
- Taxes
- Procurement Fees

---

### 3.13 Import / Export

#### Data Import/Export (`/finance/import-export`)
- Accounts import/export
- Assets import/export
- Banking data export
- Contacts import/export
- Expenses import/export
- Invoices import/export
- Items import/export
- Payments import/export
- Opening balance import

---

### 3.14 Finance Settings

| Setting Page | URL | Purpose |
|-------------|-----|---------|
| Organization | `/finance/settings/organization` | Legal name, addresses, tax IDs |
| Branding | `/finance/settings/branding` | Logo, colors, letterhead |
| Email | `/finance/settings/email` | SMTP profiles, module routing |
| Features | `/finance/settings/features` | Enable/disable modules |
| Numbering | `/finance/settings/numbering` | Invoice/PO/journal sequences |
| Payments | `/finance/settings/payments` | Payment methods, terms |
| Payroll | `/finance/settings/payroll` | Payroll configuration |
| Paystack | `/finance/settings/paystack` | Payment gateway setup |
| Automation | `/finance/settings/automation` | Workflow defaults |
| Reports | `/finance/settings/reports` | Report preferences |

---

## 4. People & HR Module

### 4.1 HR Core

#### Employees (`/people/hr/employees`)
Full employee lifecycle management with tabbed detail views.

**Employee Record Tabs:**
- Personal Information
- Employment Details (grade, designation, department)
- Documents (upload and manage)
- Qualifications and Certifications
- Dependents
- Skills and Competencies
- Discipline History

**Additional HR Screens:**
- Departments CRUD
- Designations CRUD
- Employment Types
- Grades/Salary Bands
- Locations and Geofencing
- Organization Chart
- Job Descriptions CRUD

#### HR Lifecycle (`/people/hr/lifecycle`)
- **Promotions** - CRUD with approval workflow
- **Transfers** - Inter-department/location transfers with CRUD

#### Discipline (`/people/hr/discipline`)
- Disciplinary case management
- Query letter generation
- Decision letter generation
- Status tracking

#### Employee Handbook (`/people/hr/handbook`)
- Digital handbook documents
- Version management
- Employee acknowledgment tracking

#### Info Change Requests (`/people/hr/info-changes`)
- Employee-initiated data change requests
- Approval workflow
- Audit trail

#### Onboarding Administration (`/people/onboarding/admin`)
- Dashboard for onboarding progress
- Template management
- Employee onboarding tracking
- Task assignment and completion

---

### 4.2 Payroll

#### Payroll Runs (`/people/payroll/runs`)
Full payroll processing cycle.

**Screens:**
- Payroll run list with status
- Run creation and processing
- Adjustments and variances
- Draft notification emails

#### Pay Slips (`/people/payroll/slips`)
- Individual payslip generation
- Compact and detailed views
- PDF export
- Email distribution

#### Salary Components (`/people/payroll/components`)
- Component master (basic salary, allowances, deductions)
- CRUD management

#### Salary Structures (`/people/payroll/structures`)
- Structure templates with component assignments
- CRUD management

#### Assignments (`/people/payroll/assignments`)
- Assign structures to employees
- Individual and bulk assignment
- Effective date tracking

#### Tax Configuration
- Tax bands and brackets
- Tax calculator
- Employee tax profiles CRUD

#### Loans (`/people/payroll/loans`)
- Loan types configuration
- Loan application and approval
- Repayment scheduling via payroll deduction

#### Payroll Reports
- Payroll summary
- By department
- By component
- Tax deductions
- Loan repayments
- Bank file generation

---

### 4.3 Leave Management

#### Leave Applications (`/people/leave/applications`)
- Apply for leave with type, dates, reason
- Approval workflow
- Balance checking before approval
- Calendar view

#### Leave Allocations (`/people/leave/allocations`)
- Annual leave quota assignment
- Carry-forward rules
- Pro-rata calculation

#### Leave Types (`/people/leave/types`)
- Configure leave types (Annual, Sick, Maternity, etc.)
- Accrual rules and limits

#### Holidays (`/people/leave/holidays`)
- Public holiday calendar
- Organization-specific holidays

#### Leave Reports
- Leave balance report
- Leave calendar (team view)
- Leave trends analysis
- Usage by department

---

### 4.4 Attendance

#### Attendance Records (`/people/attendance/records`)
- Daily attendance logging
- Manual entry form

#### Attendance Requests (`/people/attendance/requests`)
- Regularization requests
- Approval workflow

#### Shift Management (`/people/attendance/shifts`)
- Shift definition (times, break periods)
- Assignment to employees

#### Attendance Reports
- By employee
- Late arrival / early departure
- Summary statistics
- Trends analysis

---

### 4.5 Scheduling

#### Work Schedules (`/people/scheduling`)
- Schedule generation
- Assignment management
- Shift patterns configuration
- Swap request handling

---

### 4.6 Recruitment

#### Job Openings (`/people/recruit/openings`)
- Create and publish vacancies
- Department and designation linkage

#### Applicants (`/people/recruit/applicants`)
- Applicant tracking
- Resume/document management
- Status pipeline

#### Interviews (`/people/recruit/interviews`)
- Schedule interviews
- Panel assignment
- Feedback recording

#### Offers (`/people/recruit/offers`)
- Offer letter generation
- Approval workflow
- Acceptance tracking

#### Recruitment Reports
- Pipeline overview
- Source effectiveness
- Time-to-hire analysis
- Hiring funnel

---

### 4.7 Training

#### Training Programs (`/people/training/programs`)
- Program catalog
- CRUD management

#### Training Events (`/people/training/events`)
- Schedule training sessions
- Participant enrollment
- Completion tracking

#### Training Reports
- By department
- Completion rates
- Cost analysis
- Effectiveness evaluation

---

### 4.8 Performance Management

#### KRAs (Key Result Areas) (`/people/perf/kras`)
- Define organizational KRAs
- Department-level cascading

#### KPIs (Key Performance Indicators) (`/people/perf/kpis`)
- Measurable indicators linked to KRAs
- Target setting

#### Appraisals (`/people/perf/appraisals`)
- Appraisal cycles and templates
- Self-assessment
- Manager review
- Calibration sessions
- Finalization

#### Scorecards (`/people/perf/scorecards`)
- Balanced scorecard approach
- Item-level scoring
- Finalization workflow

#### Feedback (`/people/perf/feedback`)
- 360-degree feedback
- Request and submit feedback
- Anonymous option

#### Performance Reports
- Individual performance
- Department comparison
- Trend analysis
- Rating distribution

---

### 4.9 Employee Self-Service

A portal for employees to manage their own data.

| Screen | URL | Purpose |
|--------|-----|---------|
| Payslips | `/people/self/payslips` | View and download payslips |
| Leave | `/people/self/leave` | Apply for and track leave |
| Attendance | `/people/self/attendance` | View attendance records |
| Expenses | `/people/self/expenses` | Submit expense claims |
| Tax Info | `/people/self/tax` | View tax deduction details |
| Discipline | `/people/self/discipline` | View disciplinary records |
| Tasks | `/people/self/tasks` | Assigned onboarding/workflow tasks |
| Team Leave | `/people/self/team-leave` | View team leave calendar |
| Team Expenses | `/people/self/team-expenses` | Review team expense submissions |
| Tickets | `/people/self/tickets` | Internal support tickets |

---

## 5. Procurement Module

### Dashboard (`/procurement`)
Overview of procurement activity, pending actions, and pipeline status.

### Procurement Plans (`/procurement/plans`)
Annual procurement planning aligned with budget.

**Fields:**
- Plan items with descriptions and specifications
- Budget line linkage (economic code)
- Estimated value
- Procurement method (based on PPA 2007 thresholds)
- Planned quarter
- Justification

**Workflow:** Draft → Submitted → Approved → Active → Closed

### Purchase Requisitions (`/procurement/requisitions`)
Internal purchase requests with approval workflows.

**Workflow:**
```
Requester → Supervisor → Budget Officer → Procurement Unit
    ↓           ↓              ↓                ↓
  Create     Review        Verify           Process
  Request    & Approve     Budget          Requisition
```

**Fields:**
- Line items with quantities and specifications
- Urgency level: Normal, Urgent, Emergency
- Budget verification (real-time available balance check)
- Attachment support

**Workflow:** Draft → Submitted → Budget Verified → Approved → Converted → (Rejected/Cancelled)

### RFQs (`/procurement/rfqs`)
Request for Quotation management.

**Fields:**
- RFQ number (auto-generated)
- Procurement method: Direct, Selective, Open Competitive
- Estimated value (determines approval threshold)
- Closing date for submissions
- Evaluation criteria (configurable weights)
- Terms and conditions

**Workflow:** Draft → Published → Closed → Evaluated → Awarded → (Cancelled)

### Vendor Invitations
- Select vendors from prequalified registry
- Send invitations with RFQ details
- Track invitation and response status

### Quotation Responses
- Record vendor submissions
- Quote amount, terms, lead time
- Status: Received → Under Evaluation → Accepted/Rejected

### Bid Evaluation (`/procurement/evaluations`)
**Evaluation Matrix:**
| Criterion | Weight | Description |
|-----------|--------|-------------|
| Price | 60% | Competitive pricing |
| Technical Capability | 20% | Capacity to deliver |
| Delivery Timeline | 10% | Speed of delivery |
| Past Performance | 10% | Track record |

- Criterion-by-criterion scoring per vendor
- Evaluator comments
- Comparative side-by-side analysis
- Recommendation report generation

### Approval Thresholds (PPA 2007)
| Value Range (NGN) | Method | Approving Authority |
|-------------------|--------|---------------------|
| < 2,500,000 | Direct Procurement | Accounting Officer |
| 2,500,000 - 50,000,000 | Selective Tendering | Tenders Board |
| 50,000,000 - 1,000,000,000 | Open Competitive | Ministerial Tenders Board |
| > 1,000,000,000 | Open Competitive | Federal Executive Council |

- Automatic routing based on value
- BPP clearance number and date tracking
- Certificate of No Objection tracking

### Contracts (`/procurement/contracts`)
**Fields:**
- Contract number, supplier linkage
- Source RFQ and bid evaluation reference
- Contract value, currency, payment terms
- Start date, end date
- BPP clearance number and date
- Performance bonds and insurance requirements
- Penalties and incentives

**Workflow:** Draft → Active → Completed → Terminated/Expired

### Vendor Management (`/procurement/vendors`)
**Vendor Register:**
- Self-service registration
- Category classification
- Bank details and contact information

**Prequalification (`/procurement/vendors/prequalification`):**
- Status: Pending → Under Review → Qualified → (Disqualified/Expired/Blacklisted)
- Compliance checks:
  - Tax Clearance Certificate
  - Pension Compliance
  - ITF Compliance
  - NSITF Compliance
- Capability scoring:
  - Financial capability score
  - Technical capability score
  - Overall score
- Validity period tracking
- Category of prequalification

---

## 6. Inventory Module

### Sidebar Navigation:
- Items, Categories, Warehouses
- Transactions (adjustments, issues, receipts, transfers)
- Bill of Materials
- Lots
- Physical Counts
- Material Requests
- Price Lists
- Reports

### Items (`/inventory/items`)
- Item master with detail view
- Category and warehouse assignment
- Stock levels and reorder points
- Pricing and cost tracking

### Warehouses (`/inventory/warehouses`)
- Multiple warehouse management
- Location tracking
- Capacity management

### Bill of Materials (`/inventory/boms`)
- Multi-level BOM structure
- Component quantities
- Cost roll-up

### Material Requests (`/inventory/material-requests`)
- Internal stock requests
- Approval workflow
- Reporting

### Physical Counts (`/inventory/counts`)
- Stock-take management
- Variance identification
- Adjustment posting

### Reports
- Stock on hand
- Transaction history
- Valuation reports

---

## 7. Expense Management

### Dashboard (`/expense`)
Overview of expense claims, pending approvals, and spending trends.

### Expense Claims (`/expense/claims`)
- Create expense reports with line items
- Category assignment
- Receipt attachment
- Approval workflow
- Reimbursement tracking

### Cash Advances (`/expense/advances`)
- Request and track cash advances
- Settlement against expense claims

### Expense Limits
- Rule-based spending limits
- Approver configuration
- Limit evaluation and usage tracking

### Expense Reports
- By category
- By employee
- Summary
- Trends analysis

---

## 8. Project Management

### Projects (`/projects`)
- Project list and CRUD
- **Gantt Chart** view (`/projects/{id}/gantt`)
- Milestones tracking
- Team management
- Attachments
- Project expenses
- Resource utilization

### Tasks (`/projects/tasks`)
- Task CRUD within projects
- Global task list and form
- Assignment and status tracking

### Time Tracking (`/projects/time`)
- Timesheet entry
- Time log list
- Project time allocation

### Project Templates (`/projects/templates`)
- Reusable project structures
- Template CRUD

---

## 9. Fleet Management

### Dashboard (`/fleet`)
Fleet overview with vehicle status and maintenance alerts.

### Vehicles (`/fleet/vehicles`)
- Vehicle register with full details
- Status tracking
- Assignment to departments/staff

### Maintenance (`/fleet/maintenance`)
- Scheduled and unscheduled maintenance
- Service history
- Cost tracking

### Fuel Management (`/fleet/fuel`)
- Fuel consumption logging
- Cost tracking
- Efficiency reporting

### Reservations (`/fleet/reservations`)
- Vehicle booking system
- Availability calendar
- Approval workflow

### Incidents (`/fleet/incidents`)
- Accident/incident reporting
- Investigation tracking
- Resolution documentation

### Vehicle Documents (`/fleet/documents`)
- Registration, insurance, licenses
- Expiry alerts
- Document upload

---

## 10. Support / Helpdesk

### Tickets (`/support/tickets`)
- Create and track support tickets
- Category assignment
- Priority and urgency levels
- Assignment to support teams

### SLA Dashboard (`/support/sla-dashboard`)
- SLA compliance monitoring
- Response and resolution time tracking

### Teams (`/support/teams`)
- Support team management
- Member assignment

### Categories (`/support/categories`)
- Ticket category configuration

### Reports
- Aging report
- Breached tickets
- Archived tickets

---

## 11. Careers Portal

A public-facing portal for job applicants.

### Screens:
- Job listing (`/careers`)
- Job detail page
- Application form
- Confirmation page
- Application status check (with form, detail, and expired views)

---

## 12. Onboarding Portal

A self-service portal for new hires completing onboarding.

### Screens:
- Dashboard with task checklist
- Company information
- Task detail and completion
- Session expiry handling

---

## 13. Administration

### Admin Dashboard (`/admin`)
System overview and quick actions.

### Organization Management (`/admin/organizations`)
- Create and manage organizations
- Multi-tenant configuration

### User Management (`/admin/users`)
- Create and manage user accounts
- Role assignment
- Active/inactive status

### Role Management (`/admin/roles`)
- Define roles with permission sets
- Role profiles and descriptions
- 29 pre-configured roles with 524 permissions

### Permission Management (`/admin/permissions`)
- Granular permission configuration
- Module-scoped permissions (e.g., `finance:gl:journals:create`)

### Settings (`/admin/settings`)
- Platform-wide configuration
- Module feature toggles

### Scheduled Tasks (`/admin/tasks`)
- Background job management
- Task scheduling

### Audit Logs (`/admin/audit-logs`)
- Complete audit trail of all system actions
- User, action, entity, timestamp tracking
- Filterable and searchable

### Data Sync
- CRM sync dashboard and configuration
- External system integration management

---

## 14. IPSAS Terminology Reference

When the organization is configured as `PUBLIC` sector with `IPSAS` framework, the following terminology changes apply automatically throughout the entire application:

| Private Sector Term | IPSAS Public Sector Term | Where Applied |
|---------------------|--------------------------|---------------|
| Suppliers | Creditors | AP module, sidebar, reports |
| Customers | Debtors | AR module, sidebar, reports |
| Statement of Profit or Loss | Statement of Financial Performance | Reports, dashboard |
| Expenses | Expenditure | Dashboard, reports, labels |
| Changes in Equity | Changes in Net Assets | Reports |
| Net Income | Surplus/Deficit | Dashboard |
| COGS | Cost of Services | Dashboard |
| OpEx | Operating Expenditure | Dashboard |
| Revenue vs Expenses | Revenue vs Expenditure | Charts |
| Profit Margin | Operating Result | Charts |
| Gross Margin | Gross Result | Charts |
| Net Margin | Net Result | Charts |
| Top Customers | Top Revenue Sources | Charts |
| Top Suppliers | Top Vendors | Charts |
| By revenue | By collections | Chart labels |
| By spend | By expenditure | Chart labels |
| Working Capital | Net Current Position | Dashboard |
| P&L Statement | Performance Statement | Report tiles |
| Financial Overview | Public Finance Overview | Dashboard title |
| Quotes | *Hidden* | AR sidebar |
| Sales Orders | *Hidden* | AR sidebar |

**Additional IPSAS Features (visible only for PUBLIC sector):**
- IPSAS sidebar section with Fund Accounting
- Fund accounting enabled (`fund_accounting_enabled = true`)
- Commitment control enabled (`commitment_control_enabled = true`)
- Hard budget controls preventing overspending
- Appropriation-based budget management

---

## Application Statistics

| Metric | Count |
|--------|-------|
| Total HTML templates | ~450 |
| Finance templates | 143 |
| People/HR templates | ~140 |
| Inventory templates | 31 |
| Expense templates | 22 |
| Project templates | 20 |
| Procurement templates | 19 |
| Fleet templates | 18 |
| Support templates | 12 |
| Document templates | 12 |
| Database schemas | 38 |
| Financial models | 150+ |
| Pre-configured permissions | 524 |
| Pre-configured roles | 29 |
| Finance reports | 14 |
| Web route files | 65+ |

---

*Generated for National Board for Technology Incubation (NBTI)*
*DotMac ERP - IPSAS-Compliant Government Enterprise Resource Planning*
*https://nbti.dotmac.io*
