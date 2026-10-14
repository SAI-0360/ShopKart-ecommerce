# 🛍️ ShopKart — Full-Stack MERN E-Commerce Platform

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%205-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20(HttpOnly%20Cookies)-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay%20Test%20Mode-0C2340?logo=razorpay&logoColor=white)](https://razorpay.com/)

> A modern, production-grade full-stack e-commerce web application featuring a high-readability Amazon-inspired two-tone aesthetic, complete shopping lifecycle from catalog browsing to persistent wishlist, dynamic shopping cart with derived totals, and a secure 3-legged Razorpay payment checkout pipeline with HMAC-SHA256 cryptographic signature verification.

---

## 🔗 Project Links

* **GitHub Repository:** [https://github.com/SAI-0360/ShopKart-ecommerce](https://github.com/SAI-0360/ShopKart-ecommerce)
* **Live Deployment:** 
---

## 📸 Application Preview & UI Architecture

ShopKart adopts a compact, high-density **Amazon 2-color theme** (`zinc-900` dark navigation with `amber-400` accents), designed for intuitive navigation and instant response times.

```
┌───────────────────────────────────────────────────────────────────────────┐
│ ShopKart                               Products   Wishlist (2)   Cart (3)  │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   [ Browse Products ]  ──────►  [ Add to Wishlist / Cart ]                │
│            │                                   │                          │
│            ▼                                   ▼                          │
│   [ Product Details ]                  [ Dynamic Navbar Badges ]          │
│                                                │                          │
│                                                ▼                          │
│                                       [ Shopping Cart ]                   │
│                                                │                          │
│                                                ▼                          │
│                                       [ Secure Checkout ]                 │
│                                                │                          │
│                                                ▼                          │
│                                 [ Razorpay Test Modal (Paise) ]           │
│                                                │                          │
│                                                ▼                          │
│                                 [ HMAC-SHA256 Signature Check ]           │
│                                                │                          │
│                                                ▼                          │
│                              [ Order Placed + Cart Cleared (0) ]          │
│                                                │                          │
│                                                ▼                          │
│                                   [ My Orders History Page ]              │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features Across Engineering Labs

### 🔐 1. Authentication & Session Security (Labs 01 & 02)
* **Bcrypt Password Hashing:** Salted passwords (work factor 10) before persisting to MongoDB.
* **Stateless JWT Tokens:** Cryptographically signed tokens (`HS256`) stored exclusively in client-side **`HttpOnly` cookies** (`res.cookie('token', token, { httpOnly: true })`) to completely eliminate Cross-Site Scripting (XSS) token theft.
* **Protected Routes:** Reusable Express middleware (`isAuthenticated`) and React route guards (`<ProtectedRoute>` and `<PublicRoute>`).

### 📦 2. Product Catalog & Details (Lab 03)
* **Search & Category Filtering:** Instant search by title and filter pills across Electronics, Fashion, Footwear, etc.
* **Product Details View:** Deep-dive product information, live stock availability indicators, and interactive actions.
* **Responsive Grid:** High-density card layouts with fixed image containers (`h-52 w-full object-cover`).

### ❤️ 3. Persistent Wishlist System (Lab 04)
* **Normalized Data Referencing:** Wishlist stores only 12-byte `ObjectId`s referencing the `Product` collection, preserving the 16 MB MongoDB limit and guaranteeing fresh price/stock data.
* **Populate Pipeline:** Mongoose `.populate('wishlist')` resolves product details on demand.
* **Atomic Deduplication:** Enforced using MongoDB's `$addToSet` and `$pull` operators to eliminate race conditions.
* **Real-Time Badge:** Navbar wishlist count updates dynamically via synchronized events.

### 🛒 4. Shopping Cart & Global State (Lab 05)
* **Quantity-Based Subdocuments:** Cart entries model `{ product: ObjectId, quantity: Number }` with `min: 1`.
* **Global Cart Context:** Centralized state management via React Context API (`CartContext.jsx`) providing single source of truth across Navbar, Product Cards, and Cart Page.
* **Derived State Mathematics:** Subtotal ($\sum \text{price} \times \text{qty}$) and item count ($\sum \text{qty}$) are derived synchronously on render using `Array.prototype.reduce()` — **never stored in MongoDB**.
* **Stock Limit Enforcement:** Both client-side stepper disabling and server-side validation (`newQuantity > product.stock -> 400 Bad Request`).
* **Granular Item Loading:** Independent `updatingId` state prevents the entire cart screen from freezing during quantity adjustments.

### 💳 5. Checkout, Orders & Razorpay Payment (Lab 06)
* **Shipping Form Validation:** Regex validation for 10-digit mobile numbers and 6-digit Indian PIN codes.
* **Immutable Purchase Snapshots:** Orders snapshot `{ name, price, quantity, image }` at checkout time, ensuring future catalog price changes never alter past receipts.
* **3-Legged Razorpay Checkout (Test Mode):** Server creates Razorpay orders in **paise** ($\text{totalAmount} \times 100$) to prevent floating-point rounding errors.
* **HMAC-SHA256 Cryptographic Verification:** Node.js `crypto` recalculates `crypto.createHmac("sha256", SECRET).update(order_id + "|" + payment_id).digest("hex")` before marking orders as `PAID`.
* **Atomic Stock Decrement:** Stock is reduced on the server via MongoDB `$inc: { stock: -quantity }` only after signature verification succeeds.
* **IDOR / BOLA Order Security:** `GET /orders/:id` strictly checks `order.user === req.user._id`, returning `403 Forbidden` if an unauthorized user attempts to view another customer's order.
* **Post-Payment Reset:** User's MongoDB cart is cleared and global `CartContext` resets Navbar to `Cart (0)` without page reload.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router DOM v7, Axios |
| **Backend** | Node.js, Express.js 5, Cookie-Parser, CORS, Dotenv |
| **Database** | MongoDB Atlas, Mongoose ODM v9 |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js, HttpOnly Secure Cookies |
| **Payment Gateway**| Razorpay Node SDK (Backend) + Razorpay Standard Checkout JS (Frontend) |
| **Cryptography** | Node.js native `crypto` module (HMAC-SHA256 signature verification) |

---

## 📁 Repository Directory Structure

```text
ShopKart/
├── .gitignore                                     # Global root ignore (excludes .env, node_modules, builds)
├── README.md                                      # Comprehensive project documentation
│
├── server/                                        # Express.js Backend API
│   ├── .env.example                               # Environment variables template (NO SECRETS)
│   ├── .gitignore                                 # Backend-specific ignore
│   ├── package.json                               # Backend dependencies & run scripts
│   ├── index.js                                   # Server entry point, CORS config, DB connection
│   │
│   ├── controllers/                               # Business logic controllers
│   │   ├── customer.controller.js                 # Register, Login, Logout, Profile
│   │   ├── product.controller.js                  # Product Catalog CRUD
│   │   ├── wishlist.controller.js                 # Add, Remove, Populate Wishlist
│   │   ├── cart.controller.js                     # Add, Update Quantity, Remove, Filter Nulls
│   │   └── order.controller.js                    # Razorpay Order creation, HMAC check, Order history
│   │
│   ├── models/                                    # Mongoose Data Schemas
│   │   ├── customer.model.js                      # User schema with embedded wishlist & cart
│   │   ├── product.model.js                       # Product catalog schema with stock tracking
│   │   └── order.model.js                         # Order snapshot schema with payment tracking
│   │
│   ├── routes/                                    # Express Router definitions
│   │   ├── customer.route.js                      # /customers endpoints
│   │   ├── product.route.js                       # /products endpoints
│   │   ├── wishlist.route.js                      # /wishlist endpoints
│   │   ├── cart.route.js                          # /cart endpoints
│   │   └── order.route.js                         # /orders endpoints
│   │
│   ├── middlewares/                               # Custom middlewares
│   │   └── auth.middleware.js                     # JWT extraction, verification & req.user binding
│   │
│   └── utils/                                     # Helper utilities
│       └── generateTokens.js                      # jwt.sign() helper with 2-day expiry
│
└── client/
    └── shopkart-frontend/                         # React 19 Frontend Application (Vite)
        ├── index.html                             # HTML entry point (loads Razorpay SDK)
        ├── package.json                           # Frontend dependencies
        ├── vite.config.js                         # Vite configuration with Tailwind CSS v4
        │
        └── src/
            ├── App.jsx                            # Route definitions & Context Provider wrapper
            ├── main.jsx                           # React DOM root
            ├── index.css                          # Tailwind CSS styling directives
            │
            ├── context/                           # React Global State
            │   ├── AuthContext.jsx                # User login state & session persistence
            │   └── CartContext.jsx                # Global cart array, derived subtotal & item count
            │
            ├── routes/                            # Route Guards
            │   ├── ProtectedRoute.jsx             # Redirects unauthenticated users to /login
            │   └── PublicRoute.jsx                # Redirects authenticated users to /home
            │
            ├── services/                          # HTTP Client
            │   └── api.js                         # Axios instance (baseURL: 8000, withCredentials: true)
            │
            ├── components/                        # Reusable UI components
            │   ├── Navbar.jsx                     # Amazon 2-tone navigation with live cart/wishlist badges
            │   ├── ProductCard.jsx                # Card with Add to Cart / Add Another & Wishlist toggle
            │   └── WishlistCard.jsx               # Dedicated wishlist card with quick removal
            │
            └── pages/                             # Route Pages
                ├── Landing.jsx                    # Public marketing landing page
                ├── Login.jsx                      # Customer login
                ├── Register.jsx                   # Customer registration
                ├── Home.jsx                       # Customer dashboard & featured sections
                ├── Products.jsx                   # Full searchable & filterable product catalog
                ├── ProductDetails.jsx             # In-depth product specification page
                ├── Wishlist.jsx                   # Customer wishlist view
                ├── Cart.jsx                       # Shopping cart with stepper controls & order summary
                ├── Checkout.jsx                   # Shipping address form & Razorpay payment trigger
                ├── OrderSuccess.jsx               # Post-payment confirmation receipt screen
                └── Orders.jsx                     # Customer order history with item snapshots
```


## ⚙️ Getting Started & Local Installation

### Prerequisites
Make sure you have installed on your machine:
* [Node.js](https://nodejs.org/) (v18.x or higher)
* [npm](https://www.npmjs.com/) (v9.x or higher)
* [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas free cloud cluster)
* [Razorpay Account](https://dashboard.razorpay.com/) (Free account in **Test Mode**)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/SAI-0360/ShopKart-ecommerce.git
cd ShopKart-ecommerce
```

---

### Step 2: Backend Setup & Environment Configuration

1. Navigate to the backend directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the provided template:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   # Server Port
   PORT=8000

   # MongoDB Connection URI (Atlas or Local)
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shopkart?retryWrites=true&w=majority

   # JWT Secret Key (Any random secret string)
   JWT_SECRET=super_secret_shopkart_jwt_key_2026

   # Razorpay Test Mode Credentials (From Dashboard -> Settings -> API Keys)
   RAZORPAY_KEY_ID=rzp_test_yourKeyIdHere
   RAZORPAY_KEY_SECRET=yourRazorpayKeySecretHere
   ```
   > ⚠️ **CRITICAL SECURITY NOTICE:** Never commit your `.env` file to GitHub. The root `.gitignore` is pre-configured to keep it excluded.

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will boot on `http://localhost:8000` and output `DB connected! Server started at 8000`.*

---

### Step 3: Frontend Setup & Execution

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd client/shopkart-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on `http://localhost:5174` (or `http://localhost:5173`).*

4. Open your browser and visit: **`http://localhost:5174`**

---

## 🧪 Testing the Complete Purchase Flow (with Razorpay Test Mode)

To test the complete end-to-end shopping experience:

1. **Register / Login:** Create an account at `/register` or login at `/login`.
2. **Browse Products:** Visit `/products`, filter by category, or search items.
3. **Wishlist & Cart:** 
   - Click the ❤️ icon on any product $\rightarrow$ Watch the Wishlist badge in the Navbar increment to `Wishlist (1)`.
   - Click **"Add"** $\rightarrow$ Watch the button dynamically morph into the **`[ − ] [ 1 ] [ + ]`** quantity stepper and the Navbar update to `Cart (1)`.
4. **View Cart:** Click **Cart** in the navigation $\rightarrow$ Adjust quantities using `+` and `-` steppers, or remove an item. Notice the subtotal recalculates instantly.
5. **Checkout:** Click **"Proceed to Checkout"** $\rightarrow$ Enter your shipping address (10-digit mobile number auto-formats and strips `+91`/spaces).
6. **Razorpay Test Payment:**
   - Click **"Place Order"** to open the Razorpay Standard Checkout popup.
   - Choose any of the test methods below to simulate a successful payment.
7. **Verification & Reset:**
   - The popup closes $\rightarrow$ Backend validates the cryptographic HMAC-SHA256 signature and marks the order as `PAID`.
   - You are redirected to `/order-success/:id` with your generated order receipt.
   - The Navbar cart badge automatically resets to `Cart (0)`.
8. **Order History:** Visit `/orders` to view your permanent, snapshotted order receipt.

---

### 💳 Razorpay Test Mode Cheatsheet (Quick Verification Methods)

When testing payments using your `rzp_test_...` key, use these shortcuts to pass transactions instantly without entering real bank details or phone numbers:

| Method | How to Pass Instantly | Credentials / Input Required | Why Use It? |
| :--- | :--- | :--- | :--- |
| **🏦 Netbanking** *(Fastest & Recommended)* | 1. Select **Netbanking**<br>2. Pick **any bank** (SBI, HDFC, ICICI, etc.)<br>3. Click **"Success"** on the mock bank screen | **None!** Zero usernames, passwords, or OTPs required. | **1-Click bypass.** No form filling or fake credential typing needed. |
| **📱 UPI Simulation** | 1. Select **UPI / QR**<br>2. Enter any dummy VPA (e.g. `success@razorpay` or `test@upi`)<br>3. Click **Pay Now** $\rightarrow$ Click **"Success"** on simulation prompt | Any dummy VPA string with `@` | Tests modern UPI deep-link / collect-request UX. |
| **💳 Test Debit / Credit Card** | 1. Select **Card**<br>2. Card Number: `4111 1111 1111 1111`<br>3. Expiry: Any future date (e.g., `12/30`)<br>4. CVV: Any 3 digits (`123`)<br>5. Click **"Success"** (or OTP: `123456`) | Test Card: `4111 1111 1111 1111`<br>CVV: `123`<br>Expiry: `12/30` | Validates standard card form parsing and 3D Secure simulation. |
| **👛 Wallets** | 1. Select **Wallet**<br>2. Choose Mobikwik, Freecharge, or Airtel Money<br>3. Click **"Success"** on the mock confirmation screen | Any mock mobile number | Tests wallet third-party redirection. |

> [!TIP]
> **Simulating Payment Failure & Rollback:**  
> To verify that your system handles rejections gracefully (inventory is not decremented, cart remains intact, and order stays `PENDING_PAYMENT`), select **Netbanking** or **Card** and click the red **"Failure"** button on Razorpay's test simulation page.

---

## 📡 REST API Reference

All protected endpoints require an authenticated JWT delivered via the `token` HttpOnly cookie.

### 👤 Customer Authentication (`/customers`)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/customers/register` | ❌ | Register new account (`fullName, email, password, phone`). Returns cookie. |
| `POST` | `/customers/login` | ❌ | Login with credentials (`email, password`). Returns JWT cookie. |
| `GET` | `/customers/me` | ✅ | Fetch profile of currently authenticated user. |
| `POST` | `/customers/logout` | ❌ | Clears the `token` cookie. |

### 🛍️ Product Catalog (`/products`)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/products` | ❌ | Fetch all active catalog products. |
| `GET` | `/products/:id` | ❌ | Fetch detailed information for a single product by ID. |
| `POST` | `/products` | ❌ | Create new product document (`name, price, stock, category, image`). |

### ❤️ Wishlist System (`/wishlist`)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/wishlist` | ✅ | Fetch populated wishlist items for authenticated user. |
| `POST` | `/wishlist/:productId` | ✅ | Add product ID to user wishlist via atomic `$addToSet`. |
| `DELETE`| `/wishlist/:productId` | ✅ | Remove product ID from user wishlist via atomic `$pull`. |

### 🛒 Shopping Cart (`/cart`)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/cart` | ✅ | Fetch populated cart items; automatically filters orphaned nulls. |
| `POST` | `/cart/:productId` | ✅ | Add product (qty 1) or increment existing item. Validates stock. |
| `PATCH`| `/cart/:productId` | ✅ | Update exact quantity (`{ quantity }`). Rejects qty < 1 or qty > stock. |
| `DELETE`| `/cart/:productId` | ✅ | Remove product item from user cart. |

### 💳 Checkout & Orders (`/orders`)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/orders/create-payment-order` | ✅ | Re-validates stock, calculates server total, creates ShopKart pending order & Razorpay order (paise). |
| `POST` | `/orders/verify-payment` | ✅ | Verifies HMAC-SHA256 signature, sets `PAID`, decrements stock (`$inc`), and clears cart. |
| `GET` | `/orders` | ✅ | Fetch current authenticated user's order history sorted newest first. |
| `GET` | `/orders/:id` | ✅ | Fetch single order by ID with strict IDOR ownership verification (`403 Forbidden` if unauthorized). |

---

## 🔒 Security Best Practices Implemented

1. **HttpOnly Cookie Authentication:** Prevents malicious client-side scripts from reading tokens via `document.cookie`, mitigating XSS credential theft.
2. **Server-Side Authoritative Pricing:** The server computes `totalAmount` directly from database records; client-submitted totals are ignored to prevent price tampering.
3. **Cryptographic Payment Integrity:** Payment signatures are verified using native `crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)` before releasing inventory or marking orders paid.
4. **IDOR / BOLA Prevention:** Every order query verifies that `order.user.toString() === req.user._id.toString()`. Users cannot view or tamper with orders belonging to others.
5. **Atomic Inventory Control:** MongoDB `$inc: { stock: -quantity }` prevents race conditions when decrementing stock across concurrent purchases.
6. **Zero Secrets in Repository:** Pre-configured root and backend `.gitignore` rules prevent `.env` credentials, API keys, or certificates from ever being committed to GitHub.

---

## 👤 Author & Project Info

* **Author:** SAI ([@SAI-0360](https://github.com/SAI-0360))
* **Application:** ShopKart Full-Stack MERN Platform
