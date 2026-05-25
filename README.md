# ModernShop — Full-Stack Ecommerce

A portfolio-grade full-stack ecommerce app: **Next.js**, **MongoDB**, **REST API**, and **optional JWT session auth**. Browse without an account; sign up only if you want order history.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB |
| Auth | bcrypt + JWT cookies (`jose`) |

## Features

- Product catalog (MongoDB or static fallback)
- Cart with `localStorage`
- Guest checkout — no login required
- Optional sign up / sign in on the home page
- Orders linked to user when signed in
- `/account` — order history for logged-in users
- `POST /api/seed` — seed products

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy env file and fill in values:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   MONGODB_URI=mongodb+srv://...
   MONGODB_DB_NAME=modernshop
   AUTH_SECRET=your_long_random_secret_at_least_16_chars
   ```

3. Run dev server:

   ```bash
   npm run dev
   ```

4. Seed products (once):

   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

5. Open [http://localhost:3000](http://localhost:3000) — browse freely, or use **Sign up** on the home page.

## API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | List products |
| GET | `/api/products/[id]` | Single product |
| POST | `/api/orders` | Place order (attaches `userId` if signed in) |
| GET | `/api/orders/[id]` | Order by ID |
| GET | `/api/orders/mine` | Current user's orders (auth required) |
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/signin` | Sign in |
| POST | `/api/auth/signout` | Sign out |
| GET | `/api/auth/me` | Current user |
| POST | `/api/seed` | Seed products |

## Project structure

```
app/           # Pages + API routes
components/    # UI (Navbar, AuthPanel, ProductCard, …)
context/       # Cart + Auth providers
lib/           # MongoDB, sessions, users, db helpers
types/         # Shared TypeScript types
data/          # Static product seed data
```
