import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = "6aafe0d0cdb9d83b4ce55ce3";

        const [userResponse, portfolioResponse, transactionResponse] =
          await Promise.all([
            api.get(`/user/${userId}`),
            api.get("/portfolio", { params: { userId } }),
            api.get("/transactions", { params: { userId } }),
          ]);

        setUser(userResponse.data);
        setPortfolio(portfolioResponse.data);
        setTransactions(transactionResponse.data.transactions);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  const summary = portfolio?.summary;

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-container">
        <section className="profile-header">
          <p className="dashboard-label">PROFILE</p>
          <h2>Account Overview</h2>
          <p>Manage and view your virtual trading account.</p>
        </section>

        <section className="profile-card">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="profile-info">
            <h3>{user?.name}</h3>
            <p>Virtual Trading User</p>
          </div>
        </section>

        <section className="profile-stats">
          <div className="profile-stat">
            <span>Virtual Balance</span>
            <strong>
              ₹{(user?.cashBalance || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="profile-stat">
            <span>Portfolio Value</span>
            <strong>
              ₹{(summary?.totalCurrentValue || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="profile-stat">
            <span>Total P/L</span>
            <strong className="profile-profit">
              {summary?.totalProfitLoss >= 0 ? "+" : "-"}₹
              {Math.abs(summary?.totalProfitLoss || 0).toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </strong>
          </div>

          <div className="profile-stat">
            <span>Transactions</span>
            <strong>{transactions.length}</strong>
          </div>
        </section>

        <section className="profile-details">
          <div>
            <span>Account Name</span>
            <strong>{user?.name}</strong>
          </div>

          <div>
            <span>Account Type</span>
            <strong>Virtual Trading Account</strong>
          </div>

          <div>
            <span>Trading Mode</span>
            <strong>Test Market Data</strong>
          </div>

          <div>
            <span>Real Money</span>
            <strong className="safe-status">Not Applicable</strong>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;