<div align="center">

# 🚀 MERN Stack Project

A full-stack **MongoDB · Express · React · Node.js** app with JWT login and signup, role-based admin access, a contact form, and an admin dashboard.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000?style=for-the-badge&logo=vercel)](https://mern-project-beta-six.vercel.app)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Frontend](#-frontend)
- [Backend](#%EF%B8%8F-backend)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#%EF%B8%8F-deployment)
- [Author](#-author)

---

## ✨ Features

- 🔐 **Authentication**: users sign up and log in with JWT. Passwords are hashed with bcrypt.
- 🛡️ **Role-based access**: users with `isAdmin` can open a protected admin dashboard.
- 📊 **Admin dashboard**: shows counts of users, admins and messages, lists all users and messages, and lets an admin delete them.
- 📬 **Contact form**: messages are saved to MongoDB and show up in the dashboard.
- ✅ **Request validation**: incoming data is checked against Zod schemas by an Express middleware.
- 🧭 **Protected routes**: React Router guards keep logged-out users and non-admins away from protected pages.
- 📱 **Responsive UI**: built with Tailwind CSS, with a mobile hamburger menu.
- ☁️ **Hosted on Vercel**: the frontend and backend are deployed as two separate Vercel projects.

---

## 🛠 Tech Stack

| Layer        | Technologies |
|--------------|--------------|
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS 4, Context API |
| **Backend**  | Node.js, Express 5, Mongoose 9, JSON Web Token, bcryptjs, Zod, CORS, dotenv |
| **Database** | MongoDB (Atlas) |
| **Hosting**  | Vercel (frontend + serverless backend) |

---

## 📁 Project Structure

```
MERN-Project/
├── backend/
│   ├── controllers/
│   │   ├── admin-controller.js     # List & delete users / contacts
│   │   ├── auth-controller.js      # Register & login
│   │   └── contact-controller.js   # Save contact form messages
│   ├── middlewares/
│   │   ├── auth-middleware.js      # JWT verification + admin guard
│   │   ├── error-middleware.js     # Central error handler
│   │   └── validate-middleware.js  # Zod schema validation
│   ├── models/
│   │   ├── user-model.js           # User schema, password hashing, token generation
│   │   └── contact-model.js        # Contact message schema
│   ├── routes/
│   │   ├── auth-route.js
│   │   ├── contact-route.js
│   │   └── admin-route.js
│   ├── utils/db.js                 # MongoDB connection
│   ├── validators/auth-validator.js
│   ├── server.js                   # Express app entry point
│   └── vercel.json                 # Vercel serverless config
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state (token, user, logout)
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Contact.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── App.jsx                 # Routes + route guards
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── vite.config.js
```

---

## 🎨 Frontend

The frontend is a **React 19** single-page app. It uses **Vite** for development and builds, and **Tailwind CSS 4** for styling.

### Pages

| Route      | Page | Access |
|------------|------|--------|
| `/`        | **Home**: hero section, feature cards, and buttons that change depending on whether you're logged in | Public |
| `/signup`  | **Signup**: form for name, email, phone and password | Public |
| `/login`   | **Login**: email and password login. Admins are sent to the dashboard | Public |
| `/contact` | **Contact**: a form that sends name, email and message to the API | Public |
| `/admin`   | **Admin Dashboard**: stats, a users table and a messages table, with delete actions | 🔒 Admin only |
| `*`        | Sends you back to `/` | — |

### How auth works on the frontend

- **`AuthContext`** keeps the JWT in `localStorage`. It reads the user (including `isAdmin`) from the token's payload and provides `storeToken`, `logout`, `isLoggedIn` and `user` to the whole app.
- **`ProtectedRoute` / `AdminRoute`** wrappers in `App.jsx` send unauthorized users to `/login`.
- **`Navbar`** shows a **Dashboard (ADMIN)** link to admins and Login/Sign Up or Logout depending on whether you're logged in.
- API requests send `Authorization: Bearer <token>` to the backend.

### Scripts

```bash
npm run dev       # Start the Vite dev server (http://localhost:5173)
npm run build     # Build for production
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

---

## ⚙️ Backend

The backend is a **REST API** built with **Express 5** and **Mongoose 9**. The code is split into routes, controllers, models and middlewares.

### Request flow

```
Request → CORS → express.json() → Route → [validate (Zod)] → [authMiddleware → adminMiddleware] → Controller → MongoDB
                                                                                                   ↓
                                                                                         errorMiddleware → Response
```

### Data models

**User**

| Field      | Type    | Notes |
|------------|---------|-------|
| `userName` | String  | required |
| `email`    | String  | required |
| `phone`    | String  | required |
| `password` | String  | required, hashed with bcrypt before saving |
| `isAdmin`  | Boolean | default `false` |

Model methods: `generateToken()` creates a JWT that expires after 30 days. `comparePassword()` checks a password against the stored hash with bcrypt.

**Contact**

| Field      | Type   | Notes |
|------------|--------|-------|
| `username` | String | required |
| `email`    | String | required |
| `message`  | String | required |

### Middlewares

- **`validate(schema)`**: checks `req.body` against a Zod schema and returns `400` with the error details if it fails.
- **`authMiddleware`**: verifies the Bearer JWT, loads the user (without the password) and sets `req.user`.
- **`adminMiddleware`**: returns `403` unless `req.user.isAdmin` is true.
- **`errorMiddleware`**: catches errors and returns them in one consistent JSON format.

### Validation rules

| Field      | Rule |
|------------|------|
| `userName` | 3–255 characters |
| `email`    | valid email, max 255 characters |
| `phone`    | 10–20 characters |
| `password` | at least 7 characters |

---

## 📡 API Reference

Base URL (local): `http://localhost:5000`

### Health

| Method | Endpoint      | Description |
|--------|---------------|-------------|
| GET    | `/`           | API info and list of endpoints |
| GET    | `/api/health` | Health check with a timestamp |

### Auth (`/api/auth`)

| Method | Endpoint             | Body | Response |
|--------|----------------------|------|----------|
| POST   | `/api/auth/register` | `{ userName, email, phone, password }` | `{ message, token, userId }` |
| POST   | `/api/auth/login`    | `{ email, password }` | `{ message, token, userId, isAdmin }` |

### Contact (`/api/form`)

| Method | Endpoint            | Body |
|--------|---------------------|------|
| POST   | `/api/form/contact` | `{ username, email, message }` |

### Admin (`/api/admin`) — 🔒 needs `Authorization: Bearer <token>` from an admin account

| Method | Endpoint                  | Description |
|--------|---------------------------|-------------|
| GET    | `/api/admin/users`        | List all users (passwords left out) |
| GET    | `/api/admin/contacts`     | List all contact messages |
| DELETE | `/api/admin/users/:id`    | Delete a user |
| DELETE | `/api/admin/contacts/:id` | Delete a contact message |

<details>
<summary><b>Example: register a user</b></summary>

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"userName":"John","email":"john@example.com","phone":"03001234567","password":"secret123"}'
```

</details>

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB server

### 1. Clone the repository

```bash
git clone https://github.com/Ahtishamkayani01/MERN-Project.git
cd MERN-Project
```

### 2. Start the backend

```bash
cd backend
npm install
# create a .env file (see below)
npm start            # runs on http://localhost:5000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev          # runs on http://localhost:5173
```

### 4. Make an admin user

Sign up through the app, then set `isAdmin: true` on that user in MongoDB (with Atlas or Compass, for example). Log in again to get the admin dashboard.

---

## 🔑 Environment Variables

**`backend/.env`**

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_super_secret_key
PORT=5000
```

**`frontend/.env`** (optional)

```env
VITE_API_URL=http://localhost:5000
```

If `VITE_API_URL` is not set, the frontend uses `http://localhost:5000`.

---

## ☁️ Deployment

Both apps are deployed on **Vercel**:

- **Frontend**: https://mern-project-beta-six.vercel.app
- **Backend**: runs as a Vercel serverless function, configured in `backend/vercel.json`

To deploy your own copy:
1. Import the repo into Vercel twice: once with the root directory set to `frontend`, once with it set to `backend`.
2. Add `MONGODB_URI` and `JWT_SECRET_KEY` to the backend project's environment variables.
3. Set `VITE_API_URL` in the frontend project to the URL of your deployed backend.

---

## 👤 Author

**Ahtisham Kayani**

- GitHub: [@Ahtishamkayani01](https://github.com/Ahtishamkayani01)

<div align="center">

⭐ If you found this project useful, consider giving it a star!

</div>
