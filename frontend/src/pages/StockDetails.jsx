import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./StockDetails.css";

function StockDetails() {
  const { symbol } = useParams();
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("2026-09-21");
  const [selectedTime, setSelectedTime] = useState("15:15");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [tradeType, setTradeType] = useState("BUY");
  const [quantity, setQuantity] = useState(1);
  const [tradeMessage, setTradeMessage] = useState("");

  // Fetch stock history
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await api.get(`/stocks/${symbol}`);
        setStock(response.data);
      } catch (error) {
        console.error("Failed to fetch stock:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [symbol]);

  if (loading) return <div className="stock-details-loading">Loading...</div>;
  if (!stock.length) return <div className="stock-details-loading">Stock not found.</div>;

  const latest = stock[stock.length - 1];
  const times = ["09:15", "09:45", "10:15", "10:45", "11:15", "11:45", "12:15", "12:45", "13:15", "13:45", "14:15", "14:45", "15:15"];

  // Check selected market price
  const handlePriceCheck = async () => {
    try {
      const response = await api.get(`/stocks/${symbol}/price`, {
        params: { date: selectedDate, time: selectedTime },
      });
      setSelectedPrice(response.data);
      setTradeMessage("");
    } catch (error) {
      setSelectedPrice(null);
      setTradeMessage(error.response?.data?.message || "Market data unavailable");
    }
  };

  const tradePrice = selectedPrice?.price || latest.close;
  const totalAmount = quantity * tradePrice;

  // Execute virtual trade
  const handleTrade = async () => {
    try {
      setTradeMessage("");
      const response = await api.post("/trading/trade", {
        userId: "6aafe0d0cdb9d83b4ce55ce3",
        symbol,
        type: tradeType,
        quantity,
        price: tradePrice,
        date: selectedPrice?.date || latest.date,
        time: selectedPrice?.time || latest.time,
      });
      setTradeMessage(response.data.message);
    } catch (error) {
      setTradeMessage(error.response?.data?.message || "Trade execution failed");
    }
  };

  const marketOpen = times.includes(selectedTime);
  const chartData = stock.map((item) => ({
    label: `${item.date} ${item.time}`,
    price: item.close,
  }));

  return (
    <div className="stock-details-page">
      <Navbar />

      <main className="stock-details-container">
        <section className="stock-details-header">
          <div>
            <p className="dashboard-label">MARKET DATA</p>
            <h2>{symbol}</h2>
            <p>Historical market data and virtual trading.</p>
          </div>

          <div className="current-price">
            <span>Latest Price</span>
            <strong>₹{latest.close.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            <small>{latest.date} • {latest.time}</small>
          </div>
        </section>

        <section className="price-selector-card">
          <div className="card-heading">
            <div>
              <p className="dashboard-label">MARKET SIMULATOR</p>
              <h3>Select Market Time</h3>
            </div>
            <span className={marketOpen ? "market-open" : "market-closed"}>
              <i></i>{marketOpen ? "Market Open" : "Market Closed"}
            </span>
          </div>

          <div className="price-selector-form">
            <div>
              <label>Date</label>
              <input type="date" value={selectedDate} onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedPrice(null);
              }} />
            </div>

            <div>
              <label>Time</label>
              <select value={selectedTime} onChange={(e) => {
                setSelectedTime(e.target.value);
                setSelectedPrice(null);
              }}>
                {times.map((time) => <option key={time} value={time}>{time}</option>)}
              </select>
            </div>

            <button onClick={handlePriceCheck}>Check Price</button>
          </div>

          {selectedPrice && (
            <div className="selected-price">
              <div>
                <span>Selected Price</span>
                <strong>₹{selectedPrice.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
              <small>{selectedPrice.date} • {selectedPrice.time}</small>
            </div>
          )}
        </section>

        <section className="trading-card">
          <div className="card-heading">
            <div>
              <p className="dashboard-label">VIRTUAL TRADING</p>
              <h3>Place Order</h3>
            </div>
            <span className="virtual-badge">Virtual Money</span>
          </div>

          <div className="trade-toggle">
            <button className={tradeType === "BUY" ? "active-buy" : ""} onClick={() => setTradeType("BUY")}>BUY</button>
            <button className={tradeType === "SELL" ? "active-sell" : ""} onClick={() => setTradeType("SELL")}>SELL</button>
          </div>

          <div className="trade-form">
            <div>
              <label>Quantity</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>

            <div>
              <label>Price</label>
              <input value={`₹${tradePrice.toFixed(2)}`} readOnly />
            </div>

            <div>
              <label>Total Amount</label>
              <input value={`₹${totalAmount.toFixed(2)}`} readOnly />
            </div>
          </div>

          <button className="execute-trade-button" onClick={handleTrade}>
            Execute {tradeType}
          </button>

          {tradeMessage && <p className="trade-message">{tradeMessage}</p>}
        </section>

        <section className="price-chart-card">
          <div className="card-heading">
            <div>
              <p className="dashboard-label">PRICE HISTORY</p>
              <h3>{symbol} Market Movement</h3>
            </div>
            <span>{stock.length} Data Points</span>
          </div>

          <div className="price-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" hide />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc" }} />
                <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="market-history">
          <div className="card-heading">
            <div>
              <p className="dashboard-label">RECENT DATA</p>
              <h3>Market History</h3>
            </div>
          </div>

          <div className="history-row history-header">
            <span>Date</span>
            <span>Time</span>
            <span>Close</span>
          </div>

          {stock.slice(-10).reverse().map((item) => (
            <div className="history-row" key={`${item.date}-${item.time}`}>
              <span>{item.date}</span>
              <span>{item.time}</span>
              <strong>₹{item.close.toFixed(2)}</strong>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default StockDetails;