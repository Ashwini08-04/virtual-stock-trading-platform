import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("tradex_watchlist")) || []
  );

  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userId = "6aafe0d0cdb9d83b4ce55ce3";

        const [stocksResponse, userResponse, portfolioResponse] =
          await Promise.all([
            api.get("/stocks"),
            api.get(`/user/${userId}`),
            api.get("/portfolio", { params: { userId } }),
          ]);

        const stocksWithPrices = await Promise.all(
          stocksResponse.data.map(async (stock) => {
            const priceResponse = await api.get(
              `/stocks/${stock.symbol}/price`,
              {
                params: {
                  date: stock.latestDate,
                  time: "15:15",
                },
              }
            );

            return {
              ...stock,
              price: priceResponse.data.price,
            };
          })
        );

        setStocks(stocksWithPrices);
        setUser(userResponse.data);
        setPortfolio(portfolioResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Add or remove stock from watchlist
  const toggleWatchlist = (symbol) => {
    const updated = watchlist.includes(symbol)
      ? watchlist.filter((item) => item !== symbol)
      : [...watchlist, symbol];

    setWatchlist(updated);
    localStorage.setItem("tradex_watchlist", JSON.stringify(updated));
  };

  // Filter stocks by search term
  const filteredStocks = stocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const summary = portfolio?.summary;

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">
        <section className="dashboard-header">
          <div>
            <p className="dashboard-label">MARKET OVERVIEW</p>
            <h2>Good evening, {user?.name || "Ashwini"}</h2>
            <p>Monitor the market and manage your virtual investments.</p>
          </div>

          <div className="market-status">
            <span></span>
            Market Data Available
          </div>
        </section>

        <section className="summary-grid">
          <div className="summary-card">
            <span>Virtual Balance</span>
            <strong>
              ₹
              {(user?.cashBalance || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
            <small>Available cash</small>
          </div>

          <div className="summary-card">
            <span>Invested Value</span>
            <strong>
              ₹
              {(summary?.totalInvested || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
            <small>Current holdings</small>
          </div>

          <div className="summary-card">
            <span>Portfolio Value</span>
            <strong>
              ₹
              {(summary?.totalCurrentValue || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
            <small>Current market value</small>
          </div>

          <div className="summary-card profit-card">
            <span>Total P/L</span>
            <strong>
              {summary?.totalProfitLoss >= 0 ? "+" : "-"}₹
              {Math.abs(summary?.totalProfitLoss || 0).toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </strong>
            <small>
              {summary?.totalProfitLossPercent >= 0 ? "+" : ""}
              {summary?.totalProfitLossPercent || 0}%
            </small>
          </div>
        </section>

        {/* Watchlist section */}
        {watchlist.length > 0 && (
          <section className="watchlist-section">
            <div className="section-heading">
              <div>
                <p className="dashboard-label">WATCHLIST</p>
                <h3>My Watchlist</h3>
              </div>

              <span className="watchlist-count">
                {watchlist.length} Stocks
              </span>
            </div>

            <div className="watchlist-grid">
              {stocks
                .filter((stock) => watchlist.includes(stock.symbol))
                .map((stock) => (
                  <div
                    className="watchlist-card"
                    key={stock.symbol}
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                  >
                    <div>
                      <span className="stock-symbol">{stock.symbol}</span>
                      <p>Market Stock</p>
                    </div>

                    <div className="watchlist-price">
                      <strong>
                        ₹
                        {stock.price.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>

                      <span>Latest • {stock.latestDate}</span>
                    </div>

                    <button
                      className="remove-watchlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(stock.symbol);
                      }}
                    >
                      ★
                    </button>
                  </div>
                ))}
            </div>
          </section>
        )}

        <section className="market-section">
          <div className="section-heading">
            <div>
              <p className="dashboard-label">MARKET</p>
              <h3>Available Stocks</h3>
            </div>

            <span className="watchlist-count">
              {filteredStocks.length} Stocks
            </span>
          </div>

          {/* Stock search */}
          <div className="stock-search">
            <input
              type="text"
              placeholder="Search stocks... e.g. RELIANCE"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="loading-text">Loading stocks...</p>
          ) : !filteredStocks.length ? (
            <div className="no-stocks">
              <h3>No stocks found</h3>
              <p>Try searching with another stock symbol.</p>
            </div>
          ) : (
            <div className="stock-grid">
              {filteredStocks.map((stock) => (
                <div
                  className="stock-card"
                  key={stock.symbol}
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                >
                  <button
                    className="watchlist-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(stock.symbol);
                    }}
                    title={
                      watchlist.includes(stock.symbol)
                        ? "Remove from watchlist"
                        : "Add to watchlist"
                    }
                  >
                    {watchlist.includes(stock.symbol) ? "★" : "☆"}
                  </button>

                  <div>
                    <span className="stock-symbol">{stock.symbol}</span>
                    <p>Market Stock</p>
                  </div>

                  <div className="stock-price">
                    <strong>
                      ₹
                      {stock.price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>

                    <span className="positive">
                      Latest • {stock.latestDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;