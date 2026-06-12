# Job Management System

A modern job assignment and workflow management application built with Next.js, TypeScript, PostgreSQL, Drizzle ORM, and ShadCN UI.

## Live Demo

🚀 **The application is deployed and publicly accessible at:**

**https://voicescript-assessment.lucrorium.dev**

Feel free to explore the application without needing to run it locally.

## Features

### Dashboard

- Total Jobs overview
- Active Jobs overview
- Completed Jobs overview
- Total Payout tracking
- Recent Jobs activity
- Workflow statistics and charts

### People Management

Manage available personnel:

#### Reporters

- Create reporter profiles
- Configure rate type (Minute / Flat)
- Configure rates
- Manage availability

#### Editors

- Create editor profiles
- Configure rate type (Minute / Flat)
- Configure rates
- Manage availability

### Job Management

Create and manage jobs with:

- Job name
- Duration
- Location
- City assignment
- Reporter assignment
- Editor assignment
- Workflow status

### Workflow

Jobs follow the workflow:

```text
NEW
 ↓
ASSIGNED
 ↓
TRANSCRIBED
 ↓
REVIEWED
 ↓
COMPLETED
```

Every status change is logged for auditing purposes.

### Assignment System

Reporter assignment:

- Prioritizes personnel from the same city
- Displays assignment preview before saving
- Calculates payment impact immediately

Editor assignment:

- Available after transcription phase
- Assignment preview
- Payment recalculation

### Payment Calculation

#### Minute Rate

```text
Payment = Duration × Rate
```

Example:

```text
Duration = 30 minutes
Rate = Rp 5.000

Payment = Rp 150.000
```

#### Flat Rate

```text
Payment = Flat Rate
```

Example:

```text
Rate = Rp 250.000

Payment = Rp 250.000
```

### Audit Log

Tracks:

- Job creation
- Status changes
- Assignment changes
- Workflow history

---

## Screenshots

### Dashboard

Overview of job statistics, recent jobs, and payout metrics.

![Dashboard](./screenshots/dashboard.png)

---

### People Management

Manage reporters and editors, including city assignment, rates, and availability.

![People List](./screenshots/people-list.png)

---

### Create Person

Create a new reporter or editor.

![Create Person](./screenshots/add-people.png)

---

### Job List

View all jobs and their current workflow status.

![Job List](./screenshots/job-list.png)

---

---

### Add Job

Create a new job.

![Add Job](./screenshots/add-job.png)

---

### Job Assignment

Assign reporters and editors to jobs with assignment previews.

![Job Assignment](./screenshots/edit-job.png)

---

### Workflow & Payment Preview

Preview payout calculations before assignment.

![Payment Preview](./screenshots/workflow-payment.png)

---

## Technology Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- ShadCN UI
- Tailwind CSS
- React Hook Form
- TanStack Query
- Zod

### Backend

- Next.js Server Actions
- PostgreSQL
- Drizzle ORM

---

## Database Entities

### Cities

Stores supported cities.

### People

Stores reporters and editors.

```text
People
├── Name
├── City
├── Type
├── Rate Type
├── Rate
└── Availability
```

### Jobs

Stores all job information.

```text
Jobs
├── Name
├── Duration
├── Location
├── City
├── Reporter
├── Editor
├── Status
└── Rates
```

### Job Logs

Stores workflow history.

```text
JobLog
├── JobId
├── Previous Status
├── New Status
└── Timestamp
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd project-name
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

### Run Migrations

```bash
npx drizzle-kit push
```

### Start Development Server

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

## Production Build

```bash
npm run build
npm run start
```

---
