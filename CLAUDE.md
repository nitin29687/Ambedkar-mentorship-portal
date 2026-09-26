# Dr. B.R. Ambedkar Mentorship Portal — Claude Code Instructions

## Project Vision
A tribute to Dr. B.R. Ambedkar — a free, accessible mentorship platform for rural, SC/ST, and backward-class students and youth across India. It connects them with volunteer mentors across careers, competitive exams, education, and livelihoods.

---

## Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (via Prisma ORM)
- **Auth:** JWT-based (separate flows for Students, Mentors, Admin)
- **File uploads:** Multer (mentor profile photos)
- **Email:** Nodemailer (for mentor-student connection emails)
- **Deployment-ready:** .env-driven config

---

## Project Structure to Scaffold

```
ambedkar-mentorship/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── questions.js
│   │   │   ├── mentors.js
│   │   │   └── admin.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── uploads/          # mentor photos stored here
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── AskQuestion.jsx
│   │   │   ├── MentorRegister.jsx
│   │   │   ├── MentorDirectory.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── Login.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── MentorCard.jsx
│   │   │   ├── ExpertiseDropdown.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## Database Schema (Prisma)

Create `backend/prisma/schema.prisma` with these models:

### Student Question
```prisma
model Question {
  id          Int       @id @default(autoincrement())
  name        String
  place       String
  district    String
  state       String
  email       String
  phone       String?           // optional
  question    String
  category    String?           // auto-tagged from expertise
  status      QuestionStatus @default(PENDING)
  createdAt   DateTime  @default(now())
  responses   Response[]
  assignedTo  Mentor?   @relation(fields: [mentorId], references: [id])
  mentorId    Int?
}

enum QuestionStatus {
  PENDING
  ASSIGNED
  RESPONDED
  CLOSED
}
```

### Mentor
```prisma
model Mentor {
  id              Int        @id @default(autoincrement())
  name            String
  email           String     @unique
  password        String     // hashed
  photo           String?    // file path
  education       String
  experience      String
  expertisePath   String     // e.g. "COMPETITIVE_EXAMS.UPSC"
  expertiseLabel  String     // human-readable label
  bio             String?
  isApproved      Boolean    @default(false)
  createdAt       DateTime   @default(now())
  questions       Question[]
  responses       Response[]
}
```

### Response
```prisma
model Response {
  id         Int      @id @default(autoincrement())
  content    String
  isPublic   Boolean  @default(true)
  createdAt  DateTime @default(now())
  question   Question @relation(fields: [questionId], references: [id])
  questionId Int
  mentor     Mentor   @relation(fields: [mentorId], references: [id])
  mentorId   Int
}
```

### Admin
```prisma
model Admin {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
}
```

---

## Expertise Dropdown Data Structure

Create `frontend/src/data/expertiseList.js`:

```javascript
export const expertiseList = [
  {
    label: "Competitive Examinations",
    value: "COMPETITIVE_EXAMS",
    children: [
      { label: "UPSC Civil Services", value: "UPSC" },
      { label: "State PSC (General)", value: "STATE_PSC" },
      { label: "SSC (Staff Selection Commission)", value: "SSC" },
      { label: "IBPS / Bank PO / Clerk", value: "BANKING" },
      { label: "Railway Recruitment (RRB)", value: "RAILWAY" },
      { label: "Defence Services (NDA/CDS)", value: "DEFENCE" },
      { label: "Police / Constable Exams", value: "POLICE" },
      { label: "Teaching (TET/CTET/NET)", value: "TEACHING_EXAMS" },
    ],
  },
  {
    label: "Medical & Health Sciences",
    value: "MEDICAL",
    children: [
      { label: "NEET UG (MBBS/BDS)", value: "NEET_UG" },
      { label: "NEET PG (MD/MS)", value: "NEET_PG" },
      { label: "AIIMS / JIPMER", value: "AIIMS" },
      { label: "Nursing Entrance", value: "NURSING" },
      { label: "Pharmacy / Paramedical", value: "PHARMACY" },
    ],
  },
  {
    label: "Engineering & Technology",
    value: "ENGINEERING",
    children: [
      { label: "JEE Main & Advanced", value: "JEE" },
      { label: "GATE", value: "GATE" },
      { label: "Polytechnic / Diploma", value: "POLYTECHNIC" },
      { label: "Computer Science / IT", value: "CS_IT" },
      { label: "Core Engineering Fields", value: "CORE_ENGG" },
    ],
  },
  {
    label: "Law",
    value: "LAW",
    children: [
      { label: "CLAT / Law Entrance", value: "CLAT" },
      { label: "Judicial Services", value: "JUDICIARY" },
      { label: "Legal Aid & Rights", value: "LEGAL_AID" },
      { label: "Advocate Practice", value: "ADVOCACY" },
    ],
  },
  {
    label: "Higher Education",
    value: "HIGHER_EDUCATION",
    children: [
      { label: "Scholarships (SC/ST/OBC)", value: "SCHOLARSHIPS" },
      { label: "College Admissions", value: "COLLEGE_ADMISSION" },
      { label: "Study Abroad", value: "STUDY_ABROAD" },
      { label: "PhD / Research", value: "PHD_RESEARCH" },
    ],
  },
  {
    label: "Jobs & Careers",
    value: "JOBS",
    children: [
      { label: "Private Sector Jobs", value: "PRIVATE_JOBS" },
      { label: "Resume / Interview Prep", value: "RESUME_INTERVIEW" },
      { label: "Skill Development / ITI", value: "SKILL_DEV" },
      { label: "Entrepreneurship / Self-employment", value: "ENTREPRENEURSHIP" },
      { label: "Agriculture / Rural Livelihoods", value: "AGRICULTURE" },
    ],
  },
  {
    label: "Social & Legal Rights",
    value: "RIGHTS",
    children: [
      { label: "SC/ST Atrocities Act", value: "SCST_ACT" },
      { label: "RTI (Right to Information)", value: "RTI" },
      { label: "Government Schemes & Benefits", value: "GOVT_SCHEMES" },
      { label: "Land Rights", value: "LAND_RIGHTS" },
    ],
  },
  {
    label: "Arts, Commerce & Humanities",
    value: "ARTS_COMMERCE",
    children: [
      { label: "CA / CMA / CS", value: "CA_CMA_CS" },
      { label: "MBA / Management Entrance", value: "MBA" },
      { label: "Social Work / NGO Careers", value: "SOCIAL_WORK" },
      { label: "Journalism / Media", value: "JOURNALISM" },
    ],
  },
];
```

---

## API Routes to Build

### Auth Routes (`/api/auth`)
- `POST /mentor/register` — Mentor self-registration (pending admin approval)
- `POST /mentor/login` — Mentor login → JWT
- `POST /admin/login` — Admin login → JWT

### Question Routes (`/api/questions`)
- `POST /` — Student submits question (public, no auth)
- `GET /` — Get all questions **public fields only**: `id, name, question, category, status, createdAt, responses[public ones]`
  - ⚠️ NEVER expose: `email, phone, district, state, place` to public API responses
- `GET /:id` — Single question (public fields only)

### Mentor Routes (`/api/mentors`)
- `GET /` — List all approved mentors (public directory)
- `GET /:id` — Single mentor profile

### Admin Routes (`/api/admin`) — JWT required, Admin role only
- `GET /questions` — All questions with **full details** (including email, phone, location)
- `POST /questions/:id/assign` — Assign question to mentor `{ mentorId }`
- `GET /mentors/pending` — List unapproved mentors
- `POST /mentors/:id/approve` — Approve mentor
- `DELETE /mentors/:id` — Delete/ban mentor
- `DELETE /responses/:id` — Delete inappropriate response
- `POST /mentor/add` — Admin manually adds a mentor (pre-approved)

### Mentor Response Routes (`/api/responses`) — JWT required, Mentor role
- `POST /` — Mentor posts response `{ questionId, content, isPublic }`
- Mentor can also view assigned question's private contact details to connect offline

---

## Key UI Pages & Behavior

### Home Page (`/`)
- Hero section with Dr. Ambedkar quote and photo
- Brief mission statement in English + Hindi
- Two CTAs: "Get Guidance" and "Become a Mentor"
- Recent questions feed (name + question snippet + category tag only)
- Mentor spotlight cards (name, photo, expertise)

### Ask a Question (`/ask`)
Form fields:
- Full Name *
- Village / Town *
- District *
- State (dropdown of all Indian states) *
- Email *
- Phone (optional)
- Question (textarea, max 1000 chars) *
- Category (auto-suggest based on keywords, but user can change)

On submit: confirmation message, no redirect to a "question detail page" that exposes PII.

### Mentor Registration (`/mentor/register`)
Form fields:
- Full Name *
- Email *
- Password *
- Profile Photo (upload)
- Education Background (textarea) *
- Years of Experience *
- Expertise (cascading dropdown — use `expertiseList.js`) *
- Short Bio

On submit: "Your profile is under review. Admin will approve shortly."

### Mentor Directory (`/mentors`)
- Grid of approved mentor cards
- Filter by expertise category
- Each card: Photo, Name, Expertise label, Experience, Bio snippet

### Admin Dashboard (`/admin`) — Protected route
Tabs:
1. **Pending Questions** — Table with full details (name, contact, question, location). Button: "Assign to Mentor" (opens modal with mentor dropdown filtered by expertise match)
2. **Assigned Questions** — Show assigned mentor + responses
3. **Pending Mentor Approvals** — Cards with all mentor details. Approve / Reject buttons
4. **All Mentors** — Manage active mentors, delete option
5. **Moderation** — List all public responses, delete button on each

---

## Privacy & Security Rules (STRICTLY ENFORCE)

1. **Student PII is admin-only.** The public API endpoint for questions must NEVER return `email`, `phone`, `district`, `state`, or `place`. Use a Prisma `select` to explicitly whitelist public fields.
2. **Mentor contact shared only via admin assign flow.** When admin assigns a question, the system emails the mentor with the student's contact details (opt-in email via Nodemailer). The student's contact is NOT shown on any public page.
3. **Passwords** must be hashed with bcrypt (salt rounds: 12).
4. **JWT secrets** must come from `.env`, never hardcoded.
5. **Photo uploads** — validate file type (jpg/png only), max 2MB, store outside public URL directory, serve via a protected route.

---

## Theming & Visual Identity

- **Primary color:** Deep Blue (`#1a3a6b`) — Ambedkar's signature blue
- **Accent:** Saffron (`#FF9933`) — from the Indian flag's Ashoka Chakra
- **Background:** Off-white (`#f9f6f0`)
- **Font:** Use Google Fonts — `Tiro Devanagari Hindi` for Hindi text, `Inter` for English
- Add Dr. Ambedkar's photo to the hero section (use a public domain image URL or placeholder)
- Footer: "This portal is a tribute to Dr. B.R. Ambedkar (1891–1956) — architect of the Indian Constitution and champion of social justice."
- Include the Ashoka Chakra (🔵) as a subtle watermark or favicon

---

## .env.example

```
DATABASE_URL=postgresql://user:password@localhost:5432/ambedkar_mentorship
JWT_SECRET=your_jwt_secret_here
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=bcrypt_hash_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
PORT=5000
```

---

## Seed Data

Create `backend/prisma/seed.js` to:
1. Create one default admin account (email + bcrypt-hashed password from `.env`)
2. Create 3 sample approved mentors across different expertise areas
3. Create 5 sample student questions in various states

---

## README Instructions to Generate

The README must include:
- Project description and tribute note
- Prerequisites (Node 18+, PostgreSQL)
- Setup steps (clone, install, env setup, prisma migrate, seed, run)
- How to access the admin panel
- How to add the first admin
- Deployment notes (suggest Railway or Render for free tier)

---

## Build Order for Claude Code

Follow this sequence:

1. Scaffold folder structure and install dependencies
2. Set up Prisma schema and run initial migration
3. Build backend: Express server → auth routes → question routes → mentor routes → admin routes
4. Seed the database
5. Build frontend: Vite + Tailwind setup → AuthContext → Navbar/Footer → Home page → AskQuestion page → MentorRegister page → MentorDirectory page → AdminDashboard page
6. Wire frontend to backend API (use Axios or fetch with base URL from env)
7. Add privacy guard middleware on question routes
8. Test all flows: student ask → admin assign → mentor respond → admin moderate
9. Generate README.md

---

## Accessibility Notes
- All forms must have proper `<label>` associations
- Color contrast must meet WCAG AA
- Support Hindi text rendering throughout (UTF-8)
- Mobile-first responsive design — many rural users will be on phones
