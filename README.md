# NexaFlow — Mini ERP & Lead Management System

<p align="center">
  <strong>Manage smarter. Grow faster.</strong><br />
  A full-stack business management application for user administration and lead management.
</p>

<p align="center">
  <a href="https://nexaflow-subbu.netlify.app/"><img src="https://img.shields.io/badge/Live%20Application-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live application" /></a>
  <a href="https://nexaflow-api-p6kl.onrender.com/api/health"><img src="https://img.shields.io/badge/Backend%20API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Backend API" /></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## 🚀 Live Production Deployment

**NexaFlow is deployed and accessible online.** The frontend and backend are hosted separately:

| Component | Hosting platform | Live URL |
|---|---|---|
| Frontend application | Netlify | [https://nexaflow-subbu.netlify.app/](https://nexaflow-subbu.netlify.app/) |
| Backend REST API | Render | [https://nexaflow-api-p6kl.onrender.com](https://nexaflow-api-p6kl.onrender.com) |
| API health check | Render | [Open health endpoint](https://nexaflow-api-p6kl.onrender.com/api/health) |
| PostgreSQL database | Render PostgreSQL | Connected to the deployed backend |

The React frontend is served through Netlify. The Node.js/Express API runs as a Render web service and connects to the hosted PostgreSQL database. The frontend communicates with the backend over HTTPS.

> **Note:** The API health endpoint confirms that the backend service is responding. Availability of individual application features also depends on the database, environment configuration, and service status. Free hosting services may take a short time to wake up after inactivity.

---

## 📌 About the Project

**NexaFlow** is a Mini ERP (Enterprise Resource Planning) and Lead Management System developed as a full-stack technical project for **Conception Technology**.

It provides a centralized platform for administrators to manage users, monitor leads, and review business activity. Registered users can securely access their portal and submit enquiries.

The application follows a client-server architecture:

- **Frontend:** React 19, Vite, and Tailwind CSS.
- **Backend:** Node.js and Express.js REST APIs.
- **Database:** PostgreSQL, accessed through Sequelize ORM.
- **Deployment:** Netlify for the frontend and Render for the backend and PostgreSQL database.

### Main objectives

- **Security:** Authentication, role-based access, protected APIs, and session management.
- **Usability:** A responsive interface for administrators and registered users.
- **Organization:** Centralized user and lead records.
- **Maintainability:** Modular frontend and backend structure.

---

## ✨ Features

| Module | Capabilities |
|---|---|
| Authentication | Registration, login, logout, and authenticated user profile |
| Session management | JWT access tokens, refresh-token cookies, heartbeat monitoring, and one active device session per user |
| Password recovery | Forgot-password and reset-password workflow using email |
| Admin dashboard | Lead KPIs, status distribution, growth trends, and date-based views |
| User management | Create, search, filter, update, activate/deactivate, change roles, and delete accounts |
| Lead management | Create, view, search, filter, sort, paginate, update, and delete leads |
| Enquiries | Registered users can submit enquiries and view their own submitted records |
| Excel tools | Import lead records from Excel and export lead data |
| Responsive UI | Designed for desktop, tablet, and mobile screens |

### Account roles

**Administrator**
- Access the administration dashboard.
- Manage user accounts and account roles/status.
- View and manage lead records.
- Import and export leads.
- Review dashboard statistics.

**Registered user**
- Register and securely sign in.
- Access the user portal.
- Submit enquiries.
- View their own submitted enquiries.
- Recover a forgotten password.

Public registration creates a regular user account; it does not allow a visitor to assign themselves the administrator role.

### Lead statuses

| Status | Meaning |
|---|---|
| New | Newly created lead |
| Contacted | Initial communication has taken place |
| Qualified | Identified as a potential opportunity |
| Converted | Successfully converted |
| Lost | No longer an active opportunity |

### Excel import and export

The lead import feature accepts an Excel workbook with these columns:

- `name`
- `email`
- `mobile`
- `status` (optional)

The import feature validates the supplied records. If the status is omitted, the application uses its default lead status. The current implementation supports up to 500 rows per import.

**Important:** Excel import is for lead records. It does not create user login accounts. A separate bulk user-invitation workflow is a possible future enhancement.

---

## 🧰 Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| Vite | Development server and production build |
| JavaScript | Application logic |
| Tailwind CSS v4 | Styling and responsive layouts |
| React Router | Client-side routing |
| Axios | HTTP/API communication |
| Recharts | Dashboard charts |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| Sequelize | ORM and database operations |
| PostgreSQL | Relational database |
| JSON Web Token | Access-token authentication |
| bcrypt | Password hashing |
| Zod | Request/data validation |
| Nodemailer | Email delivery |
| ExcelJS | Excel import/export |
| Multer | File upload handling |
| Helmet | HTTP security headers |
| express-rate-limit | API rate limiting |
| UUID | Unique identifiers |

### Hosting and development tools

- **Netlify:** Production frontend hosting.
- **Render:** Production backend hosting and PostgreSQL database.
- **Git and GitHub:** Version control and source repository.
- **Postman:** API testing.
- **Visual Studio Code:** Development environment.
- **pgAdmin / PostgreSQL tools:** Database administration.

---

## 🏗️ Architecture

```text
                       USER / BROWSER
                              |
                              v
                 React + Vite Frontend
                       (Netlify)
                              |
                        HTTPS / Axios
                              |
                              v
                  Express REST API
                       (Render)
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
        Middleware       Controllers         Routes
      Auth / Role /       Business          API access
       Validation          logic
                              |
                              v
                       Sequelize ORM
                              |
                              v
                      PostgreSQL DB
                        (Render)
```

The frontend is responsible for the user interface and client-side navigation. The backend validates requests, authenticates users, enforces permissions, executes business logic, and reads/writes application data through Sequelize.

---

## 🔐 Authentication and Security

NexaFlow uses a database-backed session design with JWT authentication.

- Passwords are hashed with bcrypt; plain-text passwords are not stored.
- Short-lived JWT access tokens are used for authenticated API requests.
- Refresh tokens are stored in HTTP-only cookies and hashed before being stored in the database.
- Refresh-token rotation is used when refreshing a session.
- Active sessions are stored in PostgreSQL.
- A user is restricted to **one active device session at a time**.
- Heartbeat activity is used to identify stale sessions.
- Sessions have an expiry time.
- Password reset tokens are single-use and time-limited.
- Password reset revokes existing sessions.
- Backend routes enforce authentication and administrator authorization.
- User lead access is scoped to the authenticated user's own submitted records.
- Environment variables are used for secrets and deployment configuration.

The application uses HTTPS in production. Production cookie and CORS settings must remain aligned with the deployed Netlify frontend and Render API origins.

---

## 📁 Repository Structure

The project is organized into two main applications:

```text
NexaFlow/
├── client/                     # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/             # Authentication context/provider
│   │   ├── layouts/
│   │   ├── pages/               # Dashboard, leads, users, auth, portal
│   │   ├── services/            # Axios API configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express backend
│   ├── src/
│   │   ├── config/              # Database configuration
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/             # Admin setup script
│   │   ├── services/            # Email service
│   │   └── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 💻 Run NexaFlow Locally

You can run the application locally for development. The production deployment remains available at the live links above.

### Prerequisites

Install:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

Verify the installations:

```bash
node -v
npm -v
git --version
```

### 1. Clone the repository

```bash
git clone https://github.com/Subbu0071/NexaFlow.git
cd NexaFlow
```

### 2. Create a local PostgreSQL database

Create a database and a dedicated user. For example:

```sql
CREATE DATABASE mini_erp;
CREATE USER mini_erp_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mini_erp TO mini_erp_user;
```

If required by your PostgreSQL version, connect to the `mini_erp` database and grant schema privileges:

```sql
GRANT USAGE, CREATE ON SCHEMA public TO mini_erp_user;
```

Use your own local database credentials in the backend environment file.

### 3. Configure backend environment variables

Inside the `server` directory, create a file named `.env`:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_erp
DB_USER=mini_erp_user
DB_PASSWORD=your_local_database_password
DB_SSL=false

JWT_ACCESS_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_a_different_long_random_secret
JWT_ACCESS_EXPIRES_IN=15m

CLIENT_URL=http://localhost:5173

EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_email_app_password
```

Replace all example values with your own. Do not commit your `.env` file or share its contents.

### 4. Install backend dependencies

```bash
cd server
npm install
```

### 5. Start the backend

From the `server` directory:

```bash
npm run dev
```

If the development script is not available in your local checkout, use the start command defined in `server/package.json`.

The local API is expected at:

```text
http://localhost:5000
```

Health endpoint:

```text
http://localhost:5000/api/health
```

Keep the backend terminal running.

### 6. Create an administrator account

The project includes an administrator setup script:

```bash
node src/scripts/createAdmin.js
```

Run this command from the `server` directory after configuring the local database. Follow the prompts to create the first administrator account. Use the resulting credentials to access the admin dashboard.

### 7. Configure and start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The local frontend is usually available at:

```text
http://localhost:5173/
```

Make sure `client/src/services/api.js` points to the local API base URL during local development:

```text
http://localhost:5000/api
```

If you switch between local and production environments, ensure the frontend API base URL matches the environment you intend to use, then rebuild the frontend when preparing a new deployment.

---

## 🌐 Production Deployment

The current production deployment uses the following services:

### Frontend — Netlify

- Hosting platform: **Netlify**
- Live application: [https://nexaflow-subbu.netlify.app/](https://nexaflow-subbu.netlify.app/)
- The deployed site serves the production React frontend.

### Backend — Render

- Hosting platform: **Render Web Service**
- Service: `nexaflow-api`
- API base URL: [https://nexaflow-api-p6kl.onrender.com](https://nexaflow-api-p6kl.onrender.com)
- Health endpoint: [https://nexaflow-api-p6kl.onrender.com/api/health](https://nexaflow-api-p6kl.onrender.com/api/health)

### Database — Render PostgreSQL

- The production backend connects to a PostgreSQL database hosted on Render.
- Database credentials are configured as private environment variables in Render.
- The deployed backend uses the Render database connection configuration; local development uses the developer's local PostgreSQL configuration.

### Production configuration checklist

When configuring or redeploying the application:

- Set `NODE_ENV=production` on the backend service.
- Configure the Render PostgreSQL connection using private environment variables.
- Set strong, unique JWT secrets.
- Configure the correct frontend origin in `CLIENT_URL`.
- Configure email credentials privately if password recovery email is enabled.
- Ensure the frontend API base URL points to the deployed Render API.
- Keep production cookies secure and compatible with cross-origin frontend/API requests.
- Never expose database URLs, passwords, JWT secrets, or email app passwords in source code or public repositories.

**Deployment note:** The frontend and backend are separate deployments. Updating source code in GitHub does not necessarily update a manually deployed Netlify site unless a deployment workflow is configured. After frontend changes, create a fresh production build and publish the updated build to Netlify.

---

## 🔌 API Overview

The backend provides REST endpoints for authentication, administration, and lead management.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in using email or mobile number |
| GET | `/api/auth/me` | Get the authenticated user's profile |
| POST | `/api/auth/heartbeat` | Update active-session activity |
| POST | `/api/auth/refresh` | Refresh the access token |
| POST | `/api/auth/logout` | End the active session |
| POST | `/api/auth/forgot-password` | Request password recovery |
| POST | `/api/auth/reset-password` | Reset the password |

### Administrator

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | List, search, filter, and paginate users |
| GET | `/api/admin/users/:id` | Get a user |
| POST | `/api/admin/users` | Create a user |
| PATCH | `/api/admin/users/:id` | Update user details |
| PATCH | `/api/admin/users/:id/status` | Activate or deactivate a user |
| PATCH | `/api/admin/users/:id/role` | Change a user's role |
| DELETE | `/api/admin/users/:id` | Delete a user |

### Leads

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/leads` | Create a lead |
| POST | `/api/leads/enquiry` | Submit a user enquiry |
| GET | `/api/leads` | List leads accessible to the authenticated user |
| PATCH | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |
| GET | `/api/leads/export` | Export leads to Excel |
| POST | `/api/leads/import` | Import leads from Excel |
| GET | `/api/leads/stats` | Retrieve dashboard statistics |

Protected endpoints require authentication. Administrative endpoints additionally require the administrator role. The API's authorization rules determine which lead records a user can access.

---

## 🗄️ Database Models

The application uses Sequelize models backed by PostgreSQL.

| Model | Purpose |
|---|---|
| `User` | Stores administrator and registered-user accounts |
| `ActiveSession` | Stores active login-session information |
| `PasswordReset` | Stores password-reset token records |
| `AdminAuditLog` | Stores administrative audit records |
| `Lead` | Stores lead and enquiry records |

The Lead model distinguishes between:

- `ownerId`: The administrator responsible for a managed lead.
- `submittedById`: The registered user who submitted an enquiry.

This allows administrator-managed leads and user-submitted enquiries to follow separate access and ownership rules.

---

## 🛠️ Troubleshooting

### Database connection error

Check that PostgreSQL is running and that the database name, host, port, username, password, and SSL configuration match your environment.

### Frontend cannot reach the API

Check that the backend is running, the API base URL is correct, and the backend CORS configuration allows the frontend origin.

### Port already in use

If port `5000` or `5173` is occupied, stop the process using it or configure another available port.

### Login is rejected

Check the email/mobile number and password. Also confirm that the account is active and that the frontend is sending the expected login fields: `identifier`, `password`, and `deviceId`.

### Another device is already logged in

NexaFlow enforces one active session per user. A valid active session on another device prevents a second login until the existing session ends or is considered stale/expired by the session rules.

### Password reset email is not received

Check the email configuration, app password, backend logs, and the recipient's spam/junk folder.

---

## 🔮 Future Enhancements

Possible future improvements include:

- Bulk user onboarding through Excel and one-time invitation links.
- More detailed audit-log viewing.
- Advanced reports and analytics.
- Additional lead assignment and follow-up workflows.
- Notification management.
- Expanded business-management modules.
- Automated tests and deployment pipelines.
- Enhanced production monitoring and backup automation.

These items are potential enhancements and are not represented as completed features.

---

## 📌 Project Information

| Detail | Information |
|---|---|
| Project | NexaFlow |
| Type | Mini ERP & Lead Management System |
| Developed for | Conception Technology |
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Sequelize |
| Authentication | JWT, refresh tokens, database-backed sessions |
| Frontend hosting | Netlify |
| Backend hosting | Render |
| Database hosting | Render PostgreSQL |
| Current status | Deployed and accessible online |

## 👨‍💻 Author

**Subroto Sarkar**

- GitHub: [Subbu0071](https://github.com/Subbu0071)
- Repository: [https://github.com/Subbu0071/NexaFlow](https://github.com/Subbu0071/NexaFlow)
- Live application: [https://nexaflow-subbu.netlify.app/](https://nexaflow-subbu.netlify.app/)

---

<p align="center">
  <strong>NexaFlow</strong><br />
  <em>Manage smarter. Grow faster.</em><br />
  Built with modern web technologies, with a focus on security, usability, and maintainability.
</p>
