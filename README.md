# SkillBridge Attendance System

A role-based attendance management platform built with Next.js, Express, and MongoDB.

## Features

- **RBAC (Role Based Access Control):** Custom dashboards for 5 specific roles (Student, Trainer, Institution, Programme Manager, Monitoring Officer).
- **Batch Management:** Institutions and Trainers can create batches and generate invite codes.
- **Attendance Tracking:** Trainers schedule sessions, students join batches and punch in their attendance via an invite code.
- **Data Visualizations & Analytics:** Realtime aggregation of overall metrics for higher-level managers.
- **JWT Authentication:** Stateful user session managed securely via HTTP cookies.

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide React, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth

## Getting Started

### 1. Database & Backend Configuration
Navigate to the backend directory:
```bash
cd backend
npm install
```
Setup `.env` inside `/backend`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillbridge_attendance
JWT_SECRET=supersecret12345
NODE_ENV=development
```
Seed the database to get test users for every role:
```bash
npm run seed:import
# or run directly: node seed.js -i
```
Start the backend server:
```bash
npm run dev
```

### 2. Frontend Configuration
Navigate to the frontend directory:
```bash
cd frontend
npm install
```
The API is hardcoded to connect to `http://localhost:5000/api` in `src/lib/api.js`. Start the application:
```bash
npm run dev
```

### 3. Usage
- Go to `http://localhost:3000`
- To test the app quickly using populated data, try these roles (password is always `password123`):
  - Student: `student@test.com`
  - Trainer: `trainer@test.com`
  - Institution: `inst1@test.com`
  - Manager: `manager@test.com`
  - Monitor: `monitor@test.com`

---
*Built for the SkillBridge Initiative.*
