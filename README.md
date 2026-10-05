🛠️ Service Request Dashboard

A full-stack service request management system that replaces informal workplace maintenance requests with a structured digital workflow.

Employees can submit service requests for issues such as laptop problems, internet failures, air-conditioning faults, office furniture, and electrical problems. Administrators can review, assign, prioritize, update, and resolve requests through a centralized dashboard.

---

🌐 Preview

![Admin Desktop Preview](assets/Admin%20Desktop.png)
![Admin Mobile Preview](assets/Admin%20Mobile.png)
![User Dektop Preview](assets/User%20Desktop.png)
![User Mobile Preview](assets/User%20Mobile.png)

Screenshots

Employee Dashboard

"Employee Dashboard" (./screenshots/employee-dashboard.png)

Create Service Request

"Create Request" (./screenshots/create-request.png)

Request Details

"Request Details" (./screenshots/request-details.png)

Admin Dashboard

"Admin Dashboard" (./screenshots/admin-dashboard.png)

Admin Request Management

"Admin Request Details" (./screenshots/admin-request-details.png)

«Screenshots can be added to the "screenshots/" folder after deployment.»

---

📌 Project Overview

Many organizations still handle maintenance and technical support requests through informal channels such as WhatsApp messages or verbal communication.

This makes it difficult to:

- Track requests
- Assign responsibility
- Monitor request status
- Prioritize urgent issues
- Maintain a history of changes
- Measure unresolved requests
- Identify recurring service problems

The Service Request Dashboard provides a centralized system for managing the entire request lifecycle.

Workflow

Employee
   │
   ▼
Submit Request
   │
   ▼
Admin Dashboard
   │
   ├── Assign Administrator
   ├── Set Priority
   ├── Update Status
   └── Review History
   │
   ▼
In Progress
   │
   ▼
Resolved
   │
   ▼
Closed

---

✨ Features

👨‍💼 Employee Features

- Employee registration
- Secure login
- JWT authentication
- Submit service requests
- Select request category
- Select priority
- View personal requests
- View request details
- Track assigned administrator
- Track request status
- View status history
- Responsive dashboard
- Logout functionality

---

🛡️ Administrator Features

- Secure administrator login
- Role-based authorization
- Dashboard statistics
- View all service requests
- Search requests
- Filter by status
- Filter by priority
- View requests by category
- Assign requests to administrators
- Change request priority
- Change request status
- View complete request details
- View status history
- Delete requests
- Monitor urgent requests
- Responsive admin interface

---

🔐 Authentication & Security

The application implements several security mechanisms:

Password Hashing

Passwords are hashed using bcrypt before being stored in PostgreSQL.

JWT Authentication

JSON Web Tokens are used to authenticate API requests.

Role-Based Authorization

The system supports:

employee
admin

Public registration always creates an employee account.

Administrator privileges cannot be assigned through the public registration endpoint.

Protected Routes

Frontend routes are protected according to the authenticated user's role.

Employee
   │
   └── /employee

Administrator
   │
   └── /admin

Unauthorized users are redirected automatically.

SQL Parameterization

Database queries use parameterized SQL values to reduce SQL injection risks.

---

🧰 Technology Stack

Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- JavaScript

Backend

- Node.js
- Express.js
- PostgreSQL
- "pg"
- bcrypt
- JSON Web Token
- CORS
- dotenv

Database

- PostgreSQL
- Relational database design
- Foreign keys
- Constraints
- Indexes
- SQL joins
- Aggregations
- Database triggers

Deployment

- Vercel — Frontend
- Render — Backend
- PostgreSQL — Production database

---

🗄️ Database Design

The application uses a relational PostgreSQL database.

Main Tables

users
  │
  ├───────────────┐
  │               │
  ▼               ▼
requests      status_history
  │
  ├── categories
  │
  └── users

Tables

"users"

Stores employees and administrators.

id
name
email
password
role
created_at

"categories"

Stores available service request categories.

id
name
created_at

"requests"

Stores employee service requests.

id
title
description
category_id
created_by
assigned_to
priority
status
created_at
updated_at

"request_status_history"

Stores changes made to request statuses.

id
request_id
old_status
new_status
changed_by
changed_at

---

🧩 Database Relationships

Request → Category

Each request belongs to one category.

requests.category_id
        ↓
categories.id

Request → Employee

Each request records the employee who created it.

requests.created_by
        ↓
users.id

Request → Administrator

Each request can optionally be assigned to an administrator.

requests.assigned_to
        ↓
users.id

Request → Status History

Each request can have multiple status-history records.

requests.id
        ↓
request_status_history.request_id

---

⚡ Database Optimization

Indexes are used on frequently queried columns:

users.role
users.email

requests.created_by
requests.assigned_to
requests.category_id
requests.status
requests.priority
requests.created_at

request_status_history.request_id
request_status_history.changed_by
request_status_history.changed_at

This improves query performance as the application grows.

---

⏱️ Automatic Timestamp Management

The "requests.updated_at" column is maintained using a PostgreSQL trigger.

Request UPDATE
      │
      ▼
PostgreSQL Trigger
      │
      ▼
updated_at = CURRENT_TIMESTAMP

This ensures modification timestamps remain accurate at the database level.

---

🔌 REST API

Authentication

Register

POST /api/auth/register

Login

POST /api/auth/login

---

Requests

Create Request

POST /api/requests

Get Requests

GET /api/requests

Get Request

GET /api/requests/:id

Update Request

PUT /api/requests/:id

Delete Request

DELETE /api/requests/:id

---

Categories

GET /api/categories

---

Request History

GET /api/history/:id

---

Administrators

GET /api/users/admins

---

Dashboard

Dashboard Statistics

GET /api/dashboard/stats

Requests by Category

GET /api/dashboard/by-category

---

📁 Project Structure

service-request-dashboard/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── requestController.js
│   │   ├── dashboardController.js
│   │   ├── categoryController.js
│   │   ├── historyController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── historyRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── CreateRequest.jsx
│   │   │   ├── RequestDetails.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminRequestDetails.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql
│
├── screenshots/
│   ├── employee-dashboard.png
│   ├── create-request.png
│   ├── request-details.png
│   ├── admin-dashboard.png
│   └── admin-request-details.png
│
└── README.md

---

⚙️ Local Installation

1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL

cd service-request-dashboard

---

🗄️ Database Setup

Create a PostgreSQL database:

CREATE DATABASE service_request_dashboard;

Connect to it:

\c service_request_dashboard

Run the database schema:

psql -U postgres -d service_request_dashboard -f database/schema.sql

---

🔧 Backend Setup

Navigate to the backend:

cd backend

Install dependencies:

npm install

Create:

.env

Add:

PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=service_request_dashboard
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_PORT=5432

JWT_SECRET=YOUR_SECURE_JWT_SECRET

Start the development server:

npm run dev

The API will run at:

http://localhost:5000

---

💻 Frontend Setup

Open another terminal.

cd frontend

Install dependencies:

npm install

Create:

.env

Add:

VITE_API_URL=http://localhost:5000/api

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173

---

🧪 Testing the Application

The following workflows have been implemented and tested:

Employee

Register
   ↓
Login
   ↓
Employee Dashboard
   ↓
Create Request
   ↓
View Request
   ↓
Track Status
   ↓
View Status History

Administrator

Login
   ↓
Admin Dashboard
   ↓
View Requests
   ↓
Assign Administrator
   ↓
Change Priority
   ↓
Change Status
   ↓
View History
   ↓
Resolve / Close

Authorization

Employee → Admin Route → Access Denied / Redirect

Admin → Employee Route → Redirect

Logged Out → Protected Route → Login

---

🌍 Deployment

Frontend

The React application can be deployed using:

Vercel

Production environment variable:

VITE_API_URL=https://YOUR-BACKEND-URL/api

Backend

The Express API can be deployed using:

Render

Production environment variables should include:

PORT
DB_USER
DB_HOST
DB_NAME
DB_PASSWORD
DB_PORT
JWT_SECRET

The production PostgreSQL database should contain the schema provided in:

database/schema.sql

---

📈 Future Improvements

Possible future enhancements include:

- Email notifications
- File/image attachments
- Real-time notifications
- Request comments
- Advanced analytics
- SLA monitoring
- Export reports to CSV/PDF
- Admin activity audit logs
- Password reset
- Email verification
- Automated request escalation
- Dark mode
- Mobile application

---

🎯 Project Goals

The project demonstrates practical understanding of:

- Full-stack web development
- REST API design
- React application architecture
- Authentication and authorization
- PostgreSQL relational database design
- SQL joins and aggregations
- Database constraints
- Database indexing
- Database triggers
- Role-based access control
- API security
- Responsive UI development
- Production deployment

---

👨‍💻 Author

Oluwatobi Oluwagbohun

Full-Stack Developer

Portfolio

https://my-personal-card-ebon.vercel.app/

CV

https://my-cv-resume.vercel.app/

GitHub

https://github.com/tobikeys-world/

---

📄 License

This project was created for educational, portfolio, and professional development purposes.