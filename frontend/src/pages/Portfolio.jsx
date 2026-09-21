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

  const allocationData = holdings.map((stock) => ({
    name: stock.symbol,
    value: stock.currentValue,
  }));

  const performanceData = [
    { name: "Invested", value: summary?.totalInvested || 0 },
    { name: "Current", value: summary?.totalCurrentValue || 0 },
  ];

  // Use subtle tones for a consistent premium palette
  const allocationColors = ["#64748b", "#94a3b8", "#475569", "#22c55e"];

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
          <div>
            <p className="dashboard-label">PORTFOLIO</p>
            <h2>Your Investments</h2>
            <p>Track your holdings and portfolio performance.</p>
          </div>
        </section>

        <section className="portfolio-summary">
          <div className="portfolio-card">
            <span>Invested Value</span>
            <strong>{formatCurrency(summary?.totalInvested)}</strong>
            <small>Capital deployed</small>
          </div>

          <div className="portfolio-card">
            <span>Current Value</span>
            <strong>{formatCurrency(summary?.totalCurrentValue)}</strong>
            <small>Market valuation</small>
          </div>

          <div className="portfolio-card portfolio-profit">
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
              <div className="analytics-top">
                <div>
                  <p className="analytics-label">PERFORMANCE</p>
                  <h3>Portfolio Value</h3>
                </div>
                <span className="analytics-meta">INR</span>
              </div>

              <div className="analytics-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="#172235"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 9 }}
                    />
                    <Tooltip
                      cursor={{ fill: "#111a2a" }}
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        background: "#101827",
                        border: "1px solid #26354b",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                      barSize={42}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-top">
                <div>
                  <p className="analytics-label">ALLOCATION</p>
                  <h3>Portfolio Mix</h3>
                </div>
                <span className="analytics-meta">
                  {holdings.length} STOCK{holdings.length > 1 ? "S" : ""}
                </span>
              </div>

              <div className="allocation-content">
                <div className="allocation-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={48}
                        paddingAngle={2}
                        stroke="#0b1220"
                        strokeWidth={2}
                      >
                        {allocationData.map((stock, index) => (
                          <Cell
                            key={stock.name}
                            fill={
                              allocationColors[
                                index % allocationColors.length
                              ]
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                          background: "#101827",
                          border: "1px solid #26354b",
                          borderRadius: "8px",
                          color: "#f8fafc",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="allocation-list">
                  {allocationData.map((stock, index) => (
                    <div key={stock.name}>
                      <span>
                        <i
                          style={{
                            background:
                              allocationColors[
                                index % allocationColors.length
                              ],
                          }}
                        ></i>
                        {stock.name}
                      </span>

                      <strong>{formatCurrency(stock.value)}</strong>
                    </div>
                  ))}
                </div>
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

            <span className="holding-count">
              {holdings.length} POSITION{holdings.length !== 1 ? "S" : ""}
            </span>
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
                    <span>AVG. BUY</span>
                    <strong>{formatCurrency(stock.averageBuyPrice)}</strong>
                  </div>

                  <div className="holding-info">
                    <span>CURRENT</span>
                    <strong>{formatCurrency(stock.currentPrice)}</strong>
                  </div>

                  <div className="holding-info">
                    <span>VALUE</span>
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