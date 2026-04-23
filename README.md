# SkillBridge Attendance Management System

### 1. Project Overview
SkillBridge is a role-based attendance tracking platform designed to help educational institutions, trainers, and programme managers oversee student participation securely. It centralizes course batches—allowing trainers to invite students and schedule daily sessions—and lets students easily punch in their attendance. Higher-up management can view aggregate health metrics and overall participation rates.

### 2. Live URLs 
- Frontend: https://attendence-mangement-wgg6.vercel.app/
- Backend: https://attendence-mangement.onrender.com/
- API Base URL: https://attendence-mangement.onrender.com/api

### 3. Test Accounts 
*(Password for all roles is `password123`)*
- **Student**: student@test.com
- **Trainer**: trainer@test.com
- **Institution**: inst1@test.com
- **Programme Manager**: manager@test.com
- **Monitoring Officer**: monitor@test.com

### 4. Features Implemented
- Local state authentication via JWT cookies.
- Role-based redirecting and backend-enforced API protection for 5 different roles.
- Dynamic navigation sidebar reflecting user privileges.
- Trainer tools to create classroom sessions and generate short hex invite links.
- Student workflow to join a batch using an invite code and mark themselves "Present" or "Late".
- Institution and Management dashboards showing global counts and average attendance.

### 5. Tech Stack
- **Frontend**: Next.js (App Router) + Tailwind CSS. Chosen for straightforward file-based client routing and incredibly fast, responsive UI development without huge CSS stylesheets.
- **Backend**: Node.js & Express. Selected for its lightweight flexibility in building custom JSON REST APIs quickly.
- **Database**: MongoDB (Mongoose). Easily models our document relationships (Students referencing Batches referencing Sessions) without writing complex JOIN queries.

### 6. Setup Instructions

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

**Backend**:
```bash
cd backend
npm install
node seed.js -i   # Initialize test database
npm run dev
```

### 7. API Overview
- `POST /api/auth/login` - Validates user credentials and returns a signed JWT.
- `GET /api/batches` - Fetches the batches that exist for the currently logged-in user.
- `POST /api/batches/join/:inviteCode` - Appends a student's ID into the batch roster.
- `POST /api/sessions` - Accepts start/end times and creates an active session.
- `POST /api/attendance/mark` - Saves a student's present/late status for an active session.

### 8. What is Working
- The core application flow is solid: Trainers can create batch invites, students can join using those codes, trainers create sessions, and students mark their attendance.
- The RBAC security works: a student explicitly gets a 403 error if they manually try to trigger an API reserved for trainers.

### 9. What is Partially Complete
- The Analytics section for the Programme Manager is mostly static summary tiles; the planned dynamic interactive charts (via Recharts) are currently just showing placeholder layouts.
- Forgot Password / Email verification workflows were skipped to focus strictly on the core mechanical features.

### 10. Challenges Faced
Managing relational document logic in NoSQL. It took significant debugging to get the relationships perfect—ensuring that an Attendance record successfully linked a Student ID to a Session ID while confirming via middleware that the student actually belonged to the owning Batch so they couldn't fake attendance.

### 11. Future Improvements
- Implement a CSV/Excel export button so Institutions can download monthly attendance rosters.
- Shift to a robust global cache like React Query or Zustand for smoother data fetching instead of relying on standard `useEffect` calls.
