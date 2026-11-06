# NexaFlow — Mini ERP & Lead Management System



  **Manage smarter. Grow faster.**

  A secure, full-stack business management application designed to simplify user administration, lead management, and business workflows.

  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)



---

## 1. Overview

**NexaFlow** is a Mini ERP (Enterprise Resource Planning) and Lead Management System developed as a full-stack technical project for **Conception Technology**.

The application provides a centralized platform where administrators can manage users, monitor business leads, and oversee essential business operations through a responsive dashboard.

It follows a client-server architecture, with a React-based frontend, a Node.js and Express backend, and PostgreSQL for persistent data storage.

NexaFlow focuses on three important principles:

- **Security:** Authentication, protected APIs, role-based access, and session management.
- **Simplicity:** A clean interface designed to make business operations easier.
- **Scalability:** A modular architecture that can be extended with additional business management features.

### What can you do with NexaFlow?

| Feature | Description |
|---|---|
| User Authentication | Register, log in, and securely access the application. |
| Session Management | Restrict users to one active device session. |
| Password Recovery | Request a password reset through email. |
| Admin Dashboard | Monitor lead statistics and business activity. |
| User Management | Create, search, update, activate, deactivate, and delete user accounts. |
| Lead Management | Create, view, search, filter, update, and delete leads. |
| Lead Import | Import lead records from Excel files. |
| Lead Export | Export lead records into Excel format. |
| Lead Tracking | Track leads through different business statuses. |
| Responsive Interface | Access the application on desktop, tablet, and mobile devices. |

---

## 2. Application Roles

NexaFlow currently supports two account roles.

### Administrator

The administrator has access to the management dashboard and administrative operations.

Capabilities include:

- View dashboard statistics.
- Create and manage user accounts.
- Search and filter registered users.
- Change user account status.
- Manage user roles.
- Create and manage leads.
- Import and export lead records.
- Monitor lead status and activity.

### Registered User

Registered users have access to their own user portal.

Capabilities include:

- Register an account.
- Log in securely.
- Access the user portal.
- Submit enquiries.
- View their own submitted enquiries.
- Recover their password through the reset process.

**Access control:** Administrative APIs are protected by authentication and role-based authorization. Regular users cannot access administrator-only operations.

---

## 3. Key Features

### Authentication & Security

NexaFlow implements a secure authentication workflow using:

- JSON Web Tokens (JWT).
- Password hashing using bcrypt.
- HTTP-only refresh-token cookies.
- Access-token refresh and rotation.
- Database-backed active sessions.
- Single-active-device session restriction.
- Session expiration and heartbeat monitoring.
- Protected frontend routes.
- Role-based backend authorization.
- Password recovery using single-use reset tokens.
- Security middleware and API rate limiting.

**Single-device session design:** Each user is associated with one active session. A second login is rejected while an existing session is considered active. Stale or expired sessions can be replaced according to the session lifecycle rules.

### Dashboard & Analytics

The administrator dashboard provides a centralized overview of lead activity.

Depending on the selected date range, it displays:

- Total leads.
- Lead status distribution.
- Conversion rate.
- Lead growth trends.
- Recent lead records.
- Date-based filtering.

### Lead Management

The lead management module supports:

- Creating new leads.
- Viewing lead records.
- Updating lead information.
- Deleting leads.
- Searching by lead details.
- Filtering by status.
- Sorting records.
- Paginated results.
- Excel import and export.

Supported lead statuses:

| Status | Meaning |
|---|---|
| New | Newly created lead. |
| Contacted | Initial communication has taken place. |
| Qualified | Lead has been identified as a potential opportunity. |
| Converted | Lead has successfully converted. |
| Lost | Lead is no longer an active opportunity. |

### User Management

Administrators can:

- Create user accounts.
- View registered users.
- Search by name, email, or mobile number.
- Filter by role and account status.
- Activate or deactivate accounts.
- Update user roles.
- Delete user accounts.

Newly created account credentials are communicated through the configured email service when email delivery succeeds.

### Excel Import & Export

NexaFlow supports Excel-based lead management.

**Import:** Upload an Excel workbook containing the required lead columns:

- `name`
- `email`
- `mobile`

An optional `status` column is also supported.

The import process validates records and rejects invalid rows. The current implementation supports up to 500 rows per import.

**Export:** Download lead records in Excel format for reporting and offline analysis.

> Note: Lead import creates lead records. It does not create login accounts for users.

---

## 4. Technology Stack

NexaFlow is built using modern JavaScript technologies.

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| Vite | Frontend development and build tooling |
| JavaScript | Application programming |
| Tailwind CSS v4 | Responsive styling |
| React Router | Client-side navigation |
| Axios | API communication |
| Lucide React | Interface icons |
| Recharts | Dashboard data visualization |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| Sequelize | ORM and database operations |
| PostgreSQL | Relational database |
| JSON Web Token | Authentication |
| bcrypt | Password hashing |
| Zod | Data validation |
| Nodemailer | Email delivery |
| ExcelJS | Excel import and export |
| Multer | File upload handling |
| Helmet | HTTP security headers |
| express-rate-limit | API rate limiting |
| UUID | Unique identifiers |

### Development Tools

- Git and GitHub — Version control.
- Postman — API testing.
- Visual Studio Code — Code editor.
- pgAdmin / PostgreSQL tools — Database management.
- npm — Package management.

---

## 5. Project Architecture

NexaFlow follows a client-server architecture.

```text
                 NEXAFLOW APPLICATION
                          |
             +------------+------------+
             |                         |
        FRONTEND                    BACKEND
       React + Vite              Node + Express
             |                         |
       Axios API Calls  <----------> REST APIs
                                       |
                                  Middleware
                                       |
                            Authentication / JWT
                                       |
                                Controllers
                                       |
                                   Models
                                       |
                                  Sequelize
                                       |
                                 PostgreSQL
                                       |
                              Persistent Storage
```

The frontend handles the user interface and communicates with the backend through REST APIs.

The backend validates requests, checks authentication and permissions, processes business logic, and interacts with PostgreSQL through Sequelize.

---

## 6. Folder Structure

The repository is organized into separate frontend and backend applications.

```text
mini-erp/
│
├── client/                         # React frontend
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   │
│   │   ├── assets/                 # Images and static assets
│   │   │
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardHeader.jsx
│   │   │   │   ├── LeadsTable.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   │
│   │   │   ├── leads/
│   │   │   │   ├── ImportExport.jsx
│   │   │   │   └── LeadForm.jsx
│   │   │   │
│   │   │   ├── Brand.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── AuthProvider.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── UserPortal.jsx
│   │   │   └── UsersManagement.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── testApi.js
│   │
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Express backend
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   └── leadController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── requireRole.js
│   │   │   └── uploadMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── ActiveSession.js
│   │   │   ├── AdminAuditLog.js
│   │   │   ├── Lead.js
│   │   │   ├── PasswordReset.js
│   │   │   ├── User.js
│   │   │   └── index.js
│   │   │
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── leadRoutes.js
│   │   │
│   │   ├── scripts/
│   │   │   └── createAdmin.js
│   │   │
│   │   ├── services/
│   │   │   └── emailService.js
│   │   │
│   │   └── server.js
│   │
│   ├── .gitignore
│   ├── package.json
│   └── test-email.js
│
├── backups/                        # Local database backups
│
├── .gitignore
├── README.md
└── package.json                    # If present in your local root
```

---

## 7. Getting Started — Run NexaFlow on Your Computer

This guide is intended for developers as well as beginners who want to run the application locally.

You do not need to understand the entire codebase to start the application. Follow the steps in order.

### Step 1 — Install the required software

Install the following tools:

| Software | Purpose | Download |
|---|---|---|
| Node.js (LTS) | Runs the frontend tools and backend | [Download Node.js](https://nodejs.org/) |
| PostgreSQL | Stores application data | [Download PostgreSQL](https://www.postgresql.org/download/) |
| Visual Studio Code | Opens the project files | [Download VS Code](https://code.visualstudio.com/) |
| Git | Downloads the project | [Download Git](https://git-scm.com/downloads) |

After installing Node.js and Git, open PowerShell or the VS Code terminal.

Check that they are installed:

```bash
node -v
npm -v
git --version
```

### Step 2 — Download the project

You can download the project directly from GitHub.

**Option A: Download ZIP**

1. Open the NexaFlow GitHub repository.
2. Click the green **Code** button.
3. Select **Download ZIP**.
4. Extract the downloaded folder.
5. Open the extracted `mini-erp` folder in VS Code.

**Option B: Clone using Git**

Open a terminal and run:

```bash
git clone https://github.com/Subbu0071/mini-erp.git
```

Move into the project directory:

```bash
cd mini-erp
```

### Step 3 — Set up the PostgreSQL database

1. Open PostgreSQL or pgAdmin.
2. Create a database named:

```sql
CREATE DATABASE mini_erp;
```

3. Create a dedicated database user:

```sql
CREATE USER mini_erp_user WITH PASSWORD 'your_secure_password';
```

4. Grant database privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE mini_erp TO mini_erp_user;
```

For PostgreSQL versions that use a restricted `public` schema, also connect to `mini_erp` and run:

```sql
GRANT USAGE, CREATE ON SCHEMA public TO mini_erp_user;
```

Use the credentials you created in the backend environment configuration.

### Step 4 — Configure backend environment variables

Open the `server` folder.

Create a new file named:

```text
.env
```

Add the following configuration, replacing the example values with your own:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_erp
DB_USER=mini_erp_user
DB_PASSWORD=your_secure_password

# Authentication Secrets
JWT_ACCESS_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_another_long_random_secret

# Frontend URL
CLIENT_URL=http://localhost:5173

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

**Important:**

- Keep your `.env` file private.
- Never upload it to GitHub.
- Replace all example credentials with your own.
- Use strong, unique JWT secrets.
- If email functionality is required, configure a valid email account and app password.
- The exact database environment variable names must match the backend configuration in `server/src/config/database.js`. If your local configuration uses different names, follow that file.

### Step 5 — Install backend dependencies

Open a terminal in the project root and run:

```bash
cd server
npm install
```

This installs the backend packages listed in `server/package.json`.

### Step 6 — Start the backend server

From the `server` folder, run:

```bash
npm run dev
```

If your backend package does not define a `dev` script, use:

```bash
node src/server.js
```

The backend should start on:

```text
http://localhost:5000
```

Check the health endpoint:

```text
http://localhost:5000/api/health
```

The server should return a successful health response if the route is configured and the database connection is working.

Keep this terminal open while using the application.

### Step 7 — Create the first administrator account

NexaFlow does not allow public registration to choose the administrator role.

The initial administrator should be created using the backend setup script.

From the `server` folder, inspect the script:

```text
src/scripts/createAdmin.js
```

Follow its required environment variables and execution instructions. If the script is configured as an npm command, run that command from `server`; otherwise use:

```bash
node src/scripts/createAdmin.js
```

Use the credentials created by the script to sign in as an administrator.

### Step 8 — Install frontend dependencies

Open a **second terminal** in VS Code.

Navigate to the frontend folder:

```bash
cd client
npm install
```

### Step 9 — Configure the frontend API URL

The local frontend API service must point to the backend:

```text
http://localhost:5000/api
```

The current Axios configuration is located at:

```text
client/src/services/api.js
```

If the project is configured to use a fixed local API URL, no additional environment setup is necessary for local development.

For a deployment-ready environment, configure the API URL through a Vite environment variable and update the API service accordingly.

### Step 10 — Start the frontend

From the `client` folder, run:

```bash
npm run dev
```

Vite will display a local development URL, usually:

```text
http://localhost:5173/
```

Open that address in your browser.

**Congratulations! NexaFlow is now running locally.**

---

## 8. How to Use NexaFlow

Once the application opens, follow these steps.

### Administrator workflow

1. Open the application in your browser.
2. Sign in using the administrator credentials.
3. Access the Admin Dashboard.
4. Review the dashboard statistics.
5. Open User Management to create and manage accounts.
6. Open Lead Management to add and manage leads.
7. Use the search, filters, and pagination to find records.
8. Import leads using a properly formatted Excel file.
9. Export lead data when required.

### Registered user workflow

1. Open the application.
2. Select Register.
3. Enter your name, email, mobile number, and password.
4. Submit the registration form.
5. Log in using your registered credentials.
6. Access the User Portal.
7. Submit an enquiry and view your own submitted enquiries.

### Excel import format

Prepare an Excel workbook with the following column headers:

| name | email | mobile | status |
|---|---|---|---|
| Rahul Sharma | rahul@example.com | 9876543210 | new |
| Priya Das | priya@example.com | 9876543211 | contacted |
| Amit Roy | amit@example.com | 9876543212 | qualified |

The `status` column is optional. If omitted, the application uses the default `new` status.

Save the workbook as `.xlsx` before importing it.

---

## 9. API Overview

The backend exposes REST API endpoints for authentication, user administration, and lead management.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve the authenticated user |
| POST | `/api/auth/heartbeat` | Update session activity |
| POST | `/api/auth/refresh` | Refresh the access token |
| POST | `/api/auth/logout` | End the active session |
| POST | `/api/auth/forgot-password` | Request password recovery |
| POST | `/api/auth/reset-password` | Reset the password |

### Administrator

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/admin/users` | Retrieve and filter users |
| GET | `/api/admin/users/:id` | Retrieve a user |
| POST | `/api/admin/users` | Create a user |
| PATCH | `/api/admin/users/:id` | Update user details |
| PATCH | `/api/admin/users/:id/status` | Update account status |
| PATCH | `/api/admin/users/:id/role` | Update user role |
| DELETE | `/api/admin/users/:id` | Delete a user |

### Leads

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/leads` | Create a lead as administrator |
| POST | `/api/leads/enquiry` | Submit a user enquiry |
| GET | `/api/leads` | Retrieve accessible leads |
| PATCH | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |
| GET | `/api/leads/export` | Export leads to Excel |
| POST | `/api/leads/import` | Import leads from Excel |
| GET | `/api/leads/stats` | Retrieve dashboard statistics |

**Security note:** Protected endpoints require valid authentication. Administrative endpoints additionally require the administrator role. User lead access is scoped to the authenticated user's own submitted records.

---

## 10. Database Design

NexaFlow uses PostgreSQL with Sequelize ORM.

The primary data models include:

| Model | Responsibility |
|---|---|
| User | Stores registered user and administrator accounts |
| ActiveSession | Stores active login session information |
| PasswordReset | Manages password reset tokens |
| AdminAuditLog | Supports administrative audit records |
| Lead | Stores lead and enquiry information |

### Lead ownership

The Lead model maintains two separate user relationships:

- `ownerId`: Identifies the administrator responsible for a managed lead.
- `submittedById`: Identifies the registered user who submitted an enquiry.

This separation supports different lead workflows without mixing user enquiries and administrator-created leads.

---

## 11. Common Issues & Troubleshooting

### Problem: `npm` is not recognized

**Solution:** Install Node.js and restart your terminal. Verify using:

```bash
node -v
npm -v
```

### Problem: Database connection failed

**Possible causes:**

- PostgreSQL is not running.
- Database name is incorrect.
- Username or password is incorrect.
- Database port is incorrect.
- Environment variables do not match the backend configuration.

Check your `server/.env` file and `server/src/config/database.js`.

### Problem: Port 5000 is already in use

Another application may already be using the port.

Close the existing process or configure a different backend port.

### Problem: Frontend cannot connect to backend

Check that:

1. The backend is running.
2. The frontend API URL is correct.
3. The backend CORS configuration allows the frontend origin.
4. The browser console does not show a network or CORS error.

### Problem: Password recovery email is not received

Check:

- Email address configuration.
- Gmail app password.
- SMTP settings.
- Spam or junk folder.
- Backend terminal error messages.

### Problem: User cannot log in from another device

NexaFlow restricts users to one active device session. An existing active session may prevent another login until it is logged out or expires.

---

## 12. Security Considerations

Security is an important part of NexaFlow's architecture.

The application incorporates:

- Password hashing instead of storing plain-text passwords.
- JWT-based authentication.
- HTTP-only refresh-token cookies.
- Refresh-token rotation.
- Database-backed session validation.
- Single-active-device session enforcement.
- Protected API routes.
- Role-based authorization.
- User-scoped data access.
- Input validation.
- API rate limiting.
- Security-related HTTP headers.
- Environment-based secret management.

**Deployment reminder:** Local development settings are not sufficient for production. Configure HTTPS, production-grade secrets, secure cookie settings, appropriate CORS origins, database access controls, backups, and production email delivery before deploying.

---

## 13. Running the Application — Quick Reference

After the initial installation, you only need two terminals.

**Terminal 1 — Backend**

```bash
cd mini-erp/server
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd mini-erp/client
npm run dev
```

Open:

```text
http://localhost:5173/
```

Make sure PostgreSQL is running before starting the backend.

---

## 14. Future Enhancements

NexaFlow is designed to support further improvements as the project evolves.

Potential enhancements include:

- Dedicated user invitation and bulk user import.
- Advanced reporting and analytics.
- More detailed audit-log viewing.
- Additional lead assignment workflows.
- Advanced notification management.
- Improved automated testing.
- Production deployment and monitoring.
- Expanded business modules.

These are potential future improvements, not claims of currently implemented functionality.

---

## 15. Project Information

| Detail | Information |
|---|---|
| Project Name | NexaFlow |
| Project Type | Mini ERP & Lead Management System |
| Architecture | Client–Server |
| Frontend | React + Vite |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM | Sequelize |
| Authentication | JWT + Refresh Tokens |
| Development Status | Functional development build |
| Developed For | Conception Technology |

### Developed as a technical project for Conception Technology.

---

## 16. Author & Repository

**GitHub Repository:**  
[https://github.com/Subbu0071/mini-erp](https://github.com/Subbu0071/mini-erp)

**Developer:** Subroto Sarkar

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---



  **NexaFlow**

  *Manage smarter. Grow faster.*

  Built with modern web technologies and a focus on security, usability, and maintainability.


