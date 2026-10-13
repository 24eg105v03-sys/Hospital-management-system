# CarePulse - Hospital Management System (HMS)

Enterprise-grade full-stack healthcare platform built with **Spring Boot** (backend) and **React.js + Vite** (frontend).

---

## 🚀 Quick Start

### 1. Run Everything (Backend + Frontend)
Double-click `run-all.bat` in the project root:
```bat
run-all.bat
```
This automatically launches:
- **Backend API**: `http://localhost:8080` (Spring Boot, JPA, Security, JWT)
- **Frontend App**: `http://localhost:3000` (React.js + Vite)
- **H2 Database Console**: `http://localhost:8080/h2-console`

---

### 2. Run Only Frontend (React)
```bash
cd frontend
npm run dev
```
Or simply double-click `run-frontend.bat`.

---

## 🏥 Modules & Features

| Module | Route | Description |
|---|---|---|
| **Landing Page** | `/` | Hero presentation, department statistics, and features overview |
| **Authentication** | `/login`, `/register` | JWT auth, role selection, and quick-fill demo credentials (Admin, Doctor, Patient) |
| **Dashboard** | `/dashboard` | Executive KPIs (Total Patients, Specialists, Today's Visits, Settled Revenue) and recent appointments |
| **Patients Directory** | `/patients` | Medical records, blood group, contact phone, allergy history, search filter, and patient registration modal |
| **Doctors Roster** | `/doctors` | Specialists cards, department filter (Cardiology, Neurology, Pediatrics, Orthopedics), consultation fees, and doctor onboarding |
| **Appointments Scheduler** | `/appointments` | Consultation booking modal with dynamic patient/doctor dropdowns, date & time selection, status workflow (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`) |
| **e-Prescriptions** | `/prescriptions` | Digital prescription management, dosages, course duration, search filter, and issue prescription modal |
| **Billing & Invoices** | `/billing` | Ledger tracking, discount calculation, settlement status (`PAID`, `UNPAID`), KPI summary, and invoice generation |

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, React Router v6, Vite, Vanilla CSS Design System, Font Awesome 6.
- **Backend**: Spring Boot 3, Spring Data JPA, Spring Security, JWT, Maven.
- **Resilience**: Full offline fallback state in the frontend ensures the UI works seamlessly whether the backend server is active or offline.