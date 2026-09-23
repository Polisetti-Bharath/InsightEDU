# InsightEDU

### Turn Student Data Into Actionable Insights

---

# IMPORTANT DEVELOPMENT INSTRUCTION

You are a senior staff software engineer responsible for delivering a production-ready application.

Build this application completely.

Make all implementation decisions necessary to produce a professional SaaS-quality product.

Do not simplify features.

Do not remove requirements.

Do not replace MongoDB aggregations with frontend calculations.

Analytics must be powered by MongoDB Aggregation Framework.

Generate all pages, components, APIs, database models, charts, validation, seed scripts, utilities, services, deployment configuration, and documentation necessary to run the application locally and on Vercel.

All code should be production-ready.

Use modern best practices.

Use TypeScript strict mode.

Avoid using `any`.

---

# Product Name

InsightEDU

---

# Tagline

Turn Student Data Into Actionable Insights

---

# Product Overview

InsightEDU is a modern academic analytics platform that helps educational institutions manage students, subjects, and marks while generating meaningful insights through MongoDB Aggregation Framework.

The project is intentionally designed so that MongoDB is the core technology driving business value.

Target contribution:

| Area              | Contribution |
| ----------------- | ------------ |
| CRUD Operations   | 20%          |
| MongoDB Analytics | 80%          |

The majority of application functionality must come from MongoDB aggregation pipelines.

---

# Primary Objective

Demonstrate MongoDB capabilities through:

* CRUD Operations
* Aggregation Framework
* Analytics Dashboards
* Reporting Systems
* Data Visualization

---

# Target Users

## Admin

Can:

* Manage students
* Manage subjects
* Manage marks
* View analytics

## Faculty

Can:

* Enter marks
* View reports
* Analyze performance

---

# Technology Stack

## Frontend

* Next.js 15 App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts
* Lucide React

## Backend

* Next.js Route Handlers
* Server Actions

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* NextAuth

## Deployment

* Vercel

---

# Design System

## Design Inspiration

Create a clean modern SaaS dashboard inspired by:

* Vercel Dashboard
* Linear
* Stripe Dashboard
* Notion

Do not use a generic admin template.

---

## Theme Colors

Primary:

```text
#2563EB
```

Secondary:

```text
#0F172A
```

Success:

```text
#22C55E
```

Warning:

```text
#F59E0B
```

Danger:

```text
#EF4444
```

Background:

```text
#F8FAFC
```

---

## Typography

Font:

```text
Inter
```

---

## UI Library

```text
shadcn/ui
```

---

## Icons

```text
lucide-react
```

---

# Application Layout

## Sidebar Navigation

```text
Dashboard
Students
Subjects
Marks
Analytics
Settings
```

Sidebar should collapse on mobile.

---

# User Flow

## First Time User

1. Login
2. Dashboard loads
3. Empty state displayed
4. Add Subjects
5. Add Students
6. Add Marks
7. Dashboard analytics automatically update
8. Explore Analytics page

---

# Database Design

---

## Collection: students

```json
{
  "_id": "ObjectId",
  "studentId": "23CS101",
  "name": "John Doe",
  "email": "john@example.com",
  "department": "CSE",
  "semester": 5,
  "createdAt": "Date"
}
```

---

## Collection: subjects

```json
{
  "_id": "ObjectId",
  "subjectCode": "CS301",
  "subjectName": "Database Systems",
  "credits": 4,
  "createdAt": "Date"
}
```

---

## Collection: marks

```json
{
  "_id": "ObjectId",
  "studentId": "ObjectId",
  "subjectId": "ObjectId",
  "internalMarks": 28,
  "externalMarks": 55,
  "totalMarks": 83,
  "createdAt": "Date"
}
```

---

# Validation Rules

## Student

* Student ID required
* Student ID unique
* Email required
* Email unique
* Semester between 1 and 8

---

## Subject

* Subject Code required
* Subject Code unique
* Credits between 1 and 6

---

## Marks

Internal Marks:

```text
0 - 40
```

External Marks:

```text
0 - 60
```

Total Marks:

```text
0 - 100
```

Total should be automatically calculated.

---

# Dashboard Page

## KPI Cards

Display:

```text
Total Students
Total Subjects
Total Marks Entries
Class Average
Highest Score
Pass Percentage
```

---

## Charts Section

### Chart 1

Subject Average Scores

Type:

```text
Bar Chart
```

---

### Chart 2

Grade Distribution

Type:

```text
Pie Chart
```

---

### Chart 3

Department Performance

Type:

```text
Horizontal Bar Chart
```

---

### Chart 4

Pass vs Fail Ratio

Type:

```text
Donut Chart
```

---

# Students Page

## Features

* View Students
* Add Student
* Edit Student
* Delete Student
* Search
* Pagination
* Department Filter

---

## Table Columns

```text
Student ID
Name
Email
Department
Semester
Actions
```

---

## Search

Search by:

* Student Name
* Student ID
* Email

---

# Subjects Page

## Features

* Add Subject
* Edit Subject
* Delete Subject
* Search

---

## Table Columns

```text
Subject Code
Subject Name
Credits
Actions
```

---

## Search

Search by:

* Subject Name
* Subject Code

---

# Marks Page

## Features

* Add Marks
* Edit Marks
* Delete Marks
* Search
* Department Filter
* Subject Filter

---

## Table Columns

```text
Student
Subject
Internal Marks
External Marks
Total Marks
Actions
```

---

## Search

Search by:

* Student Name
* Subject Name

---

# Analytics Page

This page is the heart of the application.

All calculations must be performed using MongoDB Aggregation Framework.

Frontend should only render results.

---

# Analytics Sections

## Section 1

Student Rankings

Display:

| Rank | Student | Average Score |

---

## Section 2

Top 10 Students

---

## Section 3

Subject Performance

Average score by subject.

---

## Section 4

Weak Students

Average score below:

```text
50
```

---

## Section 5

Grade Distribution

| Grade | Range    |
| ----- | -------- |
| O     | 90+      |
| A+    | 80-89    |
| A     | 70-79    |
| B     | 60-69    |
| C     | 50-59    |
| F     | Below 50 |

---

## Section 6

Department Performance

Average marks by department.

---

## Section 7

Subject Failure Analysis

Subjects with highest failure rates.

---

## Section 8

Pass Percentage

Passing Marks:

```text
40
```

---

# Required Aggregation Pipelines

Implement all of the following using MongoDB Aggregation Framework.

---

## Dashboard Metrics

### Total Students

Use:

```javascript
$count
```

---

### Total Subjects

Use:

```javascript
$count
```

---

### Total Marks Entries

Use:

```javascript
$count
```

---

### Class Average

Formula:

```text
Sum of all marks ÷ total mark entries
```

Use:

```javascript
$avg
```

---

### Highest Score

Use:

```javascript
$max
```

---

### Lowest Score

Use:

```javascript
$min
```

---

## Student Rankings

Use:

```javascript
$group
$avg
$sort
```

---

## Top Students

Use:

```javascript
$group
$sort
$limit
```

---

## Subject Performance

Use:

```javascript
$group
$avg
```

---

## Pass Percentage

Use:

```javascript
$group
$cond
```

Formula:

```text
Passed Students ÷ Total Students × 100
```

---

## Grade Distribution

Use:

```javascript
$bucket
```

---

## Weak Students

Use:

```javascript
$match
$group
```

---

## Department Performance

Use:

```javascript
$lookup
$group
```

---

## Failure Analysis

Use:

```javascript
$group
$sort
```

---

# API Endpoints

## Students

```text
GET    /api/students
POST   /api/students
PUT    /api/students/[id]
DELETE /api/students/[id]
```

---

## Subjects

```text
GET    /api/subjects
POST   /api/subjects
PUT    /api/subjects/[id]
DELETE /api/subjects/[id]
```

---

## Marks

```text
GET    /api/marks
POST   /api/marks
PUT    /api/marks/[id]
DELETE /api/marks/[id]
```

---

## Analytics

```text
GET /api/analytics/dashboard
GET /api/analytics/rankings
GET /api/analytics/subjects
GET /api/analytics/departments
GET /api/analytics/grades
GET /api/analytics/failures
```

---

# Empty States

## Students

```text
No Students Found
Add Your First Student
```

---

## Subjects

```text
No Subjects Found
Add Your First Subject
```

---

## Marks

```text
No Marks Found
Add Marks To Start Analytics
```

---

## Analytics

```text
Add Data To Generate Insights
```

---

# Confirmation Dialogs

## Delete Student

```text
Are you sure?
This action cannot be undone.
```

---

## Delete Subject

```text
Are you sure?
This action cannot be undone.
```

---

## Delete Marks

```text
Are you sure?
This action cannot be undone.
```

---

# Notifications

Use toast notifications.

Success Examples:

```text
Student Created Successfully
Subject Created Successfully
Marks Added Successfully
Record Deleted Successfully
```

---

# Seed Script

Provide:

```bash
npm run seed
```

---

# Seed Data Requirements

Generate:

```text
100 Students
10 Subjects
1000 Marks Records
```

---

## Departments

```text
CSE
IT
ECE
EEE
MECH
```

---

## Subjects

```text
Database Systems
Operating Systems
Computer Networks
Data Structures
Algorithms
Machine Learning
Cloud Computing
Java Programming
Python Programming
Software Engineering
```

---

## Marks Generation

Internal:

```text
15 - 40
```

External:

```text
20 - 60
```

Generate realistic scores.

---

# Folder Structure

```text
src/
├── app/
├── components/
├── actions/
├── services/
├── models/
├── lib/
├── charts/
├── hooks/
├── types/
├── utils/
└── validators/
```

---

# Indexing Requirements

Create indexes on:

```text
studentId
subjectId
department
semester
createdAt
```

---

# Performance Requirements

* Use Aggregation Framework whenever analytics are required.
* Use indexes.
* Use lean() on read-heavy queries.
* Minimize frontend calculations.
* Use server-side data fetching.

---

# Responsive Requirements

Support:

* Desktop
* Tablet
* Mobile

Requirements:

* Responsive tables
* Collapsible sidebar
* Mobile-friendly charts
* Proper spacing

---

# Environment Variables

```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

# Deployment Requirements

Application must:

* Run locally
* Build successfully
* Deploy on Vercel
* Use MongoDB Atlas

---

# Acceptance Criteria

Project is complete when:

✅ Student CRUD works

✅ Subject CRUD works

✅ Marks CRUD works

✅ Dashboard analytics work

✅ Charts render correctly

✅ Search works

✅ Filters work

✅ Seed script works

✅ Mobile responsive

✅ MongoDB aggregations power analytics

✅ No TypeScript errors

✅ No ESLint errors

✅ Vercel deployment succeeds

✅ MongoDB Atlas integration succeeds

---

# Final Rule

MongoDB Aggregation Framework is the core of this application.

Do not move analytics calculations into frontend code.

The dashboard, reports, rankings, distributions, averages, pass percentages, failure analysis, and performance metrics must be generated using MongoDB Aggregation Pipelines.

The project should clearly demonstrate that MongoDB is the engine powering the product rather than acting as a simple storage database.
