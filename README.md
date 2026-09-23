# 🎓 InsightEDU

### 📊 Turn Student Data Into Actionable Insights

> **InsightEDU** is an academic analytics platform for managing **students, subjects, marks, rankings, dashboards, and reports** — with analytics powered entirely by the **MongoDB Aggregation Framework**, rather than client-side calculations.

---

## ✨ Features

| Feature                      | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| 👨‍🎓 **Student Management** | Create, update, view, and manage student records |
| 📚 **Subject Management**    | Manage subjects and academic information         |
| 📝 **Marks Management**      | Enter and manage student marks                   |
| 📊 **Analytics Dashboard**   | Real-time academic KPIs and performance insights |
| 🏆 **Student Rankings**      | Ranking and Top 10 student analysis              |
| 📈 **Subject Analytics**     | Analyze performance across subjects              |
| ⚠️ **Weak Student Analysis** | Identify students who need additional support    |
| 🎯 **Grade Distribution**    | Visualize academic grade distributions           |
| 🏢 **Department Analytics**  | Compare performance across departments           |
| 📉 **Failure Analysis**      | Identify subjects with high failure rates        |
| 🔐 **Role-Based Access**     | Separate Admin and Faculty permissions           |
| ⚡ **MongoDB Aggregation**    | Analytics calculated directly by MongoDB         |

---

## 🛠️ Tech Stack

### 🎨 Frontend

![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge\&logo=next.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge)

* **Next.js 15** — App Router
* **TypeScript** — Strict mode
* **Tailwind CSS v4** — Styling
* **shadcn/ui** — UI components
* **Recharts** — Data visualization
* **lucide-react** — Icons

## 🗄️ How MongoDB Is Used

InsightEDU relies on MongoDB not just as a data store, but as the **analytics engine** for the entire platform. Instead of pulling raw data and crunching numbers on the client or in application code, all analytics are computed directly inside MongoDB using its **Aggregation Framework**.

### 📦 Data Layer

- MongoDB stores four core collections — **Students**, **Subjects**, **Marks**, and **Users** — accessed through **Mongoose** as the ODM (Object Data Modeling) layer.
- Locally, it runs via **Docker**; in production, it's hosted on **MongoDB Atlas**.

### ⚡ Analytics via Aggregation Pipelines

Each analytics feature maps to a specific set of MongoDB pipeline stages:

| Feature | Pipeline Stages Used |
| --- | --- |
| Dashboard KPIs | `$count`, `$avg`, `$max`, `$min`, `$cond` |
| Student Rankings | `$group`, `$avg`, `$sort`, `$limit` |
| Subject Performance | `$group`, `$avg`, `$lookup` |
| Weak Student Detection | `$match`, `$group` |
| Grade Distribution | `$bucket` |
| Department Performance | `$lookup`, `$group` |
| Subject Failure Analysis | `$group`, `$sort` |
| Pass Percentage | `$group`, `$cond` |

### 🚀 Why This Approach

Doing the heavy lifting inside MongoDB — rather than fetching all records and calculating in JavaScript — pushes computation down to the database layer, which is far more efficient for aggregations over large datasets. The seed script alone generates 100 students and 1,000 marks records to demonstrate this at scale.

### 📍 Where It Lives in the Codebase

All aggregation logic is centralized in:

\`\`\`text
src/services/analyticsService.ts
\`\`\`

...and exposed to the frontend through:

\`\`\`text
/api/analytics/*
\`\`\`

...which feed the `/dashboard` and `/analytics` pages.

### ⚙️ Backend

![Next.js](https://img.shields.io/badge/Next.js%20Route%20Handlers-000000?style=for-the-badge\&logo=next.js\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge\&logo=mongoose\&logoColor=white)

* Next.js Route Handlers
* Next.js Server Actions
* Mongoose
* MongoDB Aggregation Framework

### 🔐 Authentication

![Auth.js](https://img.shields.io/badge/Auth.js%20v5-000000?style=for-the-badge)
![Role Based Access](https://img.shields.io/badge/RBAC-6C47FF?style=for-the-badge)

* Auth.js / NextAuth v5
* Credentials authentication
* Email & password login
* Role-based authorization
* `admin` and `faculty` roles

### ☁️ Deployment

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge\&logo=vercel\&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)

* **Vercel** — Application deployment
* **MongoDB Atlas** — Production database

---

# 🚀 Getting Started

## 1️⃣ Install Dependencies

Clone the repository and install the required packages:

```bash
npm install
```

---

## 2️⃣ Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure the following variables:

| Variable          | Description                        |
| ----------------- | ---------------------------------- |
| `MONGODB_URI`     | MongoDB connection string          |
| `NEXTAUTH_SECRET` | Secret used to sign session tokens |
| `NEXTAUTH_URL`    | Application base URL               |

For example:

```env
MONGODB_URI=mongodb://localhost:27017/insightedu
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

Generate a secure secret using:

```bash
openssl rand -base64 32
```

---

## 🐳 3️⃣ Run MongoDB Locally

If you don't want to use MongoDB Atlas during development, you can run MongoDB using Docker:

```bash
docker run -d \
  --name insightedu-mongo \
  -p 27017:27017 \
  -v insightedu-mongo-data:/data/db \
  mongo:7
```

---

# 🌱 4️⃣ Seed the Database

The seed script creates:

* 🏢 **5 departments**
* 📚 **10 subjects**
* 👨‍🎓 **100 students**
* 📝 **1000 marks records**
* 👤 **2 demo accounts**

Run:

```bash
npm run seed
```

### 🔑 Demo Accounts

| Role          | Email                    | Password      |
| ------------- | ------------------------ | ------------- |
| 🛡️ Admin     | `admin@insightedu.app`   | `Admin@123`   |
| 👨‍🏫 Faculty | `faculty@insightedu.app` | `Faculty@123` |

> ⚠️ These credentials are intended for development/demo purposes only.

---

# ▶️ 5️⃣ Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 👥 Roles & Permissions

InsightEDU provides role-based access control.

### 🛡️ Admin

Admins have complete access to the platform:

* ✅ Create students
* ✅ Update students
* ✅ Delete students
* ✅ Manage subjects
* ✅ Manage marks
* ✅ View analytics
* ✅ View reports

### 👨‍🏫 Faculty

Faculty members can:

* ✅ Enter marks
* ✅ Manage marks
* 👀 View students
* 👀 View subjects
* 📊 View analytics
* 📄 View reports

---

# 📊 Analytics

One of the core features of InsightEDU is its **MongoDB-powered analytics system**.

> 🚀 Analytics are calculated using **MongoDB Aggregation Pipelines**, not through client-side calculations.

### Dashboard KPIs

Uses:

```text
$count
$avg
$max
$min
$cond
```

### 🏆 Student Rankings

Uses:

```text
$group
$avg
$sort
$limit
```

### 📚 Subject Performance

Uses:

```text
$group
$avg
$lookup
```

### ⚠️ Weak Students

Uses:

```text
$match
$group
```

### 🎯 Grade Distribution

Uses:

```text
$bucket
```

### 🏢 Department Performance

Uses:

```text
$lookup
$group
```

### 📉 Subject Failure Analysis

Uses:

```text
$group
$sort
```

### ✅ Pass Percentage

Uses:

```text
$group
$cond
```

---

# 🧩 Project Architecture

```text
InsightEDU
│
├── 🎨 Frontend
│   ├── Next.js 15
│   ├── TypeScript
│   ├── Tailwind CSS
│   ├── shadcn/ui
│   └── Recharts
│
├── ⚙️ Backend
│   ├── Route Handlers
│   └── Server Actions
│
├── 🧠 Business Logic
│   └── Services
│       └── MongoDB Aggregation Pipelines
│
├── 🗄️ Database
│   └── MongoDB
│       └── Mongoose
│
└── 🔐 Authentication
    └── Auth.js v5
```

---

# 📁 Project Structure

```text
src/
│
├── app/
│   └── Route handlers, pages, and layouts
│
├── actions/
│   └── Server Actions
│       ├── Create
│       ├── Update
│       └── Delete
│
├── services/
│   └── Business logic + MongoDB aggregation pipelines
│
├── models/
│   ├── Student
│   ├── Subject
│   ├── Marks
│   └── User
│
├── validators/
│   └── Zod validation schemas
│
├── charts/
│   └── Recharts components
│
├── components/
│   ├── UI components
│   ├── Layout components
│   └── Feature components
│
├── hooks/
├── lib/
├── types/
└── utils/

scripts/
└── seed.ts
```

---

# 📜 Available Scripts

| Command         | Description                 |
| --------------- | --------------------------- |
| `npm run dev`   | 🚀 Start development server |
| `npm run build` | 📦 Build for production     |
| `npm run start` | ▶️ Start production server  |
| `npm run lint`  | 🔍 Run ESLint               |
| `npm run seed`  | 🌱 Seed demo database       |

---

# ☁️ Deploying to Vercel

### 1️⃣ Push to GitHub

```bash
git add .
git commit -m "Initial InsightEDU project"
git push
```

### 2️⃣ Import into Vercel

Import the GitHub repository into Vercel.

### 3️⃣ Configure Environment Variables

Add:

```text
MONGODB_URI
NEXTAUTH_SECRET
NEXTAUTH_URL
```

For production, use a **MongoDB Atlas** connection string.

### 4️⃣ Deploy 🚀

Vercel automatically runs:

```bash
npm run build
```

Your InsightEDU application will then be deployed.

---

# 🧠 MongoDB Aggregation Architecture

```text
                    ┌─────────────────────┐
                    │     InsightEDU      │
                    │      Dashboard      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    API / Services   │
                    └──────────┬──────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │ MongoDB Aggregation     │
                  │       Framework         │
                  └──────────┬──────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
     ┌──────────┐       ┌──────────┐      ┌──────────┐
     │ Students │       │ Subjects │      │  Marks   │
     └──────────┘       └──────────┘      └──────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Analytics Data  │
                    └────────┬────────┘
                             │
                             ▼
                    📊 Charts & Reports
```

---

# 📈 Analytics Endpoints

Analytics are exposed through:

```text
/api/analytics/*
```

Corresponding analytics pages include:

```text
/dashboard
/analytics
```

All major analytical calculations are handled by:

```text
src/services/analyticsService.ts
```

---

# 🔥 Why InsightEDU?

InsightEDU transforms raw academic records into meaningful insights.

```text
Students
   │
   ▼
Marks
   │
   ▼
MongoDB Aggregation
   │
   ├── 🏆 Rankings
   ├── 📊 Performance
   ├── ⚠️ Weak Students
   ├── 🎯 Grade Distribution
   ├── 🏢 Department Analysis
   ├── 📉 Failure Analysis
   └── ✅ Pass Percentage
   │
   ▼
Actionable Academic Insights
```

---

# 🛡️ Security

InsightEDU uses:

* 🔐 Auth.js authentication
* 👥 Role-based authorization
* ✅ Zod input validation
* 🔒 Environment variables for secrets
* 🗄️ Server-side database operations

---

# 🚀 Future Improvements

Potential future enhancements include:

* 📧 Email notifications
* 📱 Mobile-responsive improvements
* 🤖 AI-powered student insights
* 📄 PDF report generation
* 📊 Advanced academic forecasting
* 🔔 Faculty notifications
* 📈 Student performance prediction
* 🧠 AI-based recommendations

---

# 👨‍💻 Development

Built with modern full-stack technologies:

```text
Next.js 15
   +
TypeScript
   +
MongoDB
   +
Mongoose
   +
Auth.js
   +
Tailwind CSS
   +
Recharts
```

---

## ⭐ Support

If you find **InsightEDU** useful, consider giving the repository a ⭐ on GitHub.

---

<div align="center">

### 🎓 InsightEDU

**Turn Student Data Into Actionable Insights**

Built with ❤️ using Next.js + MongoDB

</div>
