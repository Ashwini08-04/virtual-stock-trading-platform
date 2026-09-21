\# TradeX — Virtual Stock Trading Platform



TradeX is a virtual stock trading platform that allows users to explore historical stock market data and practice buying and selling stocks using virtual money.



The platform uses predefined test market data with no real-money transactions.



\## Features



\- 📊 View available stocks and latest prices

\- 📅 Select a historical trading date and time

\- 💹 View stock price for a specific date/time

\- 📈 Interactive historical price charts

\- 🟢 Buy stocks using virtual money

\- 🔴 Sell stocks from available holdings

\- 💼 Manage virtual portfolio

\- 📊 Track invested value and current value

\- 💰 Monitor profit and loss

\- 🧾 View transaction history

\- ⭐ Create a personal stock watchlist

\- 🔎 Search available stocks

\- 👤 Predefined virtual trading account

\- 📱 Responsive interface for desktop and mobile

\- 🔐 Environment variables protected with `.gitignore`



\## Tech Stack



\### Frontend



\- React.js

\- Vite

\- React Router

\- Tailwind CSS

\- Recharts

\- Axios



\### Backend



\- Node.js

\- Express.js

\- MongoDB

\- Mongoose

\- CSV Parser

\- CORS

\- dotenv



\## Project Structure



```text

VirtualStockTrading/

│

├── backend/

│   ├── data/

│   │   └── market\_data.csv

│   │

│   ├── src/

│   │   ├── config/

│   │   ├── controllers/

│   │   ├── models/

│   │   └── routes/

│   │

│   ├── generateMarketData.js

│   ├── importMarketData.js

│   ├── resetDemo.js

│   ├── seedUser.js

│   ├── server.js

│   ├── package.json

│   └── .env

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── services/

│   │   ├── App.jsx

│   │   └── main.jsx

│   │

│   ├── package.json

│   └── vite.config.js

│

├── .gitignore

└── README.md

