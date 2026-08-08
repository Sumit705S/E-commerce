# Fashion Cube 🛍️

🔗 **Live Demo:** [https://tranquil-belekoy-efb776.netlify.app/](https://tranquil-belekoy-efb776.netlify.app/)

A full-stack fashion e-commerce application with a Node.js/Express backend and a vanilla HTML/CSS/JS frontend. Product data is sourced live from the [DummyJSON](https://dummyjson.com) API and filtered down to fashion-relevant categories (clothing, shoes, watches, bags, jewellery, beauty, etc.).

## Features

- 🔐 **Authentication** — register, login, JWT-based sessions, profile management, password change
- 🛒 **Cart** — add, update, remove, and clear cart items (per authenticated user)
- 👗 **Products** — browse, search, filter by category, and view featured products (proxied from DummyJSON)
- 📦 **Orders** — place orders, view order history, cancel orders, and admin order status updates
- 💳 **Payments** — Cash on Delivery, Card, and UPI payment method flows
- 🖥️ **Frontend pages** — home, product listing, product details, cart, checkout, orders, wishlist, profile, login/register, and an admin view

## Tech Stack

**Backend**
- Node.js + Express
- JSON Web Tokens (`jsonwebtoken`) for auth
- `bcryptjs` for password hashing
- `axios` for calling the DummyJSON API
- File-based JSON storage (no external database required) — see [Data Storage](#data-storage)

**Frontend**
- Static HTML, CSS, and vanilla JavaScript served directly by Express (`/frontend`)

## Project Structure

```
E-commerce/
├── frontend/                # Static frontend (served by Express)
│   ├── assets/
│   ├── css/
│   ├── js/                  # api.js, auth.js, cart.js, products.js, etc.
│   ├── pages/                # products, cart, checkout, orders, profile, admin, ...
│   └── index.html
├── src/
│   ├── config/               # File-based database setup
│   ├── controllers/          # auth, product, cart, order, payment logic
│   ├── middleware/            # auth (JWT), error handling
│   ├── models/                 # Cart, Order, User
│   ├── routes/                  # /api/auth, /api/products, /api/cart, /api/orders, /api/payment
│   └── utils/
├── server.js                  # App entry point
├── package.json
└── package-lock.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- npm

### Installation

```bash
git clone https://github.com/Sumit705S/E-commerce.git
cd E-commerce
npm install
```

### Configuration

Create a `.env` file in the project root (this file is git-ignored). Common variables used by the app:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
DUMMY_JSON_API=https://dummyjson.com
FRONTEND_URL=http://your-deployed-frontend-url.com
```

- `PORT` — port the server listens on (defaults to `5000`)
- `JWT_SECRET` — secret used to sign JWTs (required for auth to work securely)
- `DUMMY_JSON_API` — base URL for the product API (defaults to `https://dummyjson.com`)
- `FRONTEND_URL` — comma-separated list of additional allowed CORS origins (e.g. your deployed frontend URL); `localhost` origins are already allowed by default

### Running the App

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

The app will be available at `http://localhost:5000`, serving both the frontend pages and the `/api` backend routes from the same server.

## Data Storage

This project uses a lightweight **JSON file-based database** (see `src/config/database.js`) instead of a full database server — ideal for demos and local development. Data is persisted to a `data/` directory (git-ignored) that's created automatically on first run, and includes a few pre-seeded demo user accounts.

## API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in | No |
| GET | `/api/auth/profile` | Get current user's profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/logout` | Log out | Yes |
| GET | `/api/products` | List products | No |
| GET | `/api/products/categories` | List fashion categories | No |
| GET | `/api/products/featured` | Featured products | No |
| GET | `/api/products/search` | Search products | No |
| GET | `/api/products/:id` | Get a single product | No |
| GET | `/api/cart` | Get current user's cart | Yes |
| POST | `/api/cart/add` | Add item to cart | Yes |
| PUT | `/api/cart/update/:productId` | Update cart item quantity | Yes |
| DELETE | `/api/cart/remove/:productId` | Remove item from cart | Yes |
| DELETE | `/api/cart/clear` | Clear the cart | Yes |
| GET | `/api/orders` | List current user's orders | Yes |
| POST | `/api/orders` | Create an order | Yes |
| GET | `/api/orders/:id` | Get a single order | Yes |
| PUT | `/api/orders/:id/cancel` | Cancel an order | Yes |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| GET | `/api/payment/methods` | List available payment methods | No |
| POST | `/api/payment/initiate` | Initiate a payment | Yes |
| POST | `/api/payment/verify` | Verify a payment | Yes |

All authenticated routes expect a `Authorization: Bearer <token>` header, using the token returned from `/api/auth/login` or `/api/auth/register`.

## License

No license file is currently included in this repository. Add one (e.g. MIT) if you intend to open-source this project.
