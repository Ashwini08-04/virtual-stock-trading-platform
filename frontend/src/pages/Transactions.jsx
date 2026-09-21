import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = "6aafe0d0cdb9d83b4ce55ce3";
        const response = await api.get("/transactions", {
          params: { userId },
        });
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="transactions-page">
      <Navbar />

      <main className="transactions-container">
        <section className="transactions-header">
          <p className="dashboard-label">TRANSACTIONS</p>
          <h2>Trading Activity</h2>
          <p>Review your virtual trading history.</p>
        </section>

        <section className="transactions-section">
          <div className="section-heading">
            <div>
              <p className="dashboard-label">HISTORY</p>
              <h3>Recent Transactions</h3>
            </div>
            <span className="transaction-count">
              {transactions.length} Transactions
            </span>
          </div>

          {loading ? (
            <p className="transaction-loading">Loading transactions...</p>
          ) : !transactions.length ? (
            <div className="empty-transactions">
              <h3>No transactions yet</h3>
              <p>Your BUY and SELL activity will appear here.</p>
            </div>
          ) : (
            <div className="transaction-list">
              {transactions.map((transaction) => (
                <div className="transaction-row" key={transaction._id}>
                  <div className="transaction-main">
                    <div
                      className={`transaction-type ${transaction.type.toLowerCase()}`}
                    >
                      {transaction.type}
                    </div>

                    <div>
                      <strong>{transaction.symbol}</strong>
                      <span>
                        {transaction.date} • {transaction.time}
                      </span>
                    </div>
                  </div>

                  <div className="transaction-info">
                    <span>Quantity</span>
                    <strong>{transaction.quantity}</strong>
                  </div>

                  <div className="transaction-info">
                    <span>Price</span>
                    <strong>
                      ₹{Number(transaction.price).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </div>

                  <div className="transaction-info transaction-total">
                    <span>Total Amount</span>
                    <strong>
                      ₹{Number(transaction.totalAmount).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </strong>
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

export default Transactions;