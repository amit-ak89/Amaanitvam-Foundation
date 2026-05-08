# 🌱 Amaanitvam Foundation – Internship & Secure Certificate Automation System

A production-level full-stack MERN application for NGO internship management and tamper-proof certificate generation.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)

---

## 🚀 Features

### 🔐 Authentication
- JWT-based Admin login/signup
- Role-based access: **Super Admin** & **Volunteer Admin**
- Protected routes with token refresh

### 📋 Internship Application System
- Public application form with resume upload (Cloudinary)
- Fields: Name, Email, Phone, College, Skills, Role, LinkedIn, GitHub, Cover Letter
- Application statuses: `Pending → Selected → Completed / Rejected`
- Email notifications on status change (Nodemailer)

### 📊 Admin Dashboard
- Real-time analytics with Recharts (Bar + Pie charts)
- Search & filter applicants by name, email, college, status
- View resumes, update status, add review notes
- Pagination support

### 🎓 Secure Certificate Generator
- Professional PDF certificates via **Puppeteer**
- Gold elegant border, watermark, NGO logo, QR code
- Unique Certificate ID: `CERT-AMAN-2026-XXXXXX`
- SHA256 hash signature for anti-fake verification
- Auto-email PDF on generation

### 🛡️ Anti-Fake Verification
- Public verification page: `/verify/:certificateId`
- SHA256 hash re-verification on every check
- QR code redirects to verification page
- Shows **VERIFIED** ✅ or **INVALID** ❌

### 📦 Bulk Operations
- Upload CSV → Generate + Email certificates in bulk
- Sample CSV download included

---

## 🗂️ Project Structure

```
Amaanitvam/
├── server/                    # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary + Multer config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── applicationController.js
│   │   └── certificateController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + role guard
│   │   ├── validate.js        # express-validator middleware
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Application.js
│   │   └── Certificate.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── certificateRoutes.js
│   ├── utils/
│   │   ├── certUtils.js       # ID + hash generation
│   │   ├── emailService.js    # Nodemailer templates
│   │   └── pdfGenerator.js    # Puppeteer PDF + QR
│   ├── seed.js                # Sample data seeder
│   ├── index.js               # Express entry point
│   └── .env
│
├── client/                    # React.js + Tailwind Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLayout.js
│   │   │   ├── Sidebar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── StatCard.js
│   │   │   └── StatusBadge.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── hooks/
│   │   │   └── useTheme.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ApplyPage.js
│   │   │   ├── VerifyPage.js
│   │   │   └── admin/
│   │   │       ├── LoginPage.js
│   │   │       ├── DashboardPage.js
│   │   │       ├── ApplicationsPage.js
│   │   │       ├── CertificatesPage.js
│   │   │       └── BulkUploadPage.js
│   │   └── utils/
│   │       └── api.js         # Axios instance + interceptors
│   └── .env
│
└── package.json               # Root scripts (concurrently)
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail account (App Password for Nodemailer)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/amaanitvam-foundation.git
cd amaanitvam-foundation
npm run install-all
```

### 2. Configure Environment Variables

**`server/.env`**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/amaanitvam
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Amaanitvam Foundation <your_email@gmail.com>

CERT_SECRET_KEY=your_certificate_hash_secret
FRONTEND_URL=http://localhost:3000
```

**`client/.env`**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Seed Sample Data

```bash
npm run seed
```

This creates:
- **Super Admin**: `admin@amaanitvam.org` / `Admin@123`
- **Volunteer Admin**: `volunteer@amaanitvam.org` / `Admin@123`
- 6 sample applications

### 4. Run Development Servers

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |

### Applications
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/applications` | Public |
| GET | `/api/applications` | Admin |
| GET | `/api/applications/stats/dashboard` | Admin |
| GET | `/api/applications/:id` | Admin |
| PUT | `/api/applications/:id/status` | Admin |
| DELETE | `/api/applications/:id` | Admin |

### Certificates
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/certificates/verify/:id` | Public |
| GET | `/api/certificates/download/:id` | Public |
| GET | `/api/certificates` | Admin |
| POST | `/api/certificates/generate/:appId` | Admin |
| POST | `/api/certificates/bulk` | Super Admin |

---

## 🛡️ Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT tokens with expiry
- SHA256 certificate hash verification
- Role-based route protection
- Input validation with **express-validator**
- Environment variables for all secrets

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Recharts, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| PDF | Puppeteer |
| QR Code | qrcode |
| Email | Nodemailer |
| File Upload | Cloudinary, Multer |
| Validation | express-validator |

---

## 📸 Pages

- `/` – Landing page
- `/apply` – Internship application form
- `/verify/:certificateId` – Certificate verification
- `/admin/login` – Admin login
- `/admin/dashboard` – Analytics dashboard
- `/admin/applications` – Manage applications
- `/admin/certificates` – Certificate management
- `/admin/bulk` – Bulk CSV certificate generation

---

## 📄 License

MIT © 2026 Amaanitvam Foundation
