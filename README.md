# 📈 TradeX — Virtual Stock Trading Platform

TradeX is a full-stack virtual stock trading simulator that lets users explore historical market data and practice buying and selling stocks with virtual money — with **zero real-money risk**.

Built on the **MERN stack** (MongoDB, Express, React, Node.js), the platform replays predefined historical market data so users can pick any past date/time, view prices, and execute simulated trades against a virtual cash balance.

🎥 **[Watch the Demo Video](https://drive.google.com/file/d/1hvsrWrOH04UQAwAwiWTIBaD-vfYNNQ7X/view)**

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Data Models](#-data-models)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## ✨ Features

| Category | Details |
|---|---|
| 📊 **Market Data** | Browse all available stocks with latest prices, search by symbol/name |
| 📅 **Historical Trading** | Select any historical date & time to view the exact price at that moment |
| 📈 **Price Charts** | Interactive historical price charts powered by Recharts |
| 🟢🔴 **Buy / Sell** | Execute simulated buy/sell orders against a virtual cash balance |
| 💼 **Portfolio Management** | Track holdings, invested value, current value, and unrealized P&L |
| 🧾 **Transaction History** | Full log of every trade with date, time, quantity, and price |
| ⭐ **Watchlist** | Save stocks of interest for quick access |
| 👤 **Virtual Account** | Predefined demo user account with starting cash balance |
| 📱 **Responsive UI** | Optimized for both desktop and mobile |
| 🔐 **Secure Config** | Environment variables kept out of version control via `.gitignore` |

---

## 🛠 Tech Stack

**Frontend**
- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- React Router DOM
- Tailwind CSS 4
- Recharts (data visualization)
- Axios (HTTP client)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- CSV Parser (for seeding historical market data)
- CORS, dotenv

---

## 📂 Project Structure

```text
virtual-stock-trading-platform/
│
├── backend/
│   ├── data/
│   │   └── market_data.csv          # Predefined historical market data
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── portfolioController.js
│   │   │   ├── stockController.js
│   │   │   ├── tradingController.js
│   │   │   ├── transactionController.js
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   ├── Holding.js
│   │   │   ├── MarketData.js
│   │   │   ├── Transaction.js
│   │   │   └── User.js
│   │   └── routes/
│   │       ├── portfolioRoutes.js
│   │       ├── stockRoutes.js
│   │       ├── tradingRoutes.js
│   │       ├── transactionRoutes.js
│   │       └── userRoutes.js
│   │
│   ├── generateMarketData.js        # Script to generate synthetic market data
│   ├── importMarketData.js          # Imports CSV data into MongoDB
│   ├── resetDemo.js                 # Resets the demo account/portfolio
│   ├── seedUser.js                  # Seeds the default virtual user
│   ├── server.js                    # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StockDetails.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Transactions.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios instance / API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔌 API Overview

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — confirms the API is running |
| `GET` | `/api/stocks` | List all available stocks with latest prices |
| `GET` | `/api/stocks/:symbol` | Get historical price data for a stock |
| `GET` | `/api/stocks/:symbol/price` | Get the price of a stock at a specific date/time |
| `POST` | `/api/trading/trade` | Execute a BUY or SELL trade |
| `GET` | `/api/portfolio` | Get the user's current portfolio and holdings |
| `GET` | `/api/transactions` | Get the full transaction history |
| `GET` | `/api/user/:userId` | Get user profile & cash balance |

---

## 🗃 Data Models

- **User** — name, virtual `cashBalance` (defaults to ₹100,000)
- **MarketData** — symbol, date, time, OHLC (open/high/low/close), volume
- **Holding** — per-user stock holdings with quantity & average buy price
- **Transaction** — logged BUY/SELL trades with quantity, price, total amount, date & time

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/Ashwini08-04/virtual-stock-trading-platform.git
cd virtual-stock-trading-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Variables](#-environment-variables) below).

Seed the database with historical market data and a demo user:

```bash
node importMarketData.js
node seedUser.js
```

Start the backend server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔐 Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

> ⚠️ Never commit your `.env` file — it's already excluded via `.gitignore`.

---

## 📜 Available Scripts

**Backend** (`/backend`)
| Script | Description |
|---|---|
| `npm run dev` | Start the backend with hot-reload (nodemon) |
| `npm start` | Start the backend in production mode |
| `node importMarketData.js` | Import `market_data.csv` into MongoDB |
| `node generateMarketData.js` | Generate synthetic historical market data |
| `node seedUser.js` | Seed the default virtual trading account |
| `node resetDemo.js` | Reset the demo account and portfolio to initial state |

**Frontend** (`/frontend`)
| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run linting with oxlint |

---

## 🗺 Roadmap

- [ ] User authentication (multi-user support)
- [ ] Real-time price simulation
- [ ] Leaderboard for top-performing virtual portfolios
- [ ] Deploy live demo (Vercel + Render/Railway)

---

## 👩‍💻 Author

**Ashwini** — [@Ashwini08-04](https://github.com/Ashwini08-04)

---

⭐ If you found this project useful, consider giving it a star on GitHub!
