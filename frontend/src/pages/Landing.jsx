import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  // Navigate to trading dashboard
  const startTrading = () => navigate("/dashboard");

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-logo">
          <span>Trade</span>X
        </div>
        <span className="landing-tag">VIRTUAL MARKET</span>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-copy">
            <p className="eyebrow">SIMULATE • EXPLORE • LEARN</p>
            <h1>
              Trade the market.
              <br />
              <span>Learn without the risk.</span>
            </h1>
            <p className="hero-text">
              A virtual stock trading experience powered by historical market
              data.
            </p>

            <button className="start-button" onClick={startTrading}>
              Start Trading <span>→</span>
            </button>
          </div>

          <div className="market-preview">
            <div className="preview-top">
              <span>MARKET SNAPSHOT</span>
              <span className="market-dot">● LIVE DATA</span>
            </div>

            <div className="preview-stock">
              <div>
                <strong>RELIANCE</strong>
                <span>Historical Data</span>
              </div>
              <div className="preview-price">
                <strong>₹1,471.86</strong>
                <span>+1.86%</span>
              </div>
            </div>

            <div className="mini-chart">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="preview-footer">
              <span>10 Stocks</span>
              <span>15 Trading Days</span>
              <span>30 Min Data</span>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div>
            <span>01</span>
            <h3>Historical Market Data</h3>
            <p>Explore stock prices across selected dates and times.</p>
          </div>

          <div>
            <span>02</span>
            <h3>Virtual Trading</h3>
            <p>Buy and sell stocks using virtual capital, not real money.</p>
          </div>

          <div>
            <span>03</span>
            <h3>Track Performance</h3>
            <p>Monitor your holdings, transactions and profit or loss.</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <span>₹1,00,000 Virtual Capital</span>
        <span>•</span>
        <span>10 Market Stocks</span>
        <span>•</span>
        <span>Test Market Data</span>
      </footer>
    </div>
  );
}

export default Landing;