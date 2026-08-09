# Findora 🔍

> A detective-themed Lost & Found web application built with the MERN stack.

Findora enables users to securely report, search, and recover lost items through a centralised platform with JWT authentication, image uploads, search & filtering, and embedded ownership claims.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19 + Vite, React Router v6, Axios |
| Backend   | Node.js, Express 4, Mongoose            |
| Database  | MongoDB                                 |
| Auth      | JWT (jsonwebtoken) + bcryptjs           |
| Uploads   | Multer 2                                |

---

## Project Structure

```
Findora/
├── frontend/                  # React + Vite SPA
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/        # Static images (logo, hero, etc.)
│   │   │   ├── icons/         # SVG icon assets
│   │   │   └── styles/        # Global CSS partials (variables, reset, etc.)
│   │   ├── components/
│   │   │   ├── common/        # Button, Input, Modal, Spinner, Badge, Card, Alert
│   │   │   ├── layout/        # Navbar, Footer, Sidebar, PageWrapper
│   │   │   ├── auth/          # LoginForm, RegisterForm
│   │   │   ├── items/         # ItemCard, ItemForm, ItemFilter, ImageUpload, ClaimForm, ClaimList
│   │   │   └── profile/       # ProfileCard, EditProfileForm, UserItemsList
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/             # useAuth, useItems, useForm, useDebounce
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ReportItem.jsx
│   │   │   ├── BrowseItems.jsx
│   │   │   ├── ItemDetails.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── NotFound.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   ├── api.js         # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   └── itemService.js
│   │   ├── utils/             # formatDate, validators, constants, helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                   # Express REST API
│   ├── config/
│   │   └── database.js        # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect()
│   │   ├── uploadMiddleware.js # Multer upload
│   │   └── errorMiddleware.js # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   └── Item.js            # Includes embedded Claim subdocument
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/               # Uploaded item images (git-ignored)
│   ├── utils/                 # generateToken, asyncHandler, apiFeatures
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## API Routes (planned)

### Auth – `/api/auth`
| Method | Endpoint    | Access  | Description         |
|--------|-------------|---------|---------------------|
| POST   | /register   | Public  | Create new account  |
| POST   | /login      | Public  | Login, receive JWT  |
| GET    | /me         | Private | Get current user    |

### Items – `/api/items`
| Method | Endpoint              | Access          | Description              |
|--------|-----------------------|-----------------|--------------------------|
| GET    | /                     | Public          | List items (search/filter/sort/page) |
| POST   | /                     | Private         | Create item + upload images |
| GET    | /:id                  | Public          | Get single item          |
| PUT    | /:id                  | Private (owner) | Update item              |
| DELETE | /:id                  | Private (owner) | Delete item              |
| POST   | /:id/claims           | Private         | Submit claim             |
| PATCH  | /:id/claims/:claimId  | Private (owner) | Approve / reject claim   |

### Users – `/api/users`
| Method | Endpoint    | Access  | Description            |
|--------|-------------|---------|------------------------|
| GET    | /:id        | Public  | View user profile      |
| PUT    | /profile    | Private | Update own profile     |
| GET    | /:id/items  | Public  | Items reported by user |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
cp .env.example .env      # Fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev               # Starts on http://localhost:5173
```

---

## Status
> 🚧 **Scaffold only** – all files are placeholder boilerplate. No business logic implemented yet.
