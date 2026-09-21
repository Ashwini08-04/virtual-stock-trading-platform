import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Portfolio.css";

function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const userId = "6aafe0d0cdb9d83b4ce55ce3";
        const response = await api.get("/portfolio", { params: { userId } });
        setPortfolio(response.data);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) {
    return <div className="portfolio-loading">Loading portfolio...</div>;
  }

  const summary = portfolio?.summary;
  const holdings = portfolio?.holdings || [];

  // Prepare chart data
  const allocationData = holdings.map((stock) => ({
    name: stock.symbol,
    value: stock.currentValue,
  }));

  const performanceData = [
    { name: "Invested", value: summary?.totalInvested || 0 },
    { name: "Current", value: summary?.totalCurrentValue || 0 },
  ];

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="portfolio-page">
      <Navbar />

      <main className="portfolio-container">
        <section className="portfolio-header">
          <p className="dashboard-label">PORTFOLIO</p>
          <h2>Your Investments</h2>
          <p>Track your holdings and portfolio performance.</p>
        </section>

        <section className="portfolio-summary">
          <div className="portfolio-card">
            <span>Invested Value</span>
            <strong>{formatCurrency(summary?.totalInvested)}</strong>
          </div>

          <div className="portfolio-card">
            <span>Current Value</span>
            <strong>{formatCurrency(summary?.totalCurrentValue)}</strong>
          </div>

          <div className="portfolio-card profit-card">
            <span>Total P/L</span>
            <strong>
              {summary?.totalProfitLoss >= 0 ? "+" : "-"}
              {formatCurrency(Math.abs(summary?.totalProfitLoss || 0))}
            </strong>
            <small>
              {summary?.totalProfitLossPercent >= 0 ? "+" : ""}
              {summary?.totalProfitLossPercent || 0}%
            </small>
          </div>
        </section>

        {holdings.length > 0 && (
          <section className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-heading">
                <p className="dashboard-label">PERFORMANCE</p>
                <h3>Invested vs Current</h3>
              </div>

              <div className="analytics-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e293b"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <YAxis
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        background: "#111827",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#22c55e"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-heading">
                <p className="dashboard-label">ALLOCATION</p>
                <h3>Portfolio Distribution</h3>
              </div>

              <div className="allocation-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={3}
                    >
                      {allocationData.map((stock, index) => (
                        <Cell
                          key={stock.name}
                          fill={`hsl(${index * 36},65%,50%)`}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        background: "#111827",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="allocation-list">
                {allocationData.map((stock) => (
                  <div key={stock.name}>
                    <span>{stock.name}</span>
                    <strong>{formatCurrency(stock.value)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="holdings-section">
          <div className="section-heading">
            <div>
              <p className="dashboard-label">HOLDINGS</p>
              <h3>Your Stocks</h3>
            </div>
          </div>

          {!holdings.length ? (
            <div className="empty-portfolio">
              <h3>No holdings yet</h3>
              <p>Buy stocks to build your virtual portfolio.</p>
            </div>
          ) : (
            <div className="holdings-list">
              {holdings.map((stock) => (
                <div className="holding-row" key={stock.symbol}>
                  <div className="holding-stock">
                    <strong>{stock.symbol}</strong>
                    <span>{stock.quantity} shares</span>
                  </div>

                  <div className="holding-info">
                    <span>Avg. Buy</span>
                    <strong>{formatCurrency(stock.averageBuyPrice)}</strong>
                  </div>

                  <div className="holding-info">
                    <span>Current Price</span>
                    <strong>{formatCurrency(stock.currentPrice)}</strong>
                  </div>

                  <div className="holding-info">
                    <span>Current Value</span>
                    <strong>{formatCurrency(stock.currentValue)}</strong>
                  </div>

                  <div className="holding-info holding-profit">
                    <span>P/L</span>
                    <strong>
                      {stock.profitLoss >= 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(stock.profitLoss))}
                    </strong>
                    <small>
                      {stock.profitLossPercent >= 0 ? "+" : ""}
                      {stock.profitLossPercent}%
                    </small>
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

export default Portfolio;