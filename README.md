# HR System - Basic HR Management Platform

A modern, fully functional HR Management System built with **Next.js 15** (App Router) + Tailwind CSS.

## Features Implemented

- **Role-based Access** (Admin, Manager, Employee)
- **Employee Management** (CRUD)
- **Attendance Tracking** (Check-in / Check-out)
- **Leave Management** (Request + Approval workflow)
- **Dashboard** with statistics
- **Responsive & Beautiful UI**

## Demo Accounts

| Role       | Email                  | Password |
|------------|------------------------|----------|
| Admin      | admin@hr.com           | any      |
| Manager    | manager@hr.com         | any      |
| Employee   | employee@hr.com        | any      |

## Getting Started

1. **Install dependencies** (already done):
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open in browser**:
```
http://localhost:3000
```

## Project Structure

```
hr-system/
├── app/
│   ├── dashboard/        # Admin & Manager dashboard
│   ├── employees/        # Employee management
│   ├── leaves/           # Leave approval
│   ├── attendance/       # Attendance records
│   ├── my-attendance/    # Employee attendance
│   ├── my-leaves/        # Employee leave requests
│   ├── reports/          # Reports page
│   ├── login/            # Login page
│   └── page.tsx          # Root redirect
├── components/
│   └── Sidebar.tsx
├── lib/
│   └── types.ts
└── app/globals.css
```

## Pages Overview

- `/login` — Login with demo accounts
- `/dashboard` — Role-based dashboard
- `/employees` — Manage employees (Admin)
- `/leaves` — Approve/reject leave requests
- `/attendance` — View attendance records
- `/my-attendance` — Employee self-service
- `/my-leaves` — Submit & view leaves

## Next Steps / Future Enhancements

- Connect real backend (Prisma + PostgreSQL)
- Add JWT Authentication
- Real-time notifications
- Export reports (PDF/CSV)
- Profile editing
- Department management

---

Built following the **HR System Plan** and **Visual Flows** previously created.
